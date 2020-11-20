import Two from 'twojs-ts';

const two = new Two({
  type: Two.Types.svg
  fullscreen: true,
  autostart: true
});

const canvasDiv = document.getElementById("canvas");
two.appendTo(canvas);

const line = two.makeLine(10, 20, 40, 50);
line.noFill().stroke = "#6dcff6";
line.linewidth = 10;
two.update();


let start = null;

function addPoint(p) {
  const end = new Two.Vector(p.clientX || p.pageX, p.clientY || p.pageY);

  if(start && end.distanceTo(start) > 10) {
    const line = two.makeLine(start.x, start.y, end.x, end.y, true);
    line.noFill().stroke = "#6dcff6";
    line.linewidth = 10;
    start = end.clone();
  }

  if(!start) {
    start = end;
  }
}

window.addEventListener("mousedown", addPoint);
window.addEventListener("mousemove", e => start && addPoint(e));
window.addEventListener("mouseup", e => {
  addPoint(e);
  start = null;
});

window.addEventListener("touchstart", e => {
  e.preventDefault();
  const touch = e.changedTouches[0];
  addPoint(touch);
}, {passive: false});

window.addEventListener("touchmove", e => {
  e.preventDefault();
  const touch = e.changedTouches[0];
  addPoint(touch);
}, {passive: false});

window.addEventListener("touchend", () => {
  start = null;
});

