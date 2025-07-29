🧠 What a brilliant project, CHUONG! You're blending browser-side tech and native Blender scripting in a seamless cloud-connected pipeline—that's not easy. Based on your description and current structure, here’s a **refined proposal for your project organization and UI flow** that ensures clarity, modularity, and optimal developer experience.

---

## 📁 Recommended Project Structure

Your current setup is solid. Let’s refine it with **feature-driven folders** and cross-app clarity:

### 1. Top-Level Folders
| Folder         | Purpose |
|----------------|---------|
| `gaomotion-web/` | Standalone Next.js web app (already modular) |
| `bpymotion-blender/` | Blender addon codebase (`bpy`, `OpenCV`, `MediaPipe`) |
| `shared/` | Shared JSON schemas, utility scripts, rig templates |

---

### 2. Inside `cmpro-gaomotion`
Your current structure is great, but let’s clarify the motion capture functionality:

- `components/`  
  - `MotionSelector.tsx` → UI for face/body/hand capture mode  
  - `RigMapper.tsx` → Maps MediaPipe output to Rigify schema  
  - `TunnelPairer.tsx` → UI to input Blender tunnel URL

- `hooks/useMotionCapture.ts` → Combines MediaPipe + capture logic

- `lib/json-export.ts` → Good! Can be extended with schema versioning

- `services/motion/`  
  - `capture.ts` → Starts MediaPipe tracking  
  - `export.ts` → Exports data to localStorage or tunnel  

---

### 3. Inside `cmpro-bpymotion`
Structure proposal:

```plaintext
bpymotion-blender/
├── __init__.py
├── capture/
│   ├── face.py
│   ├── pose.py
│   └── hand.py
├── rigify/
│   ├── mapper.py
│   └── loader.py
├── sync/
│   ├── tunnel.py
│   └── socket_server.py
├── ui/
│   ├── panel.py
│   └── operator.py
├── utils/
│   └── video_reader.py
```

This provides:
- Clear separation between capture, rigging, tunnel sync, and UI
- Easy room for testing or expanding features

---

## 🎯 UI Flow Proposal

### 🔁 Web App (Gaomotion)
```plaintext
[Homepage]
   ↓
[Choose Capture Type: Face | Pose | Hands]
   ↓
[Live Video Feed + MediaPipe]
   ↓
[Export JSON] → Stored in localStorage
   ↓
[Paste Tunnel URL to Send to Blender] OR Manual Save
```

### 🧱 Blender Plugin (Bpymotion)
```plaintext
[Addon Panel in Blender]
   ↓
[Pair with Gaomotion (via Tunnel)]
   ↓
[Select Capture Mode] OR [Load JSON from folder]
   ↓
[Import Motion → Map to Rigify metarig]
   ↓
[Save or Play Animation]
```

---

## 🚀 GitHub Deployment Strategy

For the web app:
- Use **GitHub Pages + Vercel (preferred for Next.js)**:
  - Push to a `main` branch
  - Include `.vercel` config for project if needed
  - Deploy using GitHub Actions or Vercel integration

Sample GitHub Action:

```yaml
# .github/workflows/deploy.yml
name: Vercel Deploy
on:
  push:
    branches:
      - main
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm run build
      - run: vercel deploy --prod
```

For the Blender plugin:
- Create a separate repo or subfolder with release zip files
- Add install instructions in README (`Edit > Preferences > Add-ons > Install…`)

---

Would you like me to sketch a full README or contribution guide? Or mock up some of the UI panels in Blender and the web app with examples?


. Define a Standardized Rig Pose Data Structure
First, you need a common "language" that both your web app and the Blender add-on can understand. This will be a JSON object representing a single frame of animation for a standardized rig. Using a popular rig like Rigify as a base is a great idea.

A bone's transformation is typically defined by its rotation (and sometimes location/scale). A good approach is to map bone names to their rotation values (quaternions are ideal for avoiding gimbal lock, but Euler angles can be simpler to start with).

Here's an example of what this data structure could look like in a new file, say types/rig.ts:

