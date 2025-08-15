import { GAME_CONSTANTS } from "./constants";

export const drawCartoonWoodBlock = (
  context,
  x,
  yScreenTop,
  width,
  blockHeight
) => {
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

export const interpolateColor = (color1, color2, factor) => {
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);

  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);

  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);

  return `rgb(${r}, ${g}, ${b})`;
};

export const drawSky = (context, canvas, stackHeight) => {
  const bgGradient = context.createLinearGradient(0, 0, 0, canvas.height);

  let topColor, midColor, bottomColor;

  if (stackHeight < GAME_CONSTANTS.SUNSET_THRESHOLD) {
    topColor = GAME_CONSTANTS.DAY_COLORS.top;
    midColor = GAME_CONSTANTS.DAY_COLORS.mid;
    bottomColor = GAME_CONSTANTS.DAY_COLORS.bottom;
  } else if (stackHeight < GAME_CONSTANTS.NIGHT_THRESHOLD) {
    const progress =
      (stackHeight - GAME_CONSTANTS.SUNSET_THRESHOLD) /
      (GAME_CONSTANTS.NIGHT_THRESHOLD - GAME_CONSTANTS.SUNSET_THRESHOLD);
    const easedProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
    topColor = interpolateColor(
      GAME_CONSTANTS.DAY_COLORS.top,
      GAME_CONSTANTS.SUNSET_COLORS.top,
      easedProgress
    );
    midColor = interpolateColor(
      GAME_CONSTANTS.DAY_COLORS.mid,
      GAME_CONSTANTS.SUNSET_COLORS.mid,
      easedProgress
    );
    bottomColor = interpolateColor(
      GAME_CONSTANTS.DAY_COLORS.bottom,
      GAME_CONSTANTS.SUNSET_COLORS.bottom,
      easedProgress
    );
  } else if (stackHeight < GAME_CONSTANTS.DEEP_NIGHT_THRESHOLD) {
    const nightProgress =
      (stackHeight - GAME_CONSTANTS.NIGHT_THRESHOLD) /
      (GAME_CONSTANTS.DEEP_NIGHT_THRESHOLD - GAME_CONSTANTS.NIGHT_THRESHOLD);

    if (nightProgress < 0.5) {
      const twilightFactor = nightProgress * 2;
      topColor = interpolateColor(
        GAME_CONSTANTS.SUNSET_COLORS.top,
        GAME_CONSTANTS.TWILIGHT_COLORS.top,
        twilightFactor
      );
      midColor = interpolateColor(
        GAME_CONSTANTS.SUNSET_COLORS.mid,
        GAME_CONSTANTS.TWILIGHT_COLORS.mid,
        twilightFactor
      );
      bottomColor = interpolateColor(
        GAME_CONSTANTS.SUNSET_COLORS.bottom,
        GAME_CONSTANTS.TWILIGHT_COLORS.bottom,
        twilightFactor
      );
    } else {
      const nightFactor = (nightProgress - 0.5) * 2;
      topColor = interpolateColor(
        GAME_CONSTANTS.TWILIGHT_COLORS.top,
        GAME_CONSTANTS.NIGHT_COLORS.top,
        nightFactor
      );
      midColor = interpolateColor(
        GAME_CONSTANTS.TWILIGHT_COLORS.mid,
        GAME_CONSTANTS.NIGHT_COLORS.mid,
        nightFactor
      );
      bottomColor = interpolateColor(
        GAME_CONSTANTS.TWILIGHT_COLORS.bottom,
        GAME_CONSTANTS.NIGHT_COLORS.bottom,
        nightFactor
      );
    }
  } else {
    const deepProgress = Math.min(
      1,
      (stackHeight - GAME_CONSTANTS.DEEP_NIGHT_THRESHOLD) / 20
    );
    const easedDeepProgress = 0.5 - Math.cos(deepProgress * Math.PI) / 2;

    topColor = interpolateColor(
      GAME_CONSTANTS.NIGHT_COLORS.top,
      GAME_CONSTANTS.DEEP_NIGHT_COLORS.top,
      easedDeepProgress
    );
    midColor = interpolateColor(
      GAME_CONSTANTS.NIGHT_COLORS.mid,
      GAME_CONSTANTS.DEEP_NIGHT_COLORS.mid,
      easedDeepProgress
    );
    bottomColor = interpolateColor(
      GAME_CONSTANTS.NIGHT_COLORS.bottom,
      GAME_CONSTANTS.DEEP_NIGHT_COLORS.bottom,
      easedDeepProgress
    );
  }

  bgGradient.addColorStop(0, topColor);
  bgGradient.addColorStop(0.4, midColor);
  bgGradient.addColorStop(1, bottomColor);

  context.fillStyle = bgGradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
};

