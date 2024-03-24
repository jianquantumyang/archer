import React, { useEffect, useRef } from "react";
import "./resources/css/Game.css";
import bowImage from "./resources/img/bow.png"; 
import dog1Image from "./resources/img/dog1.png";
import dog2Image from "./resources/img/dog2.png";
import dog3Image from "./resources/img/dog3.png";

function Game() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    function getRandomDogImage() {
      const dogImages = [dog1Image, dog2Image, dog3Image]; // Array of dog images
      const randomIndex = Math.floor(Math.random() * dogImages.length);
      return dogImages[randomIndex];
    }
    // Set canvas size based on window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Load bow image
    const bow = new Image();
    bow.src = bowImage;

    // Bow dimensions and position
    let bowPosition = {
      x: canvas.width / 2 - 25,
      y: canvas.height - 150,
      width: 100,
      height: 100,
      angle: 0 // Initial angle
    };

    // Arrow speed
    const arrowSpeed = 15;

    // Arrows array
    let arrows = [];

    // Dogs array
    let dogs = [];

    // Score
    let score = 0;

    // Shooting logic
    let canShoot = true;

    function shootArrow(mouseX, mouseY) {
      if (canShoot) {
        const arrow = {
          x: bowPosition.x + bowPosition.width / 2,
          y: bowPosition.y,
          speed: arrowSpeed,
          angle: Math.atan2(mouseY - bowPosition.y, mouseX - bowPosition.x)
        };
        arrows.push(arrow);
        canShoot = false;
        setTimeout(() => {
          canShoot = true;
        }, 250); // Delay before shooting next arrow (1 second)
      }
    }

    // Draw arrows
    function drawArrows() {
      ctx.fillStyle = "black";
      arrows.forEach((arrow) => {
        ctx.beginPath();
        ctx.arc(arrow.x, arrow.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // Draw dogs
    function drawDogs() {
  dogs.forEach((dog) => {
    const dogimg = new Image();
    dogimg.src= dog.img;
    ctx.drawImage(dogimg, dog.x, dog.y, dog.width, dog.height);
  });
}

    // Game loop
    let lastSpawn = 0;
    function gameLoop(timestamp) {
      const deltaTime = timestamp - lastSpawn;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Rotate bow to point towards the mouse
      const mouseX = canvas.width / 2;
      const mouseY = canvas.height;
      bowPosition.angle = Math.atan2(mouseY - bowPosition.y, mouseX - bowPosition.x);

      // Draw bow image
      ctx.save(); // Save the current context state
      ctx.translate(bowPosition.x + bowPosition.width / 2, bowPosition.y + bowPosition.height / 2); // Translate to the center of the bow
      ctx.rotate(bowPosition.angle); // Rotate the context
      ctx.drawImage(bow, -bowPosition.width / 2, -bowPosition.height / 2, bowPosition.width, bowPosition.height); // Draw the rotated bow
      ctx.restore(); // Restore the context state

      drawArrows();
      drawDogs();

      // Update arrows position
      arrows.forEach((arrow, arrowIndex) => {
        arrow.x += Math.cos(arrow.angle) * arrow.speed;
        arrow.y += Math.sin(arrow.angle) * arrow.speed;

        // Remove arrows that go off the screen
        if (
          arrow.x < 0 ||
          arrow.x > canvas.width ||
          arrow.y < 0 ||
          arrow.y > canvas.height
        ) {
          arrows.splice(arrowIndex, 1);
        }

        // Check for arrow-dog collisions
        dogs.forEach((dog, dogIndex) => {
          if (
            arrow.x > dog.x &&
            arrow.x < dog.x + dog.width &&
            arrow.y > dog.y &&
            arrow.y < dog.y + dog.height
          ) {
            // Remove the arrow and the dog upon collision
            arrows.splice(arrowIndex, 1);
            dogs.splice(dogIndex, 1);
            // Increase score upon hitting a dog
            score++;
          }
        });
      });

      // Spawn dogs periodically
      if (deltaTime > 500) {
        spawnDog();
        lastSpawn = timestamp;
      }

      // Update dogs position
      dogs.forEach((dog, dogIndex) => {
        dog.y += 2;

        // Remove dogs that go beyond the canvas
        if (dog.y > canvas.height) {
          dogs.splice(dogIndex, 1);
        }
      });

      // Draw score
      ctx.fillStyle = "black";
      ctx.font = "24px Arial";
      ctx.fillText("Сколько собак съел Артур: " + score, 10, 30);

      requestAnimationFrame(gameLoop);
    }

    // Dog spawning logic
    function spawnDog() {
      const dog = {
        x: Math.random() * (canvas.width - 50),
        y: -50,
        width: 50,
        height: 50,
        img: getRandomDogImage()

      };
      dogs.push(dog);
    }

    // Start the game loop
    requestAnimationFrame(gameLoop);

    // Mouse click event listener
    canvas.addEventListener("click", (e) => {
      const mouseX = e.clientX ;
      const mouseY = e.clientY;
      shootArrow(mouseX, mouseY);
    });

    // Clean up event listener
    return () => {
      canvas.removeEventListener("click", shootArrow);
    };
  }, []);

  return <canvas ref={canvasRef} className="canvas" />;
}

export default Game;
