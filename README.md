# ts-wasm-runtime

⚠️ Work in progress 🚧

Zero Dependency WebAssembly Parser and Runtime Made with Pure TypeScript.

This is a hobby project for learning about WASM.

### s-parser.ts

S-Expression parser based on parser.ts.

### wat-parser.ts

Parses S-Expression generated by s-parser to AST.

### vm.ts

Abstract implementation of VM not dependent on specific instruction set or program.

### wasm-vm.ts

Provides WASM instruction set and creates virtual machine using vm.ts.

### compiler.ts

Compiles AST generated by wat-parser.ts into machine code for wasm-vm.ts.

## License

MIT License

The core spec test is an edited version of the code distributed under https://github.com/WebAssembly/spec/tree/master/test/core with Apache License 2.0.
