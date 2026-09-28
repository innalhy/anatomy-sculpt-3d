import * as THREE from "three";
import { stepFocus } from "./cameraFocus.js";

export function startLoop(ctx) {
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    if (ctx.state.suspended) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    if (!ctx.state.dragging && !ctx.state.quizzing && !ctx.reduceMotion && ctx.model) {
      ctx.model.rotation.y += 0.08 * dt;
    }
    stepFocus(dt, ctx);
    ctx.controls.update();
    ctx.updateMarkers();
    ctx.renderer.render(ctx.scene, ctx.camera);
  }
  animate();
}
