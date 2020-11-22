import "bulma/css/bulma.css"
import "@fortawesome/fontawesome-free/css/all.css"
import Two from "twojs-ts"


const scratchpad = document.getElementById("scratchpad");
let scratchpadRect = scratchpad.getBoundingClientRect();
const two = new Two({
  type: Two.Types.svg,
  autostart: true,
  width: scratchpad.offsetWidth,
  height: scratchpad.offsetHeight
});

two.appendTo(scratchpad);


let symbol = [];
let points = [];

const last = xs => xs[xs.length-1];
const newVec = p => new Two.Vector(p.x, p.y);

function addCurve(ps) {
  const [a, b] = ps;
  const path = two.makePath(a.x, a.y, b.x, b.y, true);
  path.noFill().stroke = "#6dcff6";
  path.linewidth = 10;
  path.vertices.forEach(v => v.addSelf(path.translation));
  path.translation.clear();

  ps.slice(2)
    .forEach(p => path.vertices.push(newVec(p)));
  symbol.push({path, points: ps});
}


function addPoint(ev) {
  const p = {
    x: ev.clientX - scratchpadRect.left,
    y: ev.clientY - scratchpadRect.top
  };
  points.push(p);

  if(points.length == 2) {
    addCurve(points);
  } else if(points.length > 1) {
    last(symbol).path.vertices.push(newVec(p));
  }
}


function finishLine() {
  points = [];
}

function addTouch(e) {
  e.preventDefault();
  addPoint(e.changedTouches[0]);
}


scratchpad.addEventListener("mousemove", e => e.buttons && addPoint(e));
document.addEventListener("mouseup", finishLine);

scratchpad.addEventListener("touchmove", addTouch, {passive: false});
document.addEventListener("touchend", finishLine);


const deletedPoints = [];

function undo() {
  if(symbol.length) {
    const c = symbol.pop();
    c.path.remove();
    deletedPoints.push(c.points);
  }
}

function redo() {
  if(deletedPoints.length) {
    addCurve(deletedPoints.pop());
  }
}

window.addEventListener("keydown", e => {
  e.ctrlKey && e.key === "z" && undo();
  e.ctrlKey && e.key === "y" && redo();
}, false);

document.getElementById("undo").onclick = undo;
document.getElementById("redo").onclick = redo;


function resizeScratchpad() {
  setTimeout(() => { // wait a bit to let DOM element to redraw
    scratchpadRect = scratchpad.getBoundingClientRect();
    two.renderer.setSize(scratchpad.offsetWidth, scratchpad.offsetHeight);
  }, 100);
}

window.addEventListener("orientationchange", resizeScratchpad);
window.addEventListener("resize", resizeScratchpad);
