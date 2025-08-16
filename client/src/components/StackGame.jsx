import { useEffect, useRef, useState } from "react";
import block from "/block2.mp3";

const StackGame = ({ name, score, setScore, setGameState, attempts, maxAttempts }) => {
  const canvasRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const gameStateRef = useRef({
    mode: null,
    restart: null,
  });
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(block);
    audioRef.current.volume = 0.3; 

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    // variablea
    let canvas, context;
    let scrollCounter, cameraY, current, mode, xSpeed;
    const ySpeed = 5; // speed of drop
    const height = 55; // height of each block
    const groundHeight = 50; 
    const boxes = []; 
    let debris = {
      x: 0,
      width: 0,
      y: 0,
    };
    const cameraThreshold = 5; // no. of blocks til the camera starts moving up
    const verticalGapBetweenBlocks = 2;
    let gameOverTime = 0;
    let animationFrameId;
    const MAX_GAME_WIDTH = 700; // maximum width for desktop play area

    const initGame = () => {
      canvas = canvasRef.current;
      context = canvas.getContext("2d");

      resizeCanvas();

      context.font = 'bold 30px "Comic Sans MS", cursive, sans-serif';

      const initialWidth = isMobile ? 250 : 300;
      const initialX = isMobile
        ? canvas.width / 2 - initialWidth / 2
        : Math.max(
            canvas.width / 2 - initialWidth / 2,
            (canvas.width - MAX_GAME_WIDTH) / 2
          );

      boxes[0] = {
        x: initialX,
        y: 0,
        width: initialWidth,
      };

      restart();
      animate();
    };

    const resizeCanvas = () => {
      canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      if (boxes.length > 0) {
        const initialWidth = isMobile ? 250 : 300;
        boxes[0].x = isMobile
          ? canvas.width / 2 - initialWidth / 2
          : Math.max(
              canvas.width / 2 - initialWidth / 2,
              (canvas.width - MAX_GAME_WIDTH) / 2
            );
        boxes[0].width = initialWidth;
      }
    };

    //left boundary for block movement
    const getLeftBoundary = () => {
      return isMobile ? 0 : (canvas.width - MAX_GAME_WIDTH) / 2;
    };

    // right boundary for block movement
    const getRightBoundary = () => {
      return isMobile ? canvas.width : (canvas.width + MAX_GAME_WIDTH) / 2;
    };

    const newBox = () => {
      const lastBoxTopY = boxes[current - 1].y + height;
      boxes[current] = {
        x: isMobile ? 0 : getLeftBoundary(),
        y: lastBoxTopY + verticalGapBetweenBlocks * height,
        width: boxes[current - 1].width,
      };
    };

    const drawCartoonWoodBlock = (x, yScreenTop, width, blockHeight) => {
      const gradient = context.createLinearGradient(
        x,
        yScreenTop,
        x + width,
        yScreenTop + blockHeight
      );
      gradient.addColorStop(0, "#d4a373");
      gradient.addColorStop(0.5, "#b08968");
      gradient.addColorStop(1, "#855c42");
      context.fillStyle = gradient;
      context.fillRect(x, yScreenTop, width, blockHeight);

      context.strokeStyle = "#5a4a3a";
      context.lineWidth = 4;
      context.strokeRect(x, yScreenTop, width, blockHeight);

      context.strokeStyle = "rgba(90, 74, 58, 0.6)";
      context.lineWidth = 2;
      const grainCount = Math.floor(width / 20);
      for (let i = 0; i < grainCount; i++) {
        const grainX = x + 10 + (i * width) / grainCount;
        context.beginPath();
        context.moveTo(grainX, yScreenTop + 5);
        context.lineTo(grainX, yScreenTop + blockHeight - 5);
        context.stroke();
      }

      const highlight = context.createLinearGradient(
        x,
        yScreenTop,
        x,
        yScreenTop + blockHeight
      );
      highlight.addColorStop(0, "rgba(255, 255, 255, 0.3)");
      highlight.addColorStop(0.3, "rgba(255, 255, 255, 0.1)");
      highlight.addColorStop(1, "rgba(255, 255, 255, 0)");
      context.fillStyle = highlight;
      context.fillRect(x + 2, yScreenTop + 2, width * 0.2, blockHeight - 4);

      const shadow = context.createLinearGradient(
        x + width,
        yScreenTop,
        x + width,
        yScreenTop + blockHeight
      );
      shadow.addColorStop(0, "rgba(0, 0, 0, 0.2)");
      shadow.addColorStop(0.7, "rgba(0, 0, 0, 0.1)");
      shadow.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = shadow;
      context.fillRect(
        x + width - width * 0.2,
        yScreenTop + 2,
        width * 0.2,
        blockHeight - 4
      );
    };

    // animation loop
    const animate = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      // green background
      const bgGradient = context.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, "#d8f3dc");
      bgGradient.addColorStop(0.5, "#b7e4c7");
      bgGradient.addColorStop(1, "#95d5b2");
      context.fillStyle = bgGradient;
      context.fillRect(0, 0, canvas.width, canvas.height);

      // ground
      context.fillStyle = "#b08968";
      context.fillRect(
        0,
        canvas.height - groundHeight + Math.max(0, cameraY),
        canvas.width,
        groundHeight
      );

      // score display
      context.textAlign = "center";
      context.fillStyle = "#5a4a3a";
      context.font = isMobile ? "bold 55px " : "bold 30px ";
      context.fillText(
        (current - 1).toString(),
        canvas.width / 2,
        isMobile ? 80 : canvas.height / 6
      );
      context.textAlign = "left";

      // draw boxes
      for (let n = 0; n < boxes.length; n++) {
        const box = boxes[n];
        const yScreenTop =
          canvas.height - groundHeight - (box.y + height) + cameraY;
        drawCartoonWoodBlock(box.x, yScreenTop, box.width, height);
      }

      // draw debris
      if (debris.width != 0) {
        const debrisYScreenTop =
          canvas.height - groundHeight - (debris.y + height) + cameraY;
        drawCartoonWoodBlock(debris.x, debrisYScreenTop, debris.width, height);
      }

      if (mode === "gameOver") {
        if (Date.now() - gameOverTime > 300) {
          setGameOver(true);
          setScore(current - 1);
          setGameState("results");
        }
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      // game logic
      if (mode == "bounce") {
        boxes[current].x = boxes[current].x + xSpeed;
        const rightBoundary = getRightBoundary();
        const leftBoundary = getLeftBoundary();

        if (
          xSpeed > 0 &&
          boxes[current].x + boxes[current].width > rightBoundary
        ) {
          xSpeed = -xSpeed;
          boxes[current].x = rightBoundary - boxes[current].width;
        }
        if (xSpeed < 0 && boxes[current].x < leftBoundary) {
          xSpeed = -xSpeed;
          boxes[current].x = leftBoundary;
        }
      }

      if (mode == "fall") {
        boxes[current].y = boxes[current].y - ySpeed;
        if (boxes[current].y <= boxes[current - 1].y + height) {
          boxes[current].y = boxes[current - 1].y + height;
          mode = "bounce";
          const difference = boxes[current].x - boxes[current - 1].x;

          // play the block sound effect when the block lands
          audioRef.current.currentTime = 0; // rewind to start in case it's already playing
          audioRef.current.play();

          if (Math.abs(difference) >= boxes[current].width) {
            gameOverTime = Date.now();
            mode = "gameOver";
          } else {
            debris = {
              y: boxes[current].y,
              width: difference,
              x:
                boxes[current].x > boxes[current - 1].x
                  ? boxes[current].x + (boxes[current].width - difference)
                  : boxes[current].x - difference,
            };

            if (boxes[current].x > boxes[current - 1].x) {
              boxes[current].width = boxes[current].width - difference;
            } else {
              boxes[current].width = boxes[current].width + difference;
              boxes[current].x = boxes[current - 1].x;
            }

            xSpeed = xSpeed > 0 ? xSpeed + 0.1 : xSpeed - 0.1;
            xSpeed = Math.max(Math.min(xSpeed, 5), -5);
            current++;
            if (current > cameraThreshold) {
              scrollCounter = height;
            }
            newBox();
          }
        }
      }

      debris.y = debris.y - ySpeed;
      if (scrollCounter) {
        cameraY++;
        scrollCounter--;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const restart = () => {
      setGameOver(false);
      boxes.length = 1;
      mode = "bounce";
      cameraY = 0;
      scrollCounter = 0;
      xSpeed = isMobile ? 1.5 : 1.8; // speed of horizontal movement of the block
      current = 1;
      debris = { x: 0, width: 0, y: 0 };
      gameOverTime = 0;

      const initialWidth = isMobile ? 250 : 300;
      const initialX = isMobile
        ? canvas.width / 2 - initialWidth / 2
        : Math.max(
            canvas.width / 2 - initialWidth / 2,
            (canvas.width - MAX_GAME_WIDTH) / 2
          );

      boxes[0] = {
        x: initialX,
        width: initialWidth,
        y: 0,
      };

      newBox();
    };
    gameStateRef.current = {
      restart,
      mode,
    };

    const handlePointerDown = () => {
      if (mode == "gameOver") {
        restart();
      } else {
        if (mode == "bounce") mode = "fall";
      }
    };

    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (mode == "gameOver") {
          restart(); /* take note of this */
        } else {
          if (mode == "bounce") mode = "fall";
        }
      }
    };

    initGame();

    window.addEventListener("resize", resizeCanvas);
    canvasRef.current.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("keydown", handleKeyDown);
      if (canvasRef.current) {
        canvasRef.current.removeEventListener("pointerdown", handlePointerDown);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [isMobile]);

  return (
    <>
      <div>
        <style>{`
          body {
            margin: 0;
            overflow: hidden;
          }
          #gameCanvas {
            display: block;
            width: 100vw;
            height: 100vh;
          }
          .game-container {
            position: relative;
          }
        `}</style>
      </div>
      <div className="game-container">
        <canvas
          ref={canvasRef}
          id="gameCanvas"
          style={{
            touchAction: "none",
          }}
        />
      </div>
    </>
  );
};

export default StackGame;