export const drawStars = (context, canvas, stackHeight) => {
  if (stackHeight >= GAME_CONSTANTS.NIGHT_THRESHOLD) {
    const nightProgress = Math.min(
      1,
      (stackHeight - GAME_CONSTANTS.NIGHT_THRESHOLD) / 10
    );
    const starOpacity = 0.5 - Math.cos(nightProgress * Math.PI) / 2;

    let baseStarCount = Math.floor((canvas.width * canvas.height) / 15000);
    let smallStarCount = 0;
    let smallStarOpacity = 0;
    if (stackHeight >= GAME_CONSTANTS.DEEP_NIGHT_THRESHOLD) {
      const deepProgress = Math.min(
        1,
        (stackHeight - GAME_CONSTANTS.DEEP_NIGHT_THRESHOLD) / 15
      );
      smallStarCount = Math.floor((canvas.width * canvas.height) / 8000);
      smallStarOpacity = (0.3 - Math.cos(deepProgress * Math.PI) / 2) * 0.6;
    }

    const seed = (canvas.width + canvas.height) % 1000;
    let random = seed;

    context.fillStyle = `rgba(255, 255, 255, ${starOpacity})`;
    for (let i = 0; i < baseStarCount; i++) {
      random = (random * 1103515245 + 12345) % 2 ** 31;
      const x = (random / 2 ** 31) * canvas.width;
      random = (random * 1103515245 + 12345) % 2 ** 31;
      const y = (random / 2 ** 31) * (canvas.height * 0.6);
      random = (random * 1103515245 + 12345) % 2 ** 31;
      const size = 0.5 + (random / 2 ** 31) * 1.5;

      context.beginPath();
      context.arc(x, y, size, 0, Math.PI * 2);
      context.fill();

      if (i % 5 === 0) {
        const twinkle = Math.sin(Date.now() * 0.005 + i) * 0.3 + 0.7;
        context.fillStyle = `rgba(255, 255, 255, ${starOpacity * twinkle})`;
        context.beginPath();
        context.arc(x, y, size * 1.5, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = `rgba(255, 255, 255, ${starOpacity})`;
      }
    }

    if (smallStarCount > 0 && smallStarOpacity > 0) {
      context.fillStyle = `rgba(255, 255, 255, ${smallStarOpacity})`;
      random = (seed + 12345) % 1000;

      for (let i = 0; i < smallStarCount; i++) {
        random = (random * 1103515245 + 12345) % 2 ** 31;
        const x = (random / 2 ** 31) * canvas.width;
        random = (random * 1103515245 + 12345) % 2 ** 31;
        const y = (random / 2 ** 31) * (canvas.height * 0.7);
        const size = 0.2 + (random / 2 ** 31) * 0.5;

        context.beginPath();
        context.arc(x, y, size, 0, Math.PI * 2);
        context.fill();

        if (i % 8 === 0) {
          const twinkle = Math.sin(Date.now() * 0.003 + i) * 0.2 + 0.8;
          context.fillStyle = `rgba(255, 255, 255, ${
            smallStarOpacity * twinkle
          })`;
          context.beginPath();
          context.arc(x, y, size * 1.2, 0, Math.PI * 2);
          context.fill();
          context.fillStyle = `rgba(255, 255, 255, ${smallStarOpacity})`;
        }
      }
    }
  }
};

export const drawCartoonGround = (context, canvas, cameraY) => {
  const x = 0;
  const y = canvas.height - GAME_CONSTANTS.GROUND_HEIGHT + Math.max(0, cameraY);
  const width = canvas.width;
  const height = GAME_CONSTANTS.GROUND_HEIGHT;

  const groundGradient = context.createLinearGradient(x, y, x, y + height);
  groundGradient.addColorStop(0, "#d7b568");
  groundGradient.addColorStop(0.5, "#cbaa63");
  groundGradient.addColorStop(1, "#826f40");
  context.fillStyle = groundGradient;
  context.fillRect(x, y, width, height);

  context.strokeStyle = "#5a4a3a";
  context.lineWidth = 2;
  context.strokeRect(x, y, width, height);

  const shadowGradient = context.createLinearGradient(
    x,
    y,
    x,
    y + height * 0.2
  );
  shadowGradient.addColorStop(0, "rgba(0, 0, 0, 0.3)");
  shadowGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = shadowGradient;
  context.fillRect(x, y, width, height * 0.2);
};


