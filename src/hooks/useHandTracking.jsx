import { useEffect, useRef } from "react";
import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { flipLandmark, drawText } from "../utils/canvasHelpers";
import { handleSwaraInteraction } from "../utils/handleSwaraInteraction";
import usePinch from "./usePinch";
import { drawSwaraRows } from "../utils/drawSwaraRows";
import ragaData from "../raga_details.json";

export default function useHandTracking({
  selectedRagaRef,
  vidRef,
  canvasRef,
  playNote,
  handleAllDropdownInteractions
}) {

  const handsRef = useRef(null);

  const cameraRef = useRef(null);
  const isPinchingRef = useRef(false);
  const activeInteractionRef = useRef(null);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const prevMouseDownRef = useRef(false);
  const mouseDownRef = useRef(false);
  const currentSwaraRef=useRef(null);



  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      mousePosRef.current = {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    };


    const handleMouseDown = () => { mouseDownRef.current = true; };
    const handleMouseUp = () => { mouseDownRef.current = false; };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    
    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (!vidRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.8,
      minTrackingConfidence: 0.7,
    });

    hands.onResults((results) => {
      const ctx = canvas.getContext("2d");
      canvas.width = results.image.width;
      canvas.height = results.image.height;



      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
      ctx.restore();

      const rowDrawer = drawSwaraRows(
        ragaData.find(r => r.name === selectedRagaRef.current),
        currentSwaraRef.current
      );
      const swaraBoxes = rowDrawer ? rowDrawer(ctx, canvas.width / 3, canvas.height / 2, activeInteractionRef.current) : [];

      // mouse interaction

      const { x: mx, y: my } = mousePosRef.current;
      let mouseInteraction = handleSwaraInteraction({ctx, swaraBoxes, x: mx, y: my, ref: mouseDownRef, playNote});
      if (mouseInteraction.swara && mouseInteraction.mode==="Played"){ 
        currentSwaraRef.current={
          swara:mouseInteraction.swara,
          sthayi:mouseInteraction.sthayi
        }
        activeInteractionRef.current = mouseInteraction;
      }
      if (canvasRef.current) canvasRef.current.style.cursor = mouseInteraction.swara ? 'pointer' : 'default';


      if (handleAllDropdownInteractions) {
          handleAllDropdownInteractions(mx, my, mouseDownRef.current, prevMouseDownRef.current);
      } 
        prevMouseDownRef.current = mouseDownRef.current;

      ctx.save();
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);

      if (results.multiHandLandmarks && results.multiHandedness) {
        for (let i = 0; i < results.multiHandLandmarks.length; i++) {
          const landmarks = results.multiHandLandmarks[i];
          const handType = results.multiHandedness[i].label === "Right" ? "Left" : "Right";

          drawConnectors(ctx, landmarks, HAND_CONNECTIONS, { color: "#000", lineWidth: 1 });
          drawLandmarks(ctx, landmarks, { color: "#000", radius: 1 });
          
          const [distance, currentlyPinching] = usePinch(landmarks);
          

          const { x, y } = flipLandmark(landmarks[8], canvas);

         
          const canvasRect = canvas.getBoundingClientRect();
          const scaleX = canvasRect.width / canvas.width;
          const scaleY = canvasRect.height / canvas.height;
          const screenX = x * scaleX + canvasRect.left;
          const screenY = y * scaleY + canvasRect.top;






          
          // hand interaction with swaras
          let handInteraction = handleSwaraInteraction({ctx, swaraBoxes, x, y, ref: isPinchingRef, playNote});
          if (handInteraction.swara && handInteraction.mode==="Played") {
            currentSwaraRef.current={
              swara:handInteraction.swara,
              sthayi:handInteraction.sthayi
            }
            activeInteractionRef.current = handInteraction;
          }
          if(handleAllDropdownInteractions){
            handleAllDropdownInteractions(x, y, currentlyPinching, isPinchingRef.current);

          }
          
          drawText(ctx, `${distance.toFixed(3)} ${currentlyPinching ? "Pinch!" : "Not Pinch"} ${handType}`, 900, 100);

        
          isPinchingRef.current = currentlyPinching;
        }
      }

      ctx.restore();
    });

    handsRef.current = hands;

    const camera = new Camera(vidRef.current, {
      onFrame: async () => await hands.send({ image: vidRef.current }),
      width: 1280,
      height: 720,
    });

    cameraRef.current = camera;
    camera.start();

    return () => {
      cameraRef.current?.stop();
      handsRef.current?.close();
    };
  }, [playNote]);
}