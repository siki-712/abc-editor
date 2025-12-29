import init, { tokenize, parse, analyze } from 'chamber-abc';

// Top-level awaitでWASMを初期化
await init();

export { tokenize, parse, analyze };
