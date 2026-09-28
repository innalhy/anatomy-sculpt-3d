import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

function radialShadowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const g = canvas.getContext("2d");
  const grd = g.createRadialGradient(64, 64, 8, 64, 64, 64);
  grd.addColorStop(0, "rgba(92, 64, 44, 0.28)");
  grd.addColorStop(1, "rgba(92, 64, 44, 0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createStudio(stage, markerLayer) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xfbf8f3, 14, 28);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.05, 50);
  camera.position.set(0.55, 0.85, 9.2);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setClearColor(0xfbf8f3, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  stage.insertBefore(renderer.domElement, markerLayer);
  renderer.domElement.addEventListener("contextmenu", (event) => event.preventDefault());

  try {
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.7;
    pmrem.dispose();
  } catch (err) {
    console.warn(err);
  }

  scene.add(new THREE.HemisphereLight(0xfff6ec, 0xd9c4ae, 0.72));
  scene.add(new THREE.AmbientLight(0xfff4e8, 0.18));
  const key = new THREE.DirectionalLight(0xfff3e4, 1.45);
  key.position.set(4.2, 7.2, 5.4);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xf0d8c4, 0.42);
  fill.position.set(-5.5, 2.4, 3.2);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffe4c8, 0.48);
  rim.position.set(-1.5, 3.5, -6);
  scene.add(rim);

  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(11, 7.5),
    new THREE.MeshBasicMaterial({ map: radialShadowTexture(), transparent: true, depthWrite: false })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -2.85;
  scene.add(shadow);

  function resize() {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    if (!w || !h) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
  }
  resize();
  new ResizeObserver(resize).observe(stage);

  return { scene, camera, renderer, shadow };
}

export function frameInSitu(partBox, bodyBox, camera, desiredCam, desiredTarget, state) {
  const bodySize = bodyBox.getSize(new THREE.Vector3());
  const bodyCenter = bodyBox.getCenter(new THREE.Vector3());
  const box = partBox.clone();
  const size = box.getSize(new THREE.Vector3());
  const minH = bodySize.y * 0.62;
  const minW = bodySize.x * 0.82;
  if (size.y < minH) {
    const mid = (box.min.y + box.max.y) / 2;
    box.min.y = mid - minH / 2;
    box.max.y = mid + minH / 2;
  }
  box.min.x = Math.min(box.min.x, bodyCenter.x - minW / 2);
  box.max.x = Math.max(box.max.x, bodyCenter.x + minW / 2);
  const pad = bodySize.y * 0.04;
  box.min.y = Math.max(box.min.y, bodyBox.min.y - pad);
  box.max.y = Math.min(box.max.y, bodyBox.max.y + pad);
  box.min.z = Math.min(box.min.z, bodyBox.min.z);
  box.max.z = Math.max(box.max.z, bodyBox.max.z);
  return frameBox(box, camera, desiredCam, desiredTarget, state);
}

export function frameBox(box, camera, desiredCam, desiredTarget, state) {
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const fov = (camera.fov * Math.PI) / 180;
  const aspect = camera.aspect || 1;
  const fit = (extent, widen = 1) => (extent * 0.62) / (Math.tan(fov / 2) * widen);
  const dist = Math.max(fit(size.y), fit(size.x, aspect), fit(size.z), size.length() * 0.35);
  desiredTarget.copy(center);
  desiredCam.set(center.x + dist * 0.12, center.y + size.y * 0.04, center.z + dist);
  state.focusing = true;
  return dist;
}
