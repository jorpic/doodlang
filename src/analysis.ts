
import sparkline from "@fnando/sparkline"


const deg = x => x*180/Math.PI;
const last = xs => xs[xs.length-1];

const D = 64;

// FIXME: не срезать острые углы
export function normalize(points) {
  let a = points[0];
  let lastDirection = 0;
  const norm = [];

  const segment  = (a, p) => {
    const dx = p.x - a.x;
    const dy = p.y - a.y;
    const length = Math.sqrt(dx*dx + dy*dy);
    const direction = deg(Math.atan(-dx / dy));
    const directionDelta = direction - lastDirection;
    return {
      x: a.x,
      y: a.y,
      dx, dy, length,
      direction, directionDelta
    };
  }

  for(let p of points) {
    const s = segment(a, p);
    if(s.length > D) {
      a = p;
      lastDirection = s.direction;
      norm.push(s);
    }
  }

  norm.push(segment(a, last(points)));
  norm.length > 2 && acceleration(norm);
  return norm;
}


function acceleration(segments) {
  const a = [];
  const [{directionDelta}] = segments;
  for(let s of segments.slice(1)) {
    a.push(s.directionDelta - directionDelta);
    directionDelta = s.directionDelta;
  }

  sparkline(
    document.getElementById("direction-change"),
    a);
}
