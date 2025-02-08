document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("startButton");
  const gesture = document.getElementById("gesture");
  const video = document.getElementById("video");
  const gameResult = document.getElementById("gameResult");

  const modelUrl =
    "https://teachablemachine.withgoogle.com/models/wVJH-7nE2/model.json";
  let userChoice = "";
  let classifier = ml5.imageClassifier(modelUrl, modelLoaded);

  function modelLoaded() {
    console.log("Model Loaded");
    startVideo();
  }

  async function startVideo() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;

      video.onloadedmetadata = () => {
        video.play();
        setTimeout(() => classifyGesture(), 1000); // Delay classification start
      };
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  }

  function classifyGesture() {
    classifier.classify(video, (error, results) => {
      if (error) {
        console.error("Error in classification:", error);
        gesture.innerText = "Error in recognizing gesture.";
        return;
      }

      if (!results || results.length === 0) {
        console.warn("No prediction results available.");
        return;
      }

      userChoice = results[0].label; // Ensure 'results' exists
      gesture.innerText = `Your gesture: ${userChoice}`;

      setTimeout(classifyGesture, 1000); // Add delay to reduce fluctuation
    });
  }

  startBtn.addEventListener("click", () => {
    playGame(userChoice);
  });

  function playGame(userChoice) {
    let choices = ["Rock", "Paper", "Scissors"];
    let randomNumber = Math.floor(Math.random() * choices.length);
    let computerChoice = choices[randomNumber];
    let result = "";
    if (userChoice === computerChoice) {
      result = "It's a tie!";
    } else if (
      (userChoice === "Rock" && computerChoice === "Scissors") ||
      (userChoice === "Scissors" && computerChoice === "Paper") ||
      (userChoice === "Paper" && computerChoice === "Rock")
    ) {
      result = "You win!";
    } else {
      result = "You lose!";
    }
    gameResult.innerText = `Computer chose: ${computerChoice}. ${result}`;
  }
});
