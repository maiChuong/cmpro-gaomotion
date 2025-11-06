./app/face-tracker/WebcamFeed.tsx:6:1
Export drawLandmarks doesn't exist in target module
  4 | import Webcam from 'react-webcam';
  5 | import { Holistic } from '@mediapipe/holistic';
> 6 | import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  7 | import { FACEMESH_TESSELATION } from '@mediapipe/face_mesh';
  8 |
  9 | type Props = {

The export drawLandmarks was not found in module [project]/node_modules/@mediapipe/drawing_utils/drawing_utils.js [app-ssr] (ecmascript).
The module has no exports at all.
All exports of the module are statically known (It doesn't have dynamic exports). So it's known statically that the requested export doesn't exist.