import { GAME_CONSTANTS } from "./constants";

export const initGameState = (isMobile) => {
  return {
    mode: "bounce",
    canvas: null,
    context: null,
    scrollCounter: 0,
    cameraY: 0,
    current: 1,
    xSpeed: isMobile
      ? GAME_CONSTANTS.BASE_SPEED_MOBILE
      : GAME_CONSTANTS.BASE_SPEED_DESKTOP,
    gameOverTime: 0,
    boxes: [],
    debris: { x: 0, width: 0, y: 0 },
    isMobile,
    initialWidth: isMobile
      ? GAME_CONSTANTS.INITIAL_BLOCK_WIDTH_MOBILE
      : GAME_CONSTANTS.INITIAL_BLOCK_WIDTH_DESKTOP,
  };
};

export const getLeftBoundary = (gameState) => {
  return gameState.isMobile
    ? 0
    : (gameState.canvas.width - GAME_CONSTANTS.MAX_GAME_WIDTH) / 2;
};

export const getRightBoundary = (gameState) => {
  return gameState.isMobile
    ? gameState.canvas.width
    : (gameState.canvas.width + GAME_CONSTANTS.MAX_GAME_WIDTH) / 2;
};

export const newBox = (gameState) => {
  const { boxes, current, initialWidth } = gameState;
  const lastBoxTopY = boxes[current - 1].y + GAME_CONSTANTS.BLOCK_HEIGHT;

  boxes[current] = {
    x: gameState.isMobile ? 0 : getLeftBoundary(gameState),
    y:
      lastBoxTopY +
      GAME_CONSTANTS.VERTICAL_GAP_BETWEEN_BLOCKS * GAME_CONSTANTS.BLOCK_HEIGHT,
    width: boxes[current - 1].width,
  };

  const speedMultiplier = 1 + (current - 1) * 0.08;
  gameState.xSpeed =
    (gameState.isMobile
      ? GAME_CONSTANTS.BASE_SPEED_MOBILE
      : GAME_CONSTANTS.BASE_SPEED_DESKTOP) * speedMultiplier;
};

export const handleBlockLanding = (
  gameState,
  setBonusPoints,
  setShowPerfect,
  setPerfectTimeout,
  bonusPointsRef // Add this parameter
) => {
  const { boxes, current } = gameState;
  const currentBox = boxes[current];
  const previousBox = boxes[current - 1];

  let difference = currentBox.x - previousBox.x;
  const absDifference = Math.abs(difference);

  if (absDifference >= currentBox.width) {
    gameState.gameOverTime = Date.now();
    gameState.mode = "gameOver";
    return;
  }

  if (absDifference <= GAME_CONSTANTS.MAGNETIC_ZONE) {
    const pullStrength =
      Math.max(0, 1 - absDifference / GAME_CONSTANTS.MAGNETIC_ZONE) *
      GAME_CONSTANTS.MAGNETIC_STRENGTH;
    const magneticPull = difference * pullStrength;
    currentBox.x -= magneticPull;
    difference = currentBox.x - previousBox.x;
  }

  if (Math.abs(difference) <= GAME_CONSTANTS.PERFECT_ZONE) {
    currentBox.x = previousBox.x;
    currentBox.width = previousBox.width;
    gameState.debris = { x: 0, width: 0, y: 0 };

    bonusPointsRef.current += 1; // Update the ref
    setBonusPoints(bonusPointsRef.current); // Update state
    gameState.bonusPoints = bonusPointsRef.current; // Sync with gameState

    setShowPerfect(true);
    setPerfectTimeout(
      setTimeout(() => {
        setShowPerfect(false);
      }, 1000)
    );
  } else {
    const sliceReduction =
      Math.max(0, 1 - Math.abs(difference) / GAME_CONSTANTS.MAGNETIC_ZONE) *
      0.15;
    const adjustedDifference = difference * (1 - sliceReduction);

    gameState.debris = {
      y: currentBox.y,
      width: adjustedDifference,
      x:
        currentBox.x > previousBox.x
          ? currentBox.x + (currentBox.width - adjustedDifference)
          : currentBox.x - adjustedDifference,
    };

    if (currentBox.x > previousBox.x) {
      currentBox.width = currentBox.width - adjustedDifference;
    } else {
      currentBox.width = currentBox.width + adjustedDifference;
      currentBox.x = previousBox.x;
    }
  }

  gameState.current++;
  if (gameState.current > GAME_CONSTANTS.CAMERA_THRESHOLD) {
    gameState.scrollCounter = GAME_CONSTANTS.BLOCK_HEIGHT;
  }
  newBox(gameState);
};

export const restartGame = (gameState) => {
  gameState.boxes.length = 1;
  gameState.mode = "bounce";
  gameState.cameraY = 0;
  gameState.scrollCounter = 0;
  gameState.xSpeed = gameState.isMobile
    ? GAME_CONSTANTS.BASE_SPEED_MOBILE
    : GAME_CONSTANTS.BASE_SPEED_DESKTOP;
  gameState.current = 1;
  gameState.debris = { x: 0, width: 0, y: 0 };
  gameState.gameOverTime = 0;
  gameState.bonusPoints = 0;

  const initialX = gameState.isMobile
    ? gameState.canvas.width / 2 - gameState.initialWidth / 2
    : Math.max(
        gameState.canvas.width / 2 - gameState.initialWidth / 2,
        (gameState.canvas.width - GAME_CONSTANTS.MAX_GAME_WIDTH) / 2
      );

  gameState.boxes[0] = {
    x: initialX,
    width: gameState.initialWidth,
    y: 0,
  };

  newBox(gameState);
};
