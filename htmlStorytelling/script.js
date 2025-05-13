const canvas         = document.querySelector("canvas"),
      toolBtns       = document.querySelectorAll(".tool"),
      fillColor      = document.querySelector("#fill-color"),
      sizeSlider     = document.querySelector("#size-slider"),
      colorBtns      = document.querySelectorAll(".colors .option"),
      colorPicker    = document.querySelector("#color-picker"),
      clearCanvasBtn = document.querySelector(".clear-canvas"),
      saveImageBtn   = document.querySelector(".save-img"),
      ctx            = canvas.getContext("2d");

let prevMouseX, prevMouseY,
    isDrawing   = false,
    selectedTool= "brush",
    brushWidth  = 5,
    selectedColor="#000",
    snapshot;

// Ajusta tamanho do canvas (CSS vs coordenadas internas)
function resizeCanvas() {
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
}
window.addEventListener("load",  resizeCanvas);
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

// Inicia desenho
function startDraw(e) {
  isDrawing = true;
  prevMouseX = e.offsetX;
  prevMouseY = e.offsetY;
  ctx.lineWidth   = brushWidth;
  ctx.strokeStyle = selectedColor;
  ctx.fillStyle   = selectedColor;
  ctx.beginPath();
  ctx.moveTo(prevMouseX, prevMouseY);
  snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

// Rascunho enquanto move
function drawing(e) {
  if (!isDrawing) return;
  ctx.putImageData(snapshot, 0, 0);
  switch (selectedTool) {
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
    case "rectangle": drawRect(e); break;
    case "circle":    drawCircle(e); break;
    case "triangle":  drawTriangle(e); break;
  }
}

// Seleção de ferramentas
toolBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".options .active")?.classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
  });
});

// Tamanho do pincel
sizeSlider.addEventListener("input", () => brushWidth = sizeSlider.value);

// Seleção de cor
colorBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".colors .selected")?.classList.remove("selected");
    btn.classList.add("selected");
    selectedColor = getComputedStyle(btn).backgroundColor;
  });
});
colorPicker.addEventListener("change", () => {
  selectedColor = colorPicker.value;
  document.querySelector(".colors .selected")?.classList.remove("selected");
  colorPicker.parentElement.classList.add("selected");
});

// Limpar canvas
clearCanvasBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCanvasBackground();
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
canvas.addEventListener("mouseup",   () => isDrawing = false);
canvas.addEventListener("mouseout",  () => isDrawing = false);
