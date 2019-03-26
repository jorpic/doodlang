import "../style.css";
import "bulma/css/bulma.css";
import Bulma from "@vizuaalog/bulmajs/src/core";
import Tabs from "@vizuaalog/bulmajs/src/plugins/tabs";

Bulma.traverseDOM();

import * as wasm from "doodlang-core";
import { Canvas } from "./canvas";
import { Symbol } from "./test_symbols";


const symbols = new wasm.SymbolStorage();

const el = document.getElementById("canvas-new");
const canvas = new Canvas(el);

let currentSymbol = [];
const currentProgram = [];

canvas.onFinish = function (id, path) {
  const scaled_path = path.map((p) => ({x: p.x / el.width, y: p.y / el.height}));
  currentSymbol.push(scaled_path);
};


const btn = document.getElementById("addSymbol");
btn.onclick = function () {
  const ix = symbols.add_symbol(currentSymbol);
  console.log("Symbol added", ix, currentSymbol);
  currentProgram.push(ix);
  currentSymbol = [];

  const ctx = el.getContext("2d");
  ctx.clearRect(0, 0, el.width, el.height);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "red";
  symbols.draw_program(ctx, currentProgram, 0, 0, 40);
};


const BTN_SIZE = 40;
const lib = document.getElementById("library-buttons");
const canvas_lib = document.getElementById("canvas-lib");
const canvas_lib_ctx = canvas_lib.getContext("2d");
for (const s in Symbol) {
  const sym = Symbol[s];
  const ix = symbols.add_symbol(sym);

  const el = document.createElement("canvas");
  el.className = "symbol-btn";
  el.width = BTN_SIZE;
  el.height = BTN_SIZE;
  el.onclick = function() {
    const h = canvas_lib.height;
    const w = canvas_lib.width;
    canvas_lib_ctx.clearRect(0, 0, w, h);
    symbols.draw_program(canvas_lib_ctx, [ix], 0, 0, h < w ? h : w);
  };
  lib.appendChild(el);

  const ctx = el.getContext("2d");
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
  symbols.draw_program(ctx, [ix], 0, 0, BTN_SIZE);
}


/* TODO:
 *   - process symbols
 *   - draw processed symbol over original to compare differences
 *   - calculate gDTW
 */
