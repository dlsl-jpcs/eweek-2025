import { useEffect, useRef, useState } from "react";
import block from "/block2.mp3";
import { GAME_CONSTANTS } from "./constants";
import {
  initGameState,
  getLeftBoundary,
  getRightBoundary,
  newBox,
  handleBlockLanding,
  restartGame,
} from "./gameUtils";
import {
  drawCartoonWoodBlock,
  drawSky,
  drawStars,
  drawCartoonGround,
  interpolateColor,
} from "./renderUtils";
import { gameStyles } from "./styles";

const StackGame = ({ name, score, setScore, setGameState }) => {
  const canvasRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showPerfect, setShowPerfect] = useState(false);
  const [perfectTimeout, setPerfectTimeout] = useState(null);
  const [bonusPoints, setBonusPoints] = useState(0);
  const gameStateRef = useRef(null);
  const audioRef = useRef(null);
  const bonusPointsRef = useRef(0);

  useEffect(() => {
    audioRef.current = new Audio(block);
    audioRef.current.volume = 1;

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    let animationFrameId;

    const initGame = () => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      resizeCanvas();

      context.font = 'bold 30px "Cosmic sans", cursive, sans-serif';

      gameStateRef.current = initGameState(isMobile);
      gameStateRef.current.canvas = canvas;
      gameStateRef.current.context = context;

      const initialX = isMobile
        ? canvas.width / 2 - gameStateRef.current.initialWidth / 2
        : Math.max(
            canvas.width / 2 - gameStateRef.current.initialWidth / 2,
            (canvas.width - GAME_CONSTANTS.MAX_GAME_WIDTH) / 2
          );

      gameStateRef.current.boxes[0] = {
        x: initialX,
        y: 0,
        width: gameStateRef.current.initialWidth,
      };

      restartGame(gameStateRef.current);
      animate();
    };

    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      if (gameStateRef.current?.boxes.length > 0) {
        const initialX = isMobile
          ? canvas.width / 2 - gameStateRef.current.initialWidth / 2
          : Math.max(
              canvas.width / 2 - gameStateRef.current.initialWidth / 2,
              (canvas.width - GAME_CONSTANTS.MAX_GAME_WIDTH) / 2
            );
        gameStateRef.current.boxes[0].x = initialX;
        gameStateRef.current.boxes[0].width = gameStateRef.current.initialWidth;
      }
    };

    const animate = () => {
      const gameState = gameStateRef.current;
      const { context, canvas } = gameState;

      context.clearRect(0, 0, canvas.width, canvas.height);
      const stackHeight = gameState.current - 1;

      drawSky(context, canvas, stackHeight);
      drawStars(context, canvas, stackHeight);
      drawCartoonGround(context, canvas, gameState.cameraY);

      context.textAlign = "center";
      let textColor;
      if (stackHeight < GAME_CONSTANTS.SUNSET_THRESHOLD) {
        textColor = "#5a4a3a";
      } else if (stackHeight < GAME_CONSTANTS.NIGHT_THRESHOLD) {
        const progress =
          (stackHeight - GAME_CONSTANTS.SUNSET_THRESHOLD) /
          (GAME_CONSTANTS.NIGHT_THRESHOLD - GAME_CONSTANTS.SUNSET_THRESHOLD);
        const easedProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
        textColor = interpolateColor("#5a4a3a", "#ffffff", easedProgress);
      } else {
        textColor = "#ffffff";
      }
      context.fillStyle = textColor;

      context.font = isMobile ? "bold 55px " : "bold 30px ";
      context.fillText(
        (stackHeight + bonusPointsRef.current).toString(),
        canvas.width / 2,
        isMobile ? 80 : canvas.height / 6
      );
      context.textAlign = "left";

      for (let n = 0; n < gameState.boxes.length; n++) {
        const box = gameState.boxes[n];
        const yScreenTop =
          canvas.height -
          GAME_CONSTANTS.GROUND_HEIGHT -
          (box.y + GAME_CONSTANTS.BLOCK_HEIGHT) +
          gameState.cameraY;
        drawCartoonWoodBlock(
          context,
          box.x,
          yScreenTop,
          box.width,
          GAME_CONSTANTS.BLOCK_HEIGHT
        );
      }

      if (gameState.debris.width != 0) {
        const debrisYScreenTop =
          canvas.height -
          GAME_CONSTANTS.GROUND_HEIGHT -
          (gameState.debris.y + GAME_CONSTANTS.BLOCK_HEIGHT) +
          gameState.cameraY;
        drawCartoonWoodBlock(
          context,
          gameState.debris.x,
          debrisYScreenTop,
          gameState.debris.width,
          GAME_CONSTANTS.BLOCK_HEIGHT
        );
      }

      if (gameState.mode === "gameOver") {
        if (Date.now() - gameState.gameOverTime > 300) {
          setScore(gameState.current - 1 + bonusPointsRef.current);
          setGameState("results");
        }
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      if (gameState.mode === "bounce") {
        gameState.boxes[gameState.current].x =
          gameState.boxes[gameState.current].x + gameState.xSpeed;
        const rightBoundary = getRightBoundary(gameState);
        const leftBoundary = getLeftBoundary(gameState);

        if (
          gameState.xSpeed > 0 &&
          gameState.boxes[gameState.current].x +
            gameState.boxes[gameState.current].width >
            rightBoundary
        ) {
          gameState.xSpeed = -gameState.xSpeed;
          gameState.boxes[gameState.current].x =
            rightBoundary - gameState.boxes[gameState.current].width;
        }
        if (
          gameState.xSpeed < 0 &&
          gameState.boxes[gameState.current].x < leftBoundary
        ) {
          gameState.xSpeed = -gameState.xSpeed;
          gameState.boxes[gameState.current].x = leftBoundary;
        }
      }

      if (gameState.mode === "fall") {
        gameState.boxes[gameState.current].y =
          gameState.boxes[gameState.current].y - GAME_CONSTANTS.Y_SPEED;
        if (
          gameState.boxes[gameState.current].y <=
          gameState.boxes[gameState.current - 1].y + GAME_CONSTANTS.BLOCK_HEIGHT
        ) {
          gameState.boxes[gameState.current].y =
            gameState.boxes[gameState.current - 1].y +
            GAME_CONSTANTS.BLOCK_HEIGHT;
          gameState.mode = "bounce";

          audioRef.current.currentTime = 0;
          audioRef.current.play();

          handleBlockLanding(
            gameState,
            setBonusPoints,
            setShowPerfect,
            setPerfectTimeout,
            bonusPointsRef
          );
        }
      }

      gameState.debris.y = gameState.debris.y - GAME_CONSTANTS.Y_SPEED;
      if (gameState.scrollCounter) {
        gameState.cameraY++;
        gameState.scrollCounter--;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const handlePointerDown = () => {
      if (gameStateRef.current.mode === "gameOver") {
        // restart();
      } else {
        if (gameStateRef.current.mode === "bounce")
          gameStateRef.current.mode = "fall";
      }
    };

    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (gameStateRef.current.mode === "gameOver") {
          // restart();
        } else {
          if (gameStateRef.current.mode === "bounce")
            gameStateRef.current.mode = "fall";
        }
      }
    };

    initGame();

    window.addEventListener("resize", resizeCanvas);
    canvasRef.current.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

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
      if (perfectTimeout) {
        clearTimeout(perfectTimeout);
      }
    };
  }, [isMobile]);

  return (
    <>
      <div>
        <style>{gameStyles}</style>
      </div>
      <div className="game-container">
        <canvas
          ref={canvasRef}
          id="gameCanvas"
          style={{
            touchAction: "none",
          }}
        />
        {showPerfect && (
          <div className="perfect-prompt">
            Perfect! <span className="text-yellow-300">+2</span>
          </div>
        )}
      </div>
    </>
  );
};

export default StackGame;
