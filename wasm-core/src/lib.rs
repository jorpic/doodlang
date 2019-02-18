mod utils;

use cfg_if::cfg_if;
use serde_derive::{Serialize, Deserialize};
use wasm_bindgen::prelude::*;
use web_sys::CanvasRenderingContext2d;

cfg_if! {
    // When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
    // allocator.
    if #[cfg(feature = "wee_alloc")] {
        extern crate wee_alloc;
        #[global_allocator]
        static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
    }
}

// FIXME: get rid of serde for better performance
#[derive(Serialize, Deserialize)]
pub struct Point {
    x: f64,
    y: f64,
}

type Path = Vec<Point>;
type Symbol = Vec<Path>;

#[wasm_bindgen]
pub struct SymbolStorage {
    symbols: Vec<Symbol>,
}

#[wasm_bindgen]
impl SymbolStorage {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        SymbolStorage { symbols: vec![] }
    }

    pub fn match_symbol(&self, symbol: &JsValue) -> Result<usize, JsValue> {
        let _symbol = SymbolStorage::parse(symbol)?;
        Ok(0)
    }

    pub fn add_symbol(&mut self, symbol: &JsValue) -> Result<usize, JsValue> {
        let symbol = SymbolStorage::parse(symbol)?;
        self.symbols.push(symbol);
        Ok(self.symbols.len() - 1)
    }

    pub fn draw_program(
        &self,
        ctx: &CanvasRenderingContext2d,
        program: &[u32],
        start_x: f64,
        start_y: f64,
        size: f64, // symbol_size
    ) {
        let mut x = start_x;
        let y = start_y;

        for &sym_ix in program {
            let symbol = &self.symbols[sym_ix as usize];
            ctx.begin_path();
            for path in symbol {
                if path.is_empty() {
                    continue;
                }
                ctx.move_to(x + path[0].x * size, y + path[0].y * size);
                for p in &path[0..] {
                    ctx.line_to(x + p.x * size, y + p.y * size);
                }
            }
            ctx.stroke();
            x = x + size;
        }
    }


    fn parse(symbol: &JsValue) -> Result<Symbol, JsValue> {
        symbol.into_serde()
            .map_err(|_| "malformed path structure".into())
    }
}
