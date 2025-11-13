// Normalized neutral face mesh (0–1 range)
export const NEUTRAL_FACE_MESH: { x: number; y: number }[] = Array(468).fill(0).map((_, i) => ({
  x: Math.random() * 0.6 + 0.2, // placeholder: replace with real neutral mesh
  y: Math.random() * 0.6 + 0.2,
}));
