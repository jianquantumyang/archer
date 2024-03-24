import React, { useEffect, useRef } from "react";
import "./resources/css/Game.css";

function Game() {
  const canvasRef = useRef(null);
  const bowRef = useRef(null);
  const dogs = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Load images
    const bowImage = new Image();
    bowImage.src = "resources/img/bow.png";
    const dogImages = [
      "resources/img/dog1.png",
      "resources/img/dog2.png",
      "resources/img/dog3.png"
    ].map(src => {
      const img = new Image();
      img.src = src;
      return img;
    });

    // Set up bow
    const bow = {
      x: canvas.width / 2 - 25,
      y: canvas.height - 100,
      width: 50,
      height: 100,
      image: bowImage
    };
    bowRef.current = bow;

    // Draw bow
    function drawBow() {
      ctx.drawImage(bow.image, bow.x, bow.y, bow.width, bow.height);
    }

    // Draw dogs
    function spawnDog() {
      const dogImage = dogImages[Math.floor(Math.random() * dogImages.length)];
      const dog = {
        x: Math.random() * (canvas.width - 50),
        y: -50,
        width: 50,
        height: 50,
        image: dogImage
      };
      dogs.current.push(dog);
    }

    function drawDogs() {
      dogs.current.forEach(dog => {
        ctx.drawImage(dog.image, dog.x, dog.y, dog.width, dog.height);
      });
    }

    // Game loop
    let lastSpawn = 0;
    function gameLoop(timestamp) {
      const deltaTime = timestamp - lastSpawn;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawBow();
      drawDogs();

      if (deltaTime > 1000) {
        spawnDog();
        lastSpawn = timestamp;
      }

      // Update dog positions
      dogs.current.forEach(dog => {
        dog.y += 2; // Adjust speed as needed
      });

      requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);

  }, []);

  return (
    <div>
      <canvas ref={canvasRef} className="canvas"/>
    </div>
  );
}

export default Game;
