import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export function createControls(camera, domElement, state) {
  const controls = new OrbitControls(camera, domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.target.set(0.25, 0.3, 0);
  controls.minDistance = 0.9;
  controls.maxDistance = 16;
  controls.maxPolarAngle = Math.PI * 0.92;
  controls.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.PAN,
  };
  controls.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: THREE.TOUCH.DOLLY_PAN,
  };
  controls.addEventListener("start", () => {
    state.dragging = true;
    state.focusing = false;
  });
  controls.addEventListener("end", () => {
    state.dragging = false;
  });
  return controls;
}
