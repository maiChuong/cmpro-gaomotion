https://vercel.com/chuong-mais-projects/cmpro-gaomotion


https://github.com/maiChuong/cmpro-gaomotion

 tree -L 3 -I 'node_modules|.git|dist' | pbcopy
.
├── LICENSE
├── README.md
├── app
│   ├── face-tracker
│   │   └── page.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
└── tsconfig.json

4 directories, 18 files

# Foresight

├── app
│   ├── face-tracker
│   │   ├── page.tsx               # Main tracker page
│   │   ├── WebcamFeed.tsx         # Webcam + MediaPipe logic
│   │   ├── FaceCropCanvas.tsx     # Cropped face display
│   │   ├── BabylonViewer.tsx      # 3D head rendering
│   │   └── ControlPanel.tsx       # UI toggles
│   ├── layout.tsx
│   └── page.tsx                   # Landing page (just replaced)
├── public
│   └── models                     # Optional: host .task models here
│       └── face_landmarker.task
├── styles
│   └── globals.css                # Optional: move CSS here
├── docs
│   └── notes.md


