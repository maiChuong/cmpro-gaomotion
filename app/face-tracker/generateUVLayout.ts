export function generateUVLayoutImage(
  landmarks: { x: number; y: number }[],
  triangles: [number, number, number][],
  size: number = 512,
  padding: number = 20
): string {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx || landmarks.length === 0 || triangles.length === 0) return '';

  // Step 1: Compute bounding box of UVs
  const xs = landmarks.map((pt) => pt.x);
  const ys = landmarks.map((pt) => pt.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const uvWidth = maxX - minX;
  const uvHeight = maxY - minY;

  // Step 2: Compute scale and offset
  const availableWidth = size - 2 * padding;
  const availableHeight = size - 2 * padding;
  const scale = Math.min(availableWidth / uvWidth, availableHeight / uvHeight);

  const offsetX = padding - minX * scale;
  const offsetY = padding - minY * scale;

  // Step 3: Transform UVs to canvas space
  const transform = (pt: { x: number; y: number }) => {
    const x = pt.x * scale + offsetX;
    const y = size - (pt.y * scale + offsetY); // Flip Y for canvas
    return { x, y };
  };

  // Step 4: Draw background
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, size, size);

  // Step 5: Draw triangles
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;

  for (const [a, b, c] of triangles) {
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
