import { useEffect, useRef } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { getCoverFrame, landmarkToScreen, drawBackground } from "../utils/canvasHelpers";
import { handleSwaraInteraction } from "../utils/handleSwaraInteraction";
import getPinch, { getUiPinch } from "../utils/getPinch";
import { matchHands, handMatchDistance } from "../utils/trackHands";
import { drawSwaraChakra } from "../utils/drawSwaraChakra";
import theme from "../utils/theme";
import { drawCameraOverlay, getOverlayRect } from "../utils/drawCameraOverlay";
import { isTrailOn } from "./useViewSettings";
import { handlePinchControls } from "../utils/pinchControls";
import { drawFingertips, drawIndexTrail, smoothPoint } from "../utils/drawTrail";
import ragaData from "../raga_details.json";

// how many detection frames of index fingertip history the trail keeps
const TRAIL_LENGTH = 18;
// fingertip moving more than this fraction of the screen in one detection frame is treated as suspect
const OUTLIER_FRACTION = 0.2;

export default function useHandTracking({
  selectedRagaRef,
  viewSettingsRef,
  vidRef,
  canvasRef,
  playNote,
  recordSwara,
  handleAllDropdownInteractions
}) {

  const handsRef = useRef(null);

  const cameraRef = useRef(null);
  const viewportRef = useRef({ w: 0, h: 0, dpr: 1 });
  const handStatesRef = useRef([]); // one state per physical hand, see trackHands
  const playedRef = useRef(null);
  const hoverRef = useRef(null);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const prevMouseDownRef = useRef(false);
  const mouseHeldRef = useRef(null);
  const mouseDownRef = useRef(false);
  const currentSwaraRef=useRef(null);


  // canvas matches the viewport, so canvas coords (css px) == client coords
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      viewportRef.current = { w, h, dpr };
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
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

    // detection only stores the latest results; drawing runs on its own loop
    // so the canvas keeps rendering (and mouse play works) without camera frames
    let latestResults = null;
    let lastTrailResults = null;
    let lastMatchedHands = [];
    hands.onResults((results) => { latestResults = results; });

    let rafId;
    const render = () => {
      rafId = requestAnimationFrame(render);
      const results = latestResults || {};
      const ctx = canvas.getContext("2d");
      const { w: W, h: H, dpr } = viewportRef.current;
      const rect = canvas.getBoundingClientRect();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // landmarks always map onto the full viewport, wherever the camera overlay is drawn
      const frame = results.image
        ? getCoverFrame(results.image.width, results.image.height, W, H)
        : { x: 0, y: 0, w: W, h: H };
      const view = viewSettingsRef.current;

      drawBackground(ctx, W, H);
      if (results.image && view.cameraVisible) {
        const overlayRect = getOverlayRect(view.cameraPosition, view.cameraSize, results.image.width, results.image.height, W, H);
        drawCameraOverlay(ctx, results.image, results, overlayRect, {
          windowed: view.cameraPosition !== "fullscreen",
          opacity: view.cameraOpacity,
          blurPx: view.cameraBlurPx,
        });
      }

      const now = performance.now();

      // the chakra fills the space between the top and bottom control bars
      const playH = H - 2 * theme.barHeight;
      const swaraBoxes = drawSwaraChakra(ctx, {
        raga: ragaData.find(r => r.name === selectedRagaRef.current),
        cx: W / 2,
        cy: theme.barHeight + playH / 2,
        layout: { mandraLayout: view.mandraLayout, sthayiExtent: view.sthayiExtent },
        size: Math.min(W, playH) * 0.9,
        currentSwara: currentSwaraRef.current,
        hover: hoverRef.current,
        played: playedRef.current,
        now,
      });

      let hover = null;
      const track = (interaction) => {
        if (interaction.mode === "Played") {
          currentSwaraRef.current = { swara: interaction.swara, sthayi: interaction.sthayi };
          playedRef.current = { ...interaction, at: now };
        } else if (interaction.swara) {
          hover = interaction;
        }
      };

      // mouse interaction
      const { x: mx, y: my } = mousePosRef.current;
      const mouseInteraction = handleSwaraInteraction({
        swaraBoxes, x: mx, y: my,
        isDown: mouseDownRef.current, wasDown: prevMouseDownRef.current, held: mouseHeldRef.current,
        playNote, recordSwara
      });
      mouseHeldRef.current = mouseInteraction.held;
      track(mouseInteraction);
      canvas.style.cursor = mouseInteraction.swara ? 'pointer' : 'default';

      if (handleAllDropdownInteractions) {
        handleAllDropdownInteractions(mx + rect.left, my + rect.top, mouseDownRef.current, prevMouseDownRef.current);
      }
      prevMouseDownRef.current = mouseDownRef.current;

      // hand interaction, pinch state tracked per hand
      // rendering runs faster than detection, so the trail only grows on new detection results
      const isNewDetection = results !== lastTrailResults;
      lastTrailResults = results;
      const allLandmarks = results.multiHandLandmarks || [];
      const hands = isNewDetection
        ? matchHands(handStatesRef.current, allLandmarks.map(l => landmarkToScreen(l[8], frame)), now, handMatchDistance(W, H))
        : lastMatchedHands;
      lastMatchedHands = hands;

      hands.forEach((hand, i) => {
        const landmarks = allLandmarks[i];
        const thumb = landmarkToScreen(landmarks[4], frame);

        // new detection: update pinch + fingertip once. Render frames in between reuse it,
        // so a single detection can never produce two pinch edges
        if (isNewDetection) {
          hand.lastSeen = now;
          hand.wasPinching = hand.pinching;
          hand.wasUiPinching = hand.uiPinching;
          hand.pinching = getPinch(landmarks, hand.pinching);
          hand.uiPinching = getUiPinch(landmarks, hand.uiPinching);

          const raw = landmarkToScreen(landmarks[8], frame);
          // a single-frame leap is usually a mis-detection: hold position until the next frame agrees
          const leap = hand.raw ? Math.hypot(raw.x - hand.raw.x, raw.y - hand.raw.y) : 0;
          const confirmsLeap = hand.suspect && Math.hypot(raw.x - hand.suspect.x, raw.y - hand.suspect.y) < leap / 2;
          if (leap > Math.min(W, H) * OUTLIER_FRACTION && !confirmsLeap) {
            hand.suspect = raw;
          } else {
            hand.suspect = null;
            hand.raw = raw;
            // the index fingertip is smoothed against tracking jitter; the trail, marker and
            // hit-testing all use the smoothed point so what you see is what you touch
            hand.index = smoothPoint(hand.index, raw);
            hand.trail.push(hand.index);
            if (hand.trail.length > TRAIL_LENGTH) hand.trail.shift();
          }
        }
        if (!hand.index) return;
        const index = hand.index;

        if (isTrailOn(view)) drawIndexTrail(ctx, hand.trail);
        drawFingertips(ctx, index, thumb, hand.pinching);

        // edges only count on the frame they were detected
        const wasPinching = isNewDetection ? hand.wasPinching : hand.pinching;
        const wasUiPinching = isNewDetection ? hand.wasUiPinching : hand.uiPinching;

        const handInteraction = handleSwaraInteraction({
          swaraBoxes, x: index.x, y: index.y,
          isDown: hand.pinching, wasDown: wasPinching, held: hand.held,
          playNote, recordSwara
        });
        hand.held = handInteraction.held;
        track(handInteraction);

        if (handleAllDropdownInteractions) {
          handleAllDropdownInteractions(index.x + rect.left, index.y + rect.top, hand.uiPinching, wasUiPinching);
        }
        handlePinchControls(hand, index.x + rect.left, index.y + rect.top, hand.uiPinching, wasUiPinching);
      });

      hoverRef.current = hover;
    };
    rafId = requestAnimationFrame(render);

    handsRef.current = hands;

    const camera = new Camera(vidRef.current, {
      onFrame: async () => await hands.send({ image: vidRef.current }),
      width: 1280,
      height: 720,
    });

    cameraRef.current = camera;
    camera.start();

    return () => {
      cancelAnimationFrame(rafId);
      cameraRef.current?.stop();
      handsRef.current?.close();
    };
  }, [playNote]);
}
