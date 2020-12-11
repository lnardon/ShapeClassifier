// Global variables
let shapeClassifier;
let canvas;
let inputImage;
let clearButton;
let guess;
let confidence;

// P5.js functions
function setup() {
  // Canvas setup
  canvas = createCanvas(400, 400);
  canvas.parent("p5Canvas");
  background(255);

  // Clear btn
  clearButton = document.getElementById("deleteBtn");
  clearButton.addEventListener("click", () => {
    background(255);
  });

  // ML Setup
  const options = {
    inputs: [64, 64, 4],
    task: "imageClassification",
  };
  const modelDetails = {
    model: "model/model.json",
    metadata: "model/model_meta.json",
    weights: "model/modelweights.bin",
  };

  shapeClassifier = ml5.neuralNetwork(options);
  inputImage = createGraphics(64, 64);
  shapeClassifier.load(modelDetails, modelLoaded);
}

function draw() {
  if (mouseIsPressed) {
    strokeWeight(6);
    line(mouseX, mouseY, pmouseX, pmouseY);
  }
}

// Helper functions
function modelLoaded() {
  console.log("Ready!");
  classifyImage();
}

function classifyImage() {
  inputImage.copy(canvas, 0, 0, 400, 400, 0, 0, 64, 64);
  shapeClassifier.classify(
    {
      image: inputImage,
    },
    gotResults
  );
}

function gotResults(err, results) {
  if (err) {
    console.error(err);
    return;
  }

  guess = results[0].label;
  confidence = nf(100 * results[0].confidence, 2, 0);

  classifyImage();
}
