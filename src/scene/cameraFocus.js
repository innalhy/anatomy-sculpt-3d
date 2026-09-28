import * as THREE from "three";

export function aimAtOrgan(organ, desiredCam, desiredTarget, state) {
  const center = new THREE.Vector3();
  organ.root.getWorldPosition(center);
  desiredTarget.copy(center);
  desiredCam.copy(center).add(organ.root.userData.cam);
  state.focusing = true;
}

export function stepFocus(dt, { state, camera, controls, desiredCam, desiredTarget }) {
  if (!state.focusing) return;
  const k = 1 - Math.exp(-dt / 0.22);
  camera.position.lerp(desiredCam, k);
  controls.target.lerp(desiredTarget, k);
  if (camera.position.distanceTo(desiredCam) < 0.02 && controls.target.distanceTo(desiredTarget) < 0.02) {
    state.focusing = false;
  }
}
