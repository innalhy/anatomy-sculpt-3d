import * as THREE from "three";
import { HOTSPOTS } from "../content/regions.js";

export function createMarkers({ stage, markerLayer, callout, camera, state, onSpot }) {
  const _world = new THREE.Vector3();
  const _ndc = new THREE.Vector3();
  const _forward = new THREE.Vector3();
  const _dir = new THREE.Vector3();
  const raycaster = new THREE.Raycaster();

  function markerHidden(anchor) {
    anchor.getWorldPosition(_world);
    camera.getWorldDirection(_forward);
    _dir.copy(_world).sub(camera.position);
    const dist = _dir.length();
    if (dist < 1e-4 || _dir.dot(_forward) <= 0) return true;
    _dir.multiplyScalar(1 / dist);
    raycaster.set(camera.position, _dir);
    raycaster.far = dist;
    const solids = state.pickables.filter((mesh) => mesh.material.opacity > 0.9);
    const hits = raycaster.intersectObjects(solids, false);
    const slack = (state.modelRadius || 1) * 0.035;
    if (hits.length && hits[0].distance < dist - slack) return true;
    return false;
  }

  function placeCallout(x, y, visible) {
    if (!state.openSpotId) {
      callout.hidden = true;
      return;
    }
    if (!visible) {
      callout.style.visibility = "hidden";
      return;
    }
    callout.hidden = false;
    callout.style.visibility = "visible";
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    const cw = callout.offsetWidth || 240;
    const ch = callout.offsetHeight || 180;
    let left = x + 28;
    let top = y - Math.min(36, ch * 0.2);
    if (left + cw > w - 10) left = Math.max(8, x - 28 - cw);
    top = Math.max(8, Math.min(top, h - ch - 8));
    left = Math.max(8, Math.min(left, w - cw - 8));
    callout.style.left = `${left}px`;
    callout.style.top = `${top}px`;
  }

  function mountMarkers(organId) {
    markerLayer.replaceChildren();
    const organ = state.built[organId];
    for (const marker of organ.markers) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "marker";
      button.dataset.spot = marker.id;
      const spot = HOTSPOTS[organId].items[marker.id];
      button.setAttribute("aria-label", `${spot.en}, ${spot.zh}`);
      button.append(document.createElement("i"));
      button._anchor = marker.object;
      button.addEventListener("mousedown", (event) => event.preventDefault());
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        onSpot(organId, marker.id);
      });
      markerLayer.append(button);
    }
  }

  function updateMarkers() {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    let anchored = false;
    for (const button of markerLayer.querySelectorAll(".marker")) {
      const selected = button.dataset.spot === state.openSpotId;
      button._anchor.getWorldPosition(_world);
      if (markerHidden(button._anchor)) {
        button.style.display = "none";
        if (selected) placeCallout(0, 0, false);
        if (selected) anchored = true;
        continue;
      }
      _ndc.copy(_world).project(camera);
      const x = (_ndc.x * 0.5 + 0.5) * w;
      const y = (-_ndc.y * 0.5 + 0.5) * h;
      const inside = _ndc.z < 1 && x > -24 && x < w + 24 && y > -24 && y < h + 24;
      button.style.display = inside ? "block" : "none";
      button.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      if (selected) {
        placeCallout(x, y, inside);
        anchored = true;
      }
    }
    if (state.openSpotId && !anchored) callout.style.visibility = "hidden";
  }

  return { mountMarkers, updateMarkers };
}
