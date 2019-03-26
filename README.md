# 🦀🕸️ `wasm-pack-template`


Build `wasm-core`. This will fill `wasm-core/pkg` directory with codez.

```
cd wasm-core && wasm-pack build ; cd -
```

Create symbolic link to compiled `wasm-core` in `~/.npm-global`.

```
cd wasm-code/pkg && npm link ; cd -
```

Link `wasm-core` from `~/.npm-global` into `./node_modules`.

```
npm link doodlang-core
```

Build and run.

```
npm run start
```

TODO:
  - resize the canvas dynamically
  - handle drawing with a mouse
