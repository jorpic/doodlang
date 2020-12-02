import "bulma/css/bulma.css"
import "@fortawesome/fontawesome-free/css/all.css"
import Two from "twojs-ts"

import {normalize} from "./analysis.ts"


const scratchpad = document.getElementById("scratchpad");
let scratchpadRect = scratchpad.getBoundingClientRect();
const two = new Two({
  type: Two.Types.svg,
  autostart: true,
  fullscreen: true
});

two.appendTo(scratchpad);


let symbol = [];
let points = [];

const last = xs => xs[xs.length-1];
const newVec = p => new Two.Vector(p.x, p.y);


function makePath(points, color, linewidth) {
  if(points.length > 1) {
    const [a, b] = points;
    const path = two.makePath(a.x, a.y, b.x, b.y, true);
    path.noFill().stroke = color;
    path.linewidth = linewidth;
    path.vertices.forEach(v => v.addSelf(path.translation));
    path.translation.clear();

    points.slice(2)
      .forEach(p => path.vertices.push(newVec(p)));

    return path;
  }
}


function addCurve(ps) {
  symbol.push({
    path: makePath(ps, "#6dcff6", 10),
    points: ps
  });
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
  // draw normalized symbol
  const norm = normalize(points);
  makePath(norm, "black", 1);

  // clear current point track
  points = [];
}

function addTouch(e) {
  addPoint(e.changedTouches[0]);
}


document.addEventListener("mousemove", e => {
  e.stopPropagation();
  e.preventDefault();
  if(e.buttons) addPoint(e);
}, {capture: true});
document.addEventListener("mouseup", finishLine);

document.addEventListener("touchmove", addTouch, {passive: false});
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
