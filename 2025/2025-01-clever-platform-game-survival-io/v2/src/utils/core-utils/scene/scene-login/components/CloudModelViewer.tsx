// import React, {
//   Suspense,
//   useEffect,
//   useState
// } from 'react';
// import { ArcadeRestAPI } from '@core-utils/api/arcade/rest-api';
// import ModelFileViewer from '@core-utils/3d/model-file-viewer';

// interface CloudModelViewerProps {
//   accessPlayToken: string;
//   modelId?: string; // Optional: Model ID for display info
//   autoRotate?: boolean;
//   autoFitCamera?: boolean;
// }

// const CloudModelViewer: React.FC<CloudModelViewerProps> = ({
//   accessPlayToken,
//   modelId,
//   autoRotate = true,
//   autoFitCamera = true,
// }) => {
//   const [modelUrl, setModelUrl] = useState<string | null>(null);
//   const [isLoadingApi, setIsLoadingApi] = useState(false);

//   // Effect to fetch model from API
//   useEffect(() => {
//     const fetchModel = async () => {
//       setIsLoadingApi(true);
//       try {
//         const response = await ArcadeRestAPI.GetModel(accessPlayToken);
//         if (response instanceof ArrayBuffer) {
//           const blob = new Blob([response], { type: 'application/octet-stream' });
//           const url = URL.createObjectURL(blob);
//           setModelUrl(url);
//           console.log('[CloudModelViewer] Model fetched from API successfully:', url);
//         } else {
//           console.error('❌ [CloudModelViewer] Failed to load model from API:', response);
//         }
//       } catch (err) {
//         console.error('❌ [CloudModelViewer] Error fetching model from API:', err);
//       } finally {
//         setIsLoadingApi(false);
//       }
//     };

//     fetchModel();

//     // Cleanup: revoke blob URL on unmount
//     return () => {
//       if (modelUrl) {
//         URL.revokeObjectURL(modelUrl);
//       }
//     };
//   }, [accessPlayToken]);

//   return (
//     <div className="relative w-full h-full overflow-hidden rounded-2xl shadow-lg bg-gray-900">
//       {/* Loading indicator when fetching from API */}
//       {isLoadingApi && (
//         <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-10">
//           <div className="text-white text-lg font-semibold">
//             Loading model from API...
//           </div>
//         </div>
//       )}

//       {/* ModelFileViewer with OrbitControls (no GCAThreeModel mapping) */}
//       {modelUrl && (
//         <Suspense fallback={
//           <div className="flex items-center justify-center h-full text-white">
//             Loading 3D viewer...
//           </div>
//         }>
//           <ModelFileViewer
//             src={modelUrl}
//             modelType="fbx"
//             autoRotate={autoRotate}
//             autoFitCamera={autoFitCamera}
//             scale={0.01}
//             background={0x111827}
//             exposure={1}
//             cameraDistanceMultiplier={1.5}
//             cameraVerticalOffset={0}
//           />
//         </Suspense>
//       )}

//       {/* Info overlay */}
//       {modelId && (
//         <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
//           Model ID: {modelId}
//         </div>
//       )}

//       {/* Note */}
//       <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
//         � Raw FBX (No weapon mapping)
//       </div>
//     </div>
//   );
// };

// export default CloudModelViewer;

import React, {
  Suspense,
  useEffect,
  useState
} from 'react';
import { ArcadeRestAPI } from '@core-utils/api/arcade/rest-api';

import * as ModelFileViewer from '@core-utils/3d/model-file-viewer';

interface CloudModelViewerProps {
  accessPlayToken: string;
}

const CloudModelViewer: React.FC<CloudModelViewerProps> = ({
  accessPlayToken,
}) => {
  const [modelUrl, setModelUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchModel = async () => {
      const response = ArcadeRestAPI.GetModel(
        accessPlayToken
      )
        .then((res) => {
          if (res instanceof ArrayBuffer) {
            const blob = new Blob([res], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            setModelUrl(url);
          } else {
            console.error('Failed to load model:', response);
          }
        })
        .catch((err) => {
          alert(err);
        });
    };

    fetchModel();

    return () => {
      if (modelUrl) {
        URL.revokeObjectURL(modelUrl);
      }
    };
  }, []);

  return (
    <>
      <Suspense fallback={<div>Loading model...</div>}>
        {modelUrl && <ModelFileViewer.default src={modelUrl} modelType='fbx' autoRotate autoFitCamera />}
      </Suspense>
    </>
  );
};

export default CloudModelViewer;
