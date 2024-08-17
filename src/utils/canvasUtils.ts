export const getPointOnField = (e: MouseEvent, canvas: HTMLCanvasElement, scale: number) => {
  const rect = canvas.getBoundingClientRect() ?? {x: 0, y: 0};

  const touchPos = {
    x: e.clientX,
    y: e.clientY
  };

  return {
    x: (touchPos.x - rect.x) / scale,
    y: (touchPos.y - rect.y) / scale
  };
}
