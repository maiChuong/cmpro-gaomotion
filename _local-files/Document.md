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

### 2. Inside `gaomotion-web`
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

### 3. Inside `bpymotion-blender`
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