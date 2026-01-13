import { Base4DNA } from "./Base4DNA.js";

const s = Base4DNA.encode(new Uint8Array([0, 1, 2, 3]));
console.log(s);

const dna = Base4DNA.encodeString("Base4DNA", 8);
console.log(dna);

const text = Base4DNA.decodeString(dna);
console.log(text);
