# Vercel
https://vercel.com/chuong-mais-projects/cmpro-gaomotion

# Repo
https://github.com/maiChuong/cmpro-gaomotion

# Website
https://cmpro-gaomotion.vercel.app/

TODO:
# upload video for motion capture
mp4
# export JSON rotation data

# Repo reference
https://github.com/imerso/facecap/blob/main/modules/webcam.js

# Plan
Using PNPM
Best Practice

If you're switching to pnpm, keep package.json and just delete:

package-lock.json

node_modules

Then run:

bash
pnpm install


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


node scripts/convert-draw-list.js > faceMeshSimplified.ts

tree -I "node_modules|docs|scripts|.git|.next|.vercel" -L 4 | pbcopy 

npm install @tensorflow/tfjs @tensorflow-models/coco-ssd
Note: multiple categories per instance.

@mediapipe/objectron : one category per instance


chuongmai@192 cmpro-gaomotion % pnpm approve-builds
? Choose which packages to build (Press <space> to select, <a> to toggle all, <i> to invert selection) … 
  ○ core-js
❯ ○ sharp

✅ Select both core-js and sharp
Press a to toggle all selections

Then press Enter to confirm

This will approve the install scripts for both packages, which are:

core-js: used for polyfills (ES features like Promise, Array.includes, etc.)

sharp: used by Next.js for image optimization (native bindings)

