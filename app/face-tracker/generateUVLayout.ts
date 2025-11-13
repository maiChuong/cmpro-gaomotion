import { FACEMESH_SIMPLIFIED } from './faceMeshSimplified';

export function generateUVLayoutImage(
  landmarks: { x: number; y: number }[],
  size: number = 512,
  padding: number = 20
): string {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, size, size);

  // Step 1: Get bounding box of UVs
  const xs = landmarks.map((pt) => pt.x);
  const ys = landmarks.map((pt) => pt.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const uvWidth = maxX - minX;
  const uvHeight = maxY - minY;
  const scale = Math.min(
    (size - 2 * padding) / uvWidth,
    (size - 2 * padding) / uvHeight
  );

  // Step 2: Normalize and scale UVs
  const transform = (pt: { x: number; y: number }) => {
    const x = (pt.x - minX) * scale + padding;
    const y = (1 - (pt.y - minY) / uvHeight) * scale + padding;
    return { x, y };
  };

  // Step 3: Draw triangles
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;

  for (const [a, b, c] of FACEMESH_SIMPLIFIED) {
    const A = transform(landmarks[a]);
    const B = transform(landmarks[b]);
    const C = transform(landmarks[c]);

    ctx.beginPath();
    ctx.moveTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
    ctx.lineTo(C.x, C.y);
    ctx.closePath();
    ctx.stroke();
  }

  return canvas.toDataURL('image/png');
}
