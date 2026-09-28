export function stageView(mode) {
  const embed = mode === "embed";
  return {
    embed,
    viewerHidden: !embed,
    canvasHidden: embed,
    markersHidden: embed,
  };
}
