export const gameStyles = `
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
  .perfect-prompt {
    position: absolute;
    top: 50%;
    left: 50%;
    text-align: center;
    transform: translate(-50%, -50%);
    font-size: 48px;
    font-weight: bold;
    color: #fff;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    opacity: 0;
    animation: fadeInOut 1s ease-in-out;
  }
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
  }
`;
