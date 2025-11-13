import { FACEMESH_SIMPLIFIED } from './faceMeshSimplified';

export function generateUVLayoutImage(
  landmarks: { x: number; y: number }[],
  size: number = 512
): string {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, size, size);

  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;

  for (const [a, b, c] of FACEMESH_SIMPLIFIED) {
    const uvA = landmarks[a];
    const uvB = landmarks[b];
    const uvC = landmarks[c];

    const xA = uvA.x * size;
    const yA = (1 - uvA.y) * size;
    const xB = uvB.x * size;
    const yB = (1 - uvB.y) * size;
    const xC = uvC.x * size;
    const yC = (1 - uvC.y) * size;

    ctx.beginPath();
    ctx.moveTo(xA, yA);
    ctx.lineTo(xB, yB);
    ctx.lineTo(xC, yC);
    ctx.closePath();
    ctx.stroke();
  }

  return canvas.toDataURL('image/png');
}
