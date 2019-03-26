import "../style.css";
import "bulma/css/bulma.css";
import Bulma from "@vizuaalog/bulmajs/src/core";
import Tabs from "@vizuaalog/bulmajs/src/plugins/tabs";

Bulma.traverseDOM();

import * as wasm from "doodlang-core";
import { Canvas } from "./canvas";


const symbols = new wasm.SymbolStorage();

const el = document.getElementById("canvas");
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



/* TODO:
 *   - import predefined symbols
 *   - draw predefined symbols
 *   - process predefined symbols
 *   - draw processed symbols to compare differences
 *   - calculate gDTW
 */
