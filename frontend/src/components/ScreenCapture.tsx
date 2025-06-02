// // frontend/src/components/ScreenCapture.tsx
// import React, { useRef, useState } from 'react';
// import Webcam from 'react-webcam';

// const ScreenCapture: React.FC = () => {
//   const webcamRef = useRef<Webcam>(null);
//   const [capturedImage, setCapturedImage] = useState<string | null>(null);

//   const capture = React.useCallback(() => {
//     const imageSrc = webcamRef.current?.getScreenshot();
//     if (imageSrc) {
//       setCapturedImage(imageSrc);
//       sendToBackend(imageSrc);
//     }
//   }, [webcamRef]);

//   const sendToBackend = async (image: string) => {
//     try {
//       const response = await fetch('http://localhost:5000/analyze', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ image }),
//       });
//       const data = await response.json();
//       console.log('AI Response:', data.answer);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div>
//       <Webcam
//         audio={false}
//         ref={webcamRef}
//         screenshotFormat="image/jpeg"
//         width="100%"
//         videoConstraints={{
//           facingMode: 'user',
//         }}
//       />
//       <button onClick={capture}>Capture</button>
//       {capturedImage && <img src={capturedImage} alt="Captured" />}
//     </div>
//   );
// };

// export default ScreenCapture;
// frontend/src/components/ScreenCapture.tsx
// import React, { useState, useEffect, useRef } from 'react';

// interface ScreenCaptureProps {
//   onError?: (error: Error) => void;
// }

// const ScreenCapture: React.FC<ScreenCaptureProps> = ({ onError }) => {
//   const videoRef = useRef<HTMLVideoElement | null>(null);
//   const [stream, setStream] = useState<MediaStream | null>(null);

//   // Start screen capture
//   const startCapture = async () => {
//     try {
//       const captureStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
//       setStream(captureStream);
//       if (videoRef.current) {
//         videoRef.current.srcObject = captureStream;
//       }
//     } catch (err) {
//       if (onError) onError(err as Error);
//     }
//   };

//   // Stop screen capture
//   const stopCapture = () => {
//     if (stream) {
//       stream.getTracks().forEach(track => track.stop());
//       setStream(null);
//     }
//   };

//   // Capture image every 2 seconds and send to backend
//   useEffect(() => {
//     if (!stream) return;

//     const interval = setInterval(() => {
//       if (!videoRef.current) return;

//       const video = videoRef.current;
//       const canvas = document.createElement('canvas');
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
//       const ctx = canvas.getContext('2d');
//       if (!ctx) return;

//       ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//       const imgData = canvas.toDataURL('image/png');

//       fetch('http://localhost:5000/analyze', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ image: imgData }),
//       }).catch(console.error);
//     }, 2000);

//     return () => clearInterval(interval);
//   }, [stream]);

//   return (
//     <div>
//       <button onClick={stream ? stopCapture : startCapture}>
//         {stream ? 'Stop Screen Capture' : 'Start Screen Capture'}
//       </button>

//       {stream && (
//         <video
//           ref={videoRef}
//           autoPlay
//           playsInline
//           muted
//           style={{ marginTop: 10, maxWidth: '100%', border: '1px solid black' }}
//         />
//       )}
//     </div>
//   );
// };

// export default ScreenCapture;
export {};
