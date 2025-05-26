const canvas = document.querySelector("canvas"),
  toolBtns = document.querySelectorAll(".tool.option"),
  fillColor = document.querySelector("#fill-color"),
  sizeSlider = document.querySelector("#size-slider"),
  colorBtns = document.querySelectorAll(".colors .option"),
  colorPicker = document.querySelector("#color-picker"),
  clearCanvasBtn = document.querySelector(".clear-canvas"),
  saveImageBtn = document.querySelector(".save-img"),
  ctx = canvas.getContext("2d");
  undoBtn = document.querySelector(".undo-btn");
  redoBtn = document.querySelector(".redo-btn");


let prevMouseX,
  prevMouseY,
  isDrawing = false,
  selectedOption = "brush",
  brushWidth = 5,
  selectedColor = "#000",
  snapshot;

let undoStack = [];
let redoStack = [];


// Ajusta tamanho do canvas (CSS vs coordenadas internas)
function resizeCanvas() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
}
window.addEventListener("load", resizeCanvas);
window.addEventListener("resize", resizeCanvas);

// Fundo branco inicial
function setCanvasBackground() {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor;
}

// Funções de forma
function drawRect(e) {
  const w = e.offsetX - prevMouseX,
    h = e.offsetY - prevMouseY;
  fillColor.checked
    ? ctx.fillRect(prevMouseX, prevMouseY, w, h)
    : ctx.strokeRect(prevMouseX, prevMouseY, w, h);
}
function drawCircle(e) {
  const r = Math.hypot(e.offsetX - prevMouseX, e.offsetY - prevMouseY);
  ctx.beginPath();
  ctx.arc(prevMouseX, prevMouseY, r, 0, 2 * Math.PI);
  fillColor.checked ? ctx.fill() : ctx.stroke();
}
function drawTriangle(e) {
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.lineTo(2 * prevMouseX - e.offsetX, e.offsetY);
  ctx.closePath();
  fillColor.checked ? ctx.fill() : ctx.stroke();
}

function startDraw(e) {
  isDrawing = true;
  prevMouseX = e.offsetX;
  prevMouseY = e.offsetY;
  ctx.lineWidth = brushWidth;
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle = selectedColor;
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
  undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  redoStack = [];
}


// Rascunho enquanto move
function drawing(e) {
  if (!isDrawing) return;
  ctx.putImageData(snapshot, 0, 0);
  switch (selectedOption) {
    case "brush":
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.strokeStyle = selectedColor;
      ctx.stroke();
      break;
    case "eraser":
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.strokeStyle = "#fff";
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

toolBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".tool.option.active")?.classList.remove("active");
    btn.classList.add("active");
    selectedOption = btn.id;
  });
});

// Tamanho do pincel
sizeSlider.addEventListener("input", () => (brushWidth = sizeSlider.value));

// Converte rgb para #hex (opcional)
function rgbToHex(rgb) {
  const [r, g, b] = rgb.match(/\d+/g).map(Number);
  return (
    "#" +
    [r, g, b]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
  );
}

// Seleção de cor
colorBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".colors .selected")?.classList.remove("selected");
    btn.classList.add("selected");
    const bg = getComputedStyle(btn).backgroundColor;
    selectedColor = bg.startsWith("rgb") ? rgbToHex(bg) : bg;
  });
});
colorPicker.addEventListener("change", () => {
  selectedColor = colorPicker.value;
  document.querySelector(".colors .selected")?.classList.remove("selected");
  colorPicker.parentElement.classList.add("selected");
});

// Limpar canvas
clearCanvasBtn.addEventListener("click", () => {

  undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCanvasBackground();

  redoStack = [];
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
});

// Salvar imagem
saveImageBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `${Date.now()}.png`;
  link.href = canvas.toDataURL();
  link.click();
});

// Eventos do mouse
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => {
  if (isDrawing) {
    isDrawing = false;
    saveState(); // Salva o estado após concluir o desenho
  }
});canvas.addEventListener("mouseout", () => (isDrawing = false));

function undo() {
  if (undoStack.length > 0) {
    // Salva o estado atual na pilha de redo
    redoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    // Restaura o último estado da pilha de undo
    const lastState = undoStack.pop();
    ctx.putImageData(lastState, 0, 0);
  }
}

function redo() {
  if (redoStack.length > 0) {
    // Salva o estado atual na pilha de undo
    undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    // Restaura o último estado da pilha de redo
    const lastState = redoStack.pop();
    ctx.putImageData(lastState, 0, 0);
  }
}
undoBtn.addEventListener("click", undo);
redoBtn.addEventListener("click", redo);

