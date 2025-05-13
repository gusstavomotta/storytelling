// script.js
const canvas = document.querySelector("canvas"),
      toolBtns = document.querySelectorAll(".tool"),
      fillColor = document.querySelector("#fill-color"),
      sizeSlider = document.querySelector("#size-slider"),
      colorBtns = document.querySelectorAll(".colors .option"),
      colorPicker = document.querySelector("#color-picker"),
      clearCanvasBtn = document.querySelector(".clear-canvas"),
      saveImageBtn = document.querySelector(".save-img"),
      ctx = canvas.getContext("2d");

let prevMouseX, prevMouseY,
    isDrawing = false,
    selectedTool = "brush",
    brushWidth = 5,
    selectedColor = "#000",
    snapshot;

// set white background on canvas
function setCanvasBackground() {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor;
}

// initialize canvas size and background
window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
});

// drawing functions
function drawRect(e) {
  const width = e.offsetX - prevMouseX;
  const height = e.offsetY - prevMouseY;
  if (fillColor.checked) ctx.fillRect(prevMouseX, prevMouseY, width, height);
  else ctx.strokeRect(prevMouseX, prevMouseY, width, height);
}

function drawCircle(e) {
  const radius = Math.sqrt(
    Math.pow(e.offsetX - prevMouseX, 2) + Math.pow(e.offsetY - prevMouseY, 2)
  );
  ctx.beginPath();
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
  fillColor.checked ? ctx.fill() : ctx.stroke();
}

function drawTriangle(e) {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
  ctx.closePath();
  fillColor.checked ? ctx.fill() : ctx.stroke();
}

// start drawing
function startDraw(e) {
  isDrawing = true;
  prevMouseX = e.offsetX;
  prevMouseY = e.offsetY;
  ctx.lineWidth = brushWidth;
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

// drawing on mouse move
function drawing(e) {
  if (!isDrawing) return;
  ctx.putImageData(snapshot, 0, 0);

  switch (selectedTool) {
    case "brush":
      ctx.strokeStyle = selectedColor;
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      break;
    case "eraser":
      ctx.strokeStyle = "#fff";
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      break;
    case "rectangle":
      drawRect(e);
      break;
    case "circle":
      drawCircle(e);
      break;
    case "triangle":
      drawTriangle(e);
      break;
  }
}

// tool button click
toolBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
  });
});

// brush size change
sizeSlider.addEventListener("input", () => brushWidth = sizeSlider.value);

// color button selection
colorBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".colors .selected").classList.remove("selected");
    btn.classList.add("selected");
    selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
  });
});

// custom color picker
colorPicker.addEventListener("change", () => {
  selectedColor = colorPicker.value;
  document.querySelector(".colors .selected").classList.remove("selected");
  colorPicker.parentElement.classList.add("selected");
});

// clear canvas
clearCanvasBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCanvasBackground();
});

// save image
saveImageBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `${Date.now()}.jpg`;
  link.href = canvas.toDataURL();
  link.click();
});

// mouse events
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => isDrawing = false);
canvas.addEventListener("mouseout", () => isDrawing = false);
