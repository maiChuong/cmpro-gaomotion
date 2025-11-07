## LICENSE
Our code is released under the Apache-2.0 License. Our project is intended for academic research purposes only and may NOT be used for commercial purposes.

You are free to use, modify, and distribute this project in academic settings, provided that the following conditions are met:

Non-commercial use: The project may not be used for any commercial purposes.
Citation: If you use this project in your research, please cite the original work.

Commercial Use Restriction
For any commercial use inquiries or to obtain a commercial license, please contact the author at [C.Note](https://maichuong.github.io/cmpro-note/)

# Gao Motion
Mediapipe application
Facial recognition

npm install @mediapipe/holistic @mediapipe/camera_utils babylonjs babylonjs-loaders
npm install react-use react-webcam
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p


Package	Purpose
@mediapipe/holistic	Tracks face, pose, and hands in real time
@mediapipe/camera_utils	Simplifies webcam integration
babylonjs	Core 3D rendering engine
babylonjs-loaders	Loads 3D models (GLTF, OBJ, etc.)
react-webcam	Easy webcam component for React
react-use	Useful hooks like useMediaStream
npm install @mediapipe/tasks-vision

🚀 Vercel Deployment Tips
Keep all MediaPipe logic in client components.

Use dynamic imports to avoid SSR issues.

Host .task models via CDN (like jsDelivr or your own Vercel assets).