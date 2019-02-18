import * as wasm from "doodlang-core";
import { Canvas } from "./canvas";

const symbols = new wasm.SymbolStorage();

const el = document.getElementById("canvas");
const canvas = new Canvas(el);

canvas.onFinish = function (id, path) {
  const scaled = path.map((p) => ({x: p.x / el.width, y: p.y / el.height}));
  symbols.match_symbol([scaled]);
  const ix = symbols.add_symbol([scaled]);
  console.log("Line finished", id, ix, scaled);

  const ctx = el.getContext("2d");
  this.ctx.lineWidth = 1;
  this.ctx.strokeStyle = "red";
  symbols.draw(ctx, ix, 40, 40, 40, 40);
};
