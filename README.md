# Anatomy Atelier

Anatomy Atelier is a browser study of the Open 3D Model collection. The skeleton stays on the paper stage, with markers and bilingual field notes. Every other published model — skull, muscles, limbs, nerves, and the sections that show arteries — opens in the official viewer, grouped the same way as the [learning page](https://anatomytool.org/open3dmodel-learn).

The models are teaching models. They are not scans of a patient, and the app is not a clinical or diagnostic tool.

## Audience

- Students meeting the skeleton for the first time, including secondary school, pre-medical, nursing, and art-anatomy courses
- Independent learners who want a spatial view of bone, rather than a flat chart
- Teachers who need a lightweight classroom demo that runs in a browser

## Tech stack

| Area | Stack |
| --- | --- |
| Languages | ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) |
| 3D graphics | ![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white) ![WebGL](https://img.shields.io/badge/WebGL-990000?style=for-the-badge&logo=webgl&logoColor=white) ![glTF](https://img.shields.io/badge/glTF-8BC6A3?style=for-the-badge&logo=gltf&logoColor=white) |
| Build and hosting | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![Cloudflare Pages](https://img.shields.io/badge/Cloudflare%20Pages-F38020?style=for-the-badge&logo=cloudflare&logoColor=white) |
| Version control | ![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white) ![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white) |

The stage is vanilla JavaScript with Three.js 0.170: OrbitControls, a glTF loader, and a Draco decoder shipped in `public/draco`. The skeleton mesh is stored locally in `public/models/overview-skeleton.glb`. Every other model is the official Open 3D viewer, embedded from [Open3DModel — Learn](https://anatomytool.org/open3dmodel-learn). Vite builds the static site, and Cloudflare Pages publishes it from GitHub.

## The model

The skeleton is the Open 3D Man published by AnatomyTOOL. It was made by anatomists at Leiden University Medical Center, University Medical Center Utrecht, Maastricht University, KU Leuven, and collaborating centers, building on BodyParts3D and Z-Anatomy. The file used here is `overview-skeleton-glb.zip` from the [source-file page](https://anatomytool.org/open3dmodel-create).

The published release models the right limbs and mirrors them for the left side. The learn catalog has no separate whole-body circulation model. Arteries appear inside the spinal-cord section (radicular arteries) and the inguinal-canal models (inferior epigastric artery and corona mortis). Nerves are the brachial plexus and the named nerves of the upper limb.

License: [Creative Commons Attribution-ShareAlike (CC BY-SA)](https://creativecommons.org/licenses/by-sa/4.0/). If you share the model or a derivative, keep that license and credit the Open 3D Model project.

## How the study works

**Model library.** The left column follows the learning page: General, Head, Neck and back, Thorax, Abdomen, Pelvis and perineum, Upper limb, Lower limb, then Nerves and Vessels. The same muscle and attachment models are listed again under each region that uses them, as they are on the site. Nerves are listed both under the upper limb and on their own. Vessels lists the published models that actually contain arteries.

**Study stage.** Skeleton stays on the canvas: one standing figure in anatomical position. Choosing a region on the sheet lights those bones where they belong. Every other library entry replaces the canvas with the official viewer for that model. Drag to turn, scroll to zoom, and right-drag to pan.

**Hotspots.** The whole body carries markers from head to heel. Each region then adds a closer set: the skull’s vault and face, the vertebrae from atlas to coccyx, the sternum and ribs, the arm down to the palm, the parts of the hip bone, and the limb from thigh to toes. The femur entry still marks the two ends and the shaft of that one bone.

**Field notes.** Each region carries two or three markers on the bone surface. A marker hides when bone lies between it and the camera. Clicking a marker opens a paper card with:

1. The structure’s name in Traditional Chinese
2. The English anatomical term
3. The part of the skeleton it belongs to
4. One or two sentences on what it does, in both languages

The same note stays in the sheet on the right. On the femur, the three markers are the proximal epiphysis, the shaft, and the distal epiphysis.

**Flashcards.** Cards is a revision set grouped by the same topics as the model library: General, Head, Neck and back, Thorax, Abdomen, Pelvis and perineum, Upper limb, Lower limb, Nerves, and Vessels. A mixed round draws across all of them. Bone cards light that bone on the skeleton. Muscle, nerve, and vessel cards open the official model for that topic, then ask for the structure. Each answer is in Traditional Chinese and English. A finished round can be shuffled again, the missed cards practiced alone, or another topic chosen.

**Progress.** Each answer is stored in this browser. Progress shows how many cards were answered, how many were correct, accuracy, the current and best streak, a bar for each region, the latest answers, and a line for every structure in the sample set.
