# 🧬 Base4DNA

> **All life is Base-4 encoded.**  
> This library just admits it.

**Base4DNA** is a tiny, playful, and fully deterministic encoding that represents binary data using only four characters: `A`, `C`, `G`, and `T`. Each character encodes **2 bits**, inspired by DNA nucleotides. It's a correct, reversible, and well-tested implementation.

## Features

- 🧪 **Base-4 encoding** using `A`, `C`, `G`, and `T`
- 🔁 **Lossless & reversible**
- 🧠 Simple, explicit bit mapping
- 🔊 Readable aloud ("A C G T")
- 📄 Safe for text, logs, QR codes, and copy-paste
- 🦕 Zero dependencies
- 🧪 **Exhaustively tested** (all 256 byte values)

## Usage

### Encode / Decode bytes

```js
import { Base4DNA } from "https://code4fukui.github.io/Base4DNA/Base4DNA.js";

const bytes = new Uint8Array([0xCA, 0xFE]);
const dna = Base4DNA.encode(bytes);
console.log(dna); // TAGGTTTG

const back = Base4DNA.decode(dna);
console.log(back); // Uint8Array [202, 254]
```

### Encode / Decode UTF-8 strings

```js
const dna = Base4DNA.encodeString("Hello DNA 🧬", 8);
console.log(dna);

const text = Base4DNA.decodeString(dna);
console.log(text);
```

## Grouping (Human-Friendly)

```js
Base4DNA.encode(bytes, 4);
// TAGG-TTTG
```

Decoding ignores spaces and common separators automatically.

## Testing

Run all tests (including exhaustive byte tests):

```bash
deno test
```

## License

CC0 / Public Domain.