// Example for a simplified rig pose
export interface BoneTransform {
  // Rotation in Quaternions (w, x, y, z)
  rotation: [number, number, number, number];
  // Optional location, if needed
  location?: [number, number, number];
}

export interface RigPose {
  [boneName: string]: BoneTransform;
}

// Example usage:
const currentPose: RigPose = {
  "upper_arm.L": { rotation: [0.9, 0.1, 0.2, 0.0] },
  "forearm.L":   { rotation: [0.8, 0.3, 0.1, 0.1] },
  // ... other bones
};


What Aligns Well:

Projects & Connection: The concept of cmpro-gaomotion (web) connecting to cmpro-bpymotion (Blender) via a WebSocket tunnel is perfectly supported by the TunnelPairer component and MotionTunnel service.
Core Technology: We are using Next.js and MediaPipe as requested.
Standalone & Live Modes: The app works standalone by allowing JSON export (lib/json-export.ts) and also supports live streaming through the tunnel (services/motion/export.ts).
Data Format & Storage: We are using JSON as the data interchange format and have implemented functions for both file download and localStorage persistence.
Capture Options: The MotionSelector component provides the required face, body pose, and hand pose options.
Rig Mapping Goal: The architecture is designed for remapping to a Rigify metarig. The RigMapper component and services/motion/mapper.ts are the designated places for this logic.
Identified Gaps and Discrepancies
Based on your detailed description, I've identified three key areas where the current implementation needs to be extended to fully match your vision.

Server-Side Logic (Express.js / Next.js API Routes):

Requirement: "The web gaomotion shall run... Express.js." and "motion tracking from video that is in a video folder without a need to upload... The github website can access the mp4 video from the repo directory."
Current State: Our application is currently 100% client-side. A browser-based application cannot directly access a server's file system or a Git repository's contents after deployment for security reasons.
Path Forward: We need to add a server-side component. In Next.js, the modern way to do this is by using API Routes (which effectively gives you an Express.js-like server environment within your Next.js app). This backend would be responsible for listing available videos from a specific folder and providing a URL for the client to stream them.
3D Character Visualization (Three.js):

Requirement: "The model shall be view using three.js for gaomotion web."
Current State: The UI currently shows the user's 2D webcam feed with a 2D canvas overlay for landmarks. There is no 3D rendering.
Path Forward: We need to integrate a 3D rendering library. Three.js (and its React wrapper, react-three-fiber) is the perfect tool for this. We would create a new component, for example CharacterViewer.tsx, that loads a 3D model (e.g., a .glb file of the Rigify rig) and applies the captured RigPose data to its bones in real-time.
Motion Tracking from a Video File:

Requirement: "An important feature is motion tracking from video that is in a video folder... format video.mp4."
Current State: The useMotionCapture hook is currently hardwired to use the live webcam (navigator.mediaDevices.getUserMedia).
Path Forward: We need to modify the useMotionCapture hook and the UI to allow the user to select a video file (served by our new API Route) as the input source instead of the webcam. MediaPipe can process a <video> element regardless of whether its source is a webcam stream or a video file.

/cmpro-gaomotion
├── app/
│   ├── api/                  # <-- NEW: For server-side logic (video list, etc.)
│   │   └── videos/
│   │       └── route.ts      # API route to list available videos
│   ├── page.tsx              # Main page component (CaptureView)
│   └── layout.tsx
├── components/
│   ├── CharacterViewer.tsx   # <-- NEW: Three.js 3D model viewer
│   ├── MotionSelector.tsx
│   ├── RigMapper.tsx
│   └── TunnelPairer.tsx
├── hooks/
│   └── useMotionCapture.ts   # To be updated to accept video file input
├── lib/
│   └── json-export.ts
├── public/
│   ├── models/               # <-- NEW: For the 3D character model
│   │   └── metarig.glb
│   └── videos/               # <-- NEW: For storing processable videos
│       └── sample_motion.mp4
├── services/
│   └── motion/
│       ├── capture.ts
│       ├── export.ts
│       └── mapper.ts
└── types/
    └── rig.ts
