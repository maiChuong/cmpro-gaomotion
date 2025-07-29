# Prompt Start
This project named cmpro-gaomotion and it works with a project named cmpro-bpymotion. Both are connected via a cloudflared tunnel. They are github website and blender plugin. They can work as stand-alone web app and blender plugin when disconnected. They solve motion capture for animation data and remapping that data to blender metarig of Rigify. The web gaomotion shall run Next.js, Mediapipe, and Express.js. The blender plugin bpymotion runs bpy opencv mediapipe as well. JSON is the data capture and the web gaomotion shall export the data to be handled or imported to blender using bpymotion; JSON data can be stored using localStorage. Via the cloudflared tunnel port 8000, they can be used in sync or live capture. The options for motion capture shall be three types: face, body pose, and hand pose. These options work with only one Rigify human metarig and the generated rig, these rigs are stored in a folder named character-model that having mesh and rig manualy in place and no need to uppload. The model shall be view using three.js for gaomotion web. The connection pairing is initiated from blender plugin bpymotion to the website url. The other way is from website input request for cloudflared tunnel url which can be copy and paste manually to a web url input. An important feature is motion tracking from video that is in a video foler without a need to upload and format video.mp4. This can be motion tracking by bpymotion plugin or by gaomotion web. The github website can access the mp4 video from the repo directory. Also you can provide github deployment strategy. What is your project structure and UI flow proposal. Here is the current project structure.
.
├── LICENSE
├── README.md
├── _local-files
│   ├── Document.md
│   ├── PROMPT.md
│   └── ServerRun.md
├── app
│   ├── favicon.ico
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── ThemeProvider.tsx
│   ├── ToasterProvider.tsx
│   ├── examples
│   ├── layout
│   └── ui
├── config
│   ├── rigs.ts
│   ├── seo.ts
│   └── theme.ts
├── hooks
│   ├── useAuth.ts
│   ├── useMediaPipe.ts
│   └── useTheme.ts
├── lib
│   ├── constants.ts
│   ├── json-export.ts
│   ├── queryClient.ts
│   ├── tunnel-sync.ts
│   ├── utils
│   └── utils.ts
├── messages
│   └── en.json
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
├── services
│   ├── api
│   └── motion
├── store
│   ├── index.ts
│   ├── settingsStore.ts
│   ├── slices
│   └── tunnelStore.ts
├── styles
│   ├── Fonts.tsx
│   ├── globals.css
│   ├── globals.css.custom
│   └── variables.css
├── tailwind.config.ts
└── tsconfig.json

19 directories, 40 files



# Prompt Cont.
How can I implement the proposed project structure and ui flow with the current project structure? You can process one file at one time. You shall wait for my review and acceptance.

Can you add a "Start/Stop" button to the Live Capture page instead of it starting automatically? You can process one file at one time. You shall wait for my review and acceptance.

# Prompt Cont.
The current project structure is incorrect because it is copied parts from another project. From the context items, you can analyze the missing files and folders along with unused files and folders from the current project structure. You need to follow the instructions to create updated project structure and UI flow. You can process one file at one time. You shall wait for my review and acceptance.