
export function Canvas(el) {
  this.ctx = el.getContext("2d");
  this.touches = {};

  this.onFinish = null;
  this.onCancel = null;

  this.stroke = function(a, b) {
    this.ctx.beginPath();
    this.ctx.lineWidth = 4;
    this.ctx.strokeStyle = "blue";
    this.ctx.moveTo(a.x, a.y);
    this.ctx.lineTo(b.x, b.y);
    this.ctx.stroke();
  };

  function bindEv(ev, handler) {
    el.addEventListener(ev, handler, false);
  }

  bindEv("touchstart",  handleStart.bind(this));
  bindEv("touchend",    handleEnd.bind(this));
  bindEv("touchcancel", handleCancel.bind(this));
  bindEv("touchmove",   handleMove.bind(this));
}


function handleStart(ev) {
  ev.preventDefault();
  for (const t of ev.changedTouches) {
    const touch = {x: t.pageX, y: t.pageY};
    this.touches[t.identifier] = [touch];
  }
}

function handleMove(ev) {
  ev.preventDefault();
  for (const t of ev.changedTouches) {
    const prev = this.touches[t.identifier];
    if (prev !== undefined) {
      const touch = {x: t.pageX, y: t.pageY};
      this.stroke(prev[0], touch);
      prev.unshift(touch);
    }
  }
}

function handleEnd(ev) {
  ev.preventDefault();
  for (const t of ev.changedTouches) {
    const prev = this.touches[t.identifier];
    if (prev !== undefined) {
      const touch = {x: t.pageX, y: t.pageY};
      this.stroke(prev[0], touch);
      prev.unshift(touch);
      delete this.touches[t.identifier];
      if (this.onFinish) {
        this.onFinish(t.identifier, prev);
      } else {
        console.log("Finished", t.identifier, prev);
      }
    }
  }
}

function handleCancel() {
  ev.preventDefault();
  for (const t of ev.changedTouches) {
    const prev = this.touches[t.identifier];
    if (prev !== undefined) {
      const touch = {x: t.pageX, y: t.pageY};
      prev.unshift(touch);
      delete this.touches[t.identifier];
      if (this.onCancel) {
        this.onCancel(t.identifier, prev);
      } else {
        console.log("Cancelled", t.identifier, prev);
      }
    }
  }
}
