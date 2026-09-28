import "./styles/index.css";
import * as THREE from "three";
import { CATALOG, modelById } from "./content/catalog.js";
import { LIBRARY, regionById } from "./content/regions.js";
import { createStudio, frameBox, frameInSitu } from "./scene/createStudio.js";
import { createControls } from "./scene/controls.js";
import { startLoop } from "./scene/loop.js";
import { loadSkeleton, pointAlong, surfaceToward } from "./scene/loadSkeleton.js";
import { createFieldNotes } from "./ui/fieldNotes.js";
import { createMarkers } from "./ui/markers.js";
import { mountLibrary } from "./ui/library.js";
import { createFlashcards } from "./ui/flashcards.js";
import { createDashboard } from "./ui/dashboard.js";

const boot = document.getElementById("boot");

start().catch((err) => {
  boot.textContent = "The skeleton could not be opened. Reload the page.";
  console.error(err);
});

async function start() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stage = document.getElementById("stage");
  const markerLayer = document.getElementById("markers");
  const cardBody = document.getElementById("card-body");
  const callout = document.getElementById("callout");
  const systemsEl = document.getElementById("systems");

  const state = {
    pickables: [],
    built: {},
    activeId: null,
    openSpotId: null,
    focusing: false,
    dragging: false,
    suspended: false,
    modelRadius: 1,
  };

  const desiredCam = new THREE.Vector3();
  const desiredTarget = new THREE.Vector3();
  const { scene, camera, renderer, shadow } = createStudio(stage, markerLayer);
  const controls = createControls(camera, renderer.domElement, state);
  const { root, meshes, pickables } = await loadSkeleton("/models/overview-skeleton.glb");
  state.pickables = pickables;
  scene.add(root);

  const bodyBox = new THREE.Box3().setFromObject(root);
  const bounds = bodyBox.clone();
  const size = bounds.getSize(new THREE.Vector3());
  state.modelRadius = size.length() * 0.5;
  camera.near = Math.max(state.modelRadius / 400, 0.001);
  camera.far = state.modelRadius * 40;
  camera.updateProjectionMatrix();
  scene.fog = new THREE.Fog(0xfbf8f3, state.modelRadius * 5, state.modelRadius * 16);
  controls.minDistance = state.modelRadius * 0.15;
  controls.maxDistance = state.modelRadius * 6;
  shadow.position.y = bounds.min.y - size.y * 0.004;
  const ground = Math.max(size.x, size.z) * 2.4;
  shadow.scale.set(ground / 11, ground / 7.5, 1);

  const fieldNotes = createFieldNotes({ cardBody, callout, markerLayer, state });
  const markers = createMarkers({
    stage,
    markerLayer,
    callout,
    camera,
    state,
    onSpot: (organId, spotId) => fieldNotes.fillCard(organId, spotId),
  });

  let anchors = [];

  function highlighted(name, region) {
    if (!region.focus) return true;
    if (region.focus.includes(name)) return true;
    return Boolean(region.extra && region.extra(name));
  }

  function applyDim(region, quiet = 0.14) {
    for (const mesh of pickables) {
      const on = highlighted(mesh.name, region);
      mesh.material.transparent = !on;
      mesh.material.opacity = on ? 1 : quiet;
      mesh.material.depthWrite = on;
    }
  }

  function unionOf(region) {
    if (!region.focus) return new THREE.Box3().setFromObject(root);
    const box = new THREE.Box3();
    let found = false;
    for (const mesh of pickables) {
      if (!highlighted(mesh.name, region)) continue;
      box.union(new THREE.Box3().setFromObject(mesh));
      found = true;
    }
    return found ? box : new THREE.Box3().setFromObject(root);
  }

  function placeAnchors(region) {
    for (const anchor of anchors) anchor.removeFromParent();
    anchors = [];
    const placed = [];
    for (const spot of region.spots) {
      const mesh = meshes.get(spot.mesh);
      if (!mesh) continue;
      const dir = new THREE.Vector3(...(spot.dir || [0, 0.25, 1]));
      const world = spot.along == null
        ? surfaceToward(mesh, dir)
        : pointAlong(mesh, spot.along, dir);
      const anchor = new THREE.Object3D();
      root.worldToLocal(world);
      anchor.position.copy(world);
      root.add(anchor);
      anchors.push(anchor);
      placed.push({ id: spot.id, object: anchor });
    }
    state.built[region.id] = { markers: placed };
  }

  function selectRegion(id) {
    const changed = id !== state.activeId;
    state.activeId = id;
    for (const button of document.querySelectorAll(".place")) {
      const on = button.dataset.id === id;
      button.classList.toggle("active", on);
      button.setAttribute("aria-pressed", on ? "true" : "false");
    }
    const region = regionById(id);
    root.rotation.y = 0;
    applyDim(region, 0.22);
    frameInSitu(unionOf(region), bodyBox, camera, desiredCam, desiredTarget, state);
    if (changed) {
      fieldNotes.showPlaceholder("The bones stay where they belong on the body. Choose a marker to read that part.");
      placeAnchors(region);
      markers.mountMarkers(id);
    }
  }

  const appEl = document.querySelector(".app");
  const modesEl = document.getElementById("modes");
  const sessionEl = document.getElementById("session");
  const dashboardEl = document.getElementById("dashboard");
  const kicker = document.getElementById("kicker");
  const libraryTitle = document.getElementById("library-title");
  const hint = document.getElementById("hint");
  const viewer = document.getElementById("viewer");
  const places = document.getElementById("places");
  let currentModel = modelById("skeleton");

  function mountPlaces() {
    places.replaceChildren();
    const label = document.createElement("p");
    label.className = "places-label";
    label.textContent = "On this skeleton";
    const row = document.createElement("div");
    for (const group of LIBRARY) {
      for (const organ of group.organs) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "place";
        button.dataset.id = organ.id;
        button.textContent = organ.en;
        button.addEventListener("click", () => selectRegion(organ.id));
        row.append(button);
      }
    }
    places.append(label, row);
  }

  function fitCanvas() {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  function showSkeleton() {
    stage.classList.remove("is-embed");
    state.suspended = false;
    viewer.hidden = true;
    places.hidden = false;
    markerLayer.hidden = false;
    fitCanvas();
  }

  function mountViewer(item) {
    clearMarks();
    stage.classList.add("is-embed");
    state.suspended = true;
    places.hidden = true;
    markerLayer.hidden = true;
    viewer.hidden = false;
    if (viewer.dataset.src !== item.viewer) {
      viewer.dataset.src = item.viewer;
      viewer.src = item.viewer;
    }
  }

  function showEmbed(item) {
    mountViewer(item);
    kicker.textContent = "Open 3D Model";
    cardBody.replaceChildren();
    const title = document.createElement("h3");
    title.textContent = item.en;
    const blurb = document.createElement("p");
    blurb.className = "fn";
    blurb.textContent = "This is the official Open 3D viewer. Turn it, and hide or show its structures, inside the frame.";
    const source = document.createElement("a");
    source.className = "source";
    source.href = item.page;
    source.target = "_blank";
    source.rel = "noopener noreferrer";
    source.textContent = "Model page on AnatomyTOOL";
    const credit = document.createElement("p");
    credit.className = "fn zh";
    credit.textContent = "Open 3D Model · CC BY-SA";
    cardBody.append(title, blurb);
    if (item.note) {
      const note = document.createElement("p");
      note.className = "fn";
      note.textContent = item.note;
      cardBody.append(note);
    }
    cardBody.append(source, credit);
  }

  function selectModel(id) {
    const item = modelById(id);
    if (!item) return;
    currentModel = item;
    for (const button of systemsEl.querySelectorAll(".organ")) {
      const on = button.dataset.id === id;
      button.classList.toggle("active", on);
      button.setAttribute("aria-pressed", on ? "true" : "false");
    }
    if (item.local) {
      showSkeleton();
      kicker.textContent = "Field Notes";
      const region = state.activeId || "skeleton";
      state.activeId = null;
      selectRegion(region);
      return;
    }
    showEmbed(item);
  }

  function clearMarks() {
    markerLayer.replaceChildren();
    state.openSpotId = null;
    callout.hidden = true;
  }

  function isolate(names) {
    clearMarks();
    const region = { focus: names, extra: null };
    applyDim(region, names ? 0.07 : 0.14);
    frameBox(unionOf(region), camera, desiredCam, desiredTarget, state);
  }

  function presentQuestion(question) {
    if (question?.model) {
      const item = modelById(question.model);
      if (item?.viewer) {
        mountViewer(item);
        hint.textContent = "Use the model in the frame, then choose";
        return;
      }
    }
    showSkeleton();
    places.hidden = true;
    markerLayer.hidden = true;
    isolate(question?.meshes || null);
    hint.textContent = question?.meshes
      ? "Name the lit bone · Drag to turn · Scroll to zoom"
      : "Pick a topic on the left";
  }

  const cards = createFlashcards({
    cardBody,
    kicker,
    sessionEl,
    present: presentQuestion,
    onAnswered() {},
  });

  function setMode(next) {
    appEl.classList.toggle("mode-cards", next === "cards");
    appEl.classList.toggle("mode-progress", next === "progress");
    systemsEl.hidden = next !== "study";
    sessionEl.hidden = next !== "cards";
    dashboardEl.hidden = next !== "progress";
    libraryTitle.textContent = next === "cards" ? "CARDS" : "MODELS";
    if (next !== "cards") {
      hint.textContent = "Drag to turn · Scroll to zoom · Right-drag to pan";
    }
    for (const button of modesEl.querySelectorAll("button")) {
      button.setAttribute("aria-pressed", button.dataset.mode === next ? "true" : "false");
    }
    if (next === "study") {
      selectModel(currentModel?.id || "skeleton");
    } else if (next === "cards") {
      places.hidden = true;
      cards.enter();
    } else {
      dashboard.render();
    }
  }

  const dashboard = createDashboard({
    root: dashboardEl,
    onStart() {
      cards.showTopics();
      setMode("cards");
    },
    onMissed(list) {
      cards.start(list, { en: "Missed", zh: "未掌握" });
      setMode("cards");
    },
  });

  for (const button of modesEl.querySelectorAll("button")) {
    button.addEventListener("click", () => setMode(button.dataset.mode));
  }

  mountPlaces();
  mountLibrary({
    systemsEl,
    library: CATALOG,
    onSelect: selectModel,
  });
  fieldNotes.showPlaceholder("The bones stay where they belong on the body. Choose a marker to read that part.");
  selectModel("skeleton");
  boot.remove();

  startLoop({
    state,
    model: root,
    camera,
    controls,
    desiredCam,
    desiredTarget,
    updateMarkers: markers.updateMarkers,
    renderer,
    scene,
    reduceMotion,
  });
}
