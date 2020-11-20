import Two from 'twojs-ts';

const two = new Two({
  type: Two.Types.svg
  fullscreen: true,
  autostart: true
});

const canvasDiv = document.getElementById("canvas");
two.appendTo(canvas);

let isMouseDown = false;
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
  const p = {x: ev.clientX || ev.pageX, y: ev.clientY || ev.pageY};
  points.push(p);
  if(points.length == 2) {
    addCurve(points);
  } else if(points.length > 1) {
    last(symbol).path.vertices.push(newVec(p));
  }
}


function finishLine() {
  points = [];
  isMouseDown = false;
}


function addTouch(e) {
  e.preventDefault();
  addPoint(e.changedTouches[0]);
}


document.addEventListener("mousedown", e => { isMouseDown = true; });
document.addEventListener("mousemove", e => isMouseDown && addPoint(e));
document.addEventListener("mouseup", finishLine);

document.addEventListener("touchstart", addTouch, {passive: false});
document.addEventListener("touchmove", addTouch, {passive: false});
document.addEventListener("touchend", finishLine);


const deletedPoints = [];
document.addEventListener("keydown", e => {
  if (event.ctrlKey && event.key === "z" && symbol.length) {
    const c = symbol.pop();
    c.path.remove();
    deletedPoints.push(c.points);
  }
  if (event.ctrlKey && event.key === "y" && deletedPoints.length) {
    addCurve(deletedPoints.pop());
  }
}, false);
