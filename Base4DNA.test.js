// Base4DNA.test.js
import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.224.0/testing/asserts.ts";

import { Base4DNA } from "./Base4DNA.js";

// Helper: Uint8Array equality is handled by assertEquals

Deno.test("encode: empty", () => {
  assertEquals(Base4DNA.encode(new Uint8Array([])), "");
});

Deno.test("decode: empty", () => {
  assertEquals(Base4DNA.decode(""), new Uint8Array([]));
});

Deno.test("encode known vector: 0x00 -> AAAA", () => {
  assertEquals(Base4DNA.encode(new Uint8Array([0x00])), "AAAA");
});

Deno.test("encode known vector: 0xFF -> TTTT", () => {
  assertEquals(Base4DNA.encode(new Uint8Array([0xFF])), "TTTT");
});

Deno.test("encode known vector: 0xCA 0xFE -> TAGGTTTG", () => {
  // 0xCA = 1100 1010 -> 11 00 10 10 -> T A G G
  // 0xFE = 1111 1110 -> 11 11 11 10 -> T T T G
  assertEquals(Base4DNA.encode(new Uint8Array([0xCA, 0xFE])), "TAGGTTTG");
});

Deno.test("decode known vector: TAGGTTTG -> [0xCA, 0xFE]", () => {
  assertEquals(
    Base4DNA.decode("TAGGTTTG"),
    new Uint8Array([0xCA, 0xFE]),
  );
});

Deno.test("decode accepts lowercase", () => {
  assertEquals(
    Base4DNA.decode("taggtttg"),
    new Uint8Array([0xCA, 0xFE]),
  );
});

Deno.test("encode grouping: group=4 inserts separators", () => {
  assertEquals(
    Base4DNA.encode(new Uint8Array([0xCA, 0xFE]), 4, "-"),
    "TAGG-TTTG",
  );
});

Deno.test("decode ignores separators by default", () => {
  // default ignore: /[\\s\\-_:\\.]/g
  assertEquals(
    Base4DNA.decode("TAGG-TTTG"),
    new Uint8Array([0xCA, 0xFE]),
  );
  assertEquals(
    Base4DNA.decode("TAGG_TTTG"),
    new Uint8Array([0xCA, 0xFE]),
  );
  assertEquals(
    Base4DNA.decode("TAGG:TTTG"),
    new Uint8Array([0xCA, 0xFE]),
  );
  assertEquals(
    Base4DNA.decode("TAGG.TTTG"),
    new Uint8Array([0xCA, 0xFE]),
  );
  assertEquals(
    Base4DNA.decode("T A\tG\nG\rT T T G"),
    new Uint8Array([0xCA, 0xFE]),
  );
});

Deno.test("encodeString/decodeString roundtrip (UTF-8)", () => {
  const s = "Base4DNA 🧬 こんにちは";
  const dna = Base4DNA.encodeString(s, 16, "-");
  const back = Base4DNA.decodeString(dna);
  assertEquals(back, s);
});

Deno.test("roundtrip bytes (deterministic pseudo-random)", () => {
  // simple LCG for repeatability
  let x = 123456789;
  const next = () => (x = (1103515245 * x + 12345) >>> 0);

  for (const len of [1, 2, 3, 4, 7, 8, 15, 16, 31, 32, 64, 255]) {
    const bin = new Uint8Array(len);
    for (let i = 0; i < len; i++) bin[i] = next() & 0xFF;

    const dna = Base4DNA.encode(bin, 20, "-");
    const back = Base4DNA.decode(dna);
    assertEquals(back, bin);
  }
});

Deno.test("decode rejects length not multiple of 4", () => {
  assertThrows(
    () => Base4DNA.decode("A"),
    Error,
    "length must be a multiple of 4",
  );
  assertThrows(
    () => Base4DNA.decode("ACG"),
    Error,
    "length must be a multiple of 4",
  );
});

Deno.test("decode rejects invalid characters", () => {
  assertThrows(() => Base4DNA.decode("AAAN"), Error, "invalid character");
  assertThrows(() => Base4DNA.decode("AAAU"), Error, "invalid character");
  assertThrows(() => Base4DNA.decode("AAAX"), Error, "invalid character");
});

Deno.test("encode input validation", () => {
  assertThrows(
    // @ts-ignore - intentional misuse
    () => Base4DNA.encode([1, 2, 3]),
    TypeError,
    "Uint8Array",
  );
  assertThrows(
    () => Base4DNA.encode(new Uint8Array([1]), -1),
    TypeError,
    "group must be an integer >= 0",
  );
});

Deno.test("decode input validation", () => {
  assertThrows(
    // @ts-ignore - intentional misuse
    () => Base4DNA.decode(new Uint8Array([1, 2, 3])),
    TypeError,
    "str must be a string",
  );
  assertThrows(
    // @ts-ignore - intentional misuse
    () => Base4DNA.decode("AAAA", "not-regexp"),
    TypeError,
    "ignore must be a RegExp",
  );
});

Deno.test("spec: exhaustive 0..255 single-byte roundtrip + alphabet check", () => {
  const allowed = new Set(["A", "C", "G", "T"]);

  for (let b = 0; b <= 255; b++) {
    const bin = new Uint8Array([b]);

    // encode must be 4 chars (2 bits per char * 4 = 8 bits)
    const dna = Base4DNA.encode(bin);
    assertEquals(dna.length, 4);

    // must consist only of A/C/G/T
    for (const ch of dna) {
      if (!allowed.has(ch)) {
        throw new Error(`unexpected char "${ch}" for byte ${b} -> ${dna}`);
      }
    }

    // decode must recover original
    const back = Base4DNA.decode(dna);
    assertEquals(back, bin);

    // lowercase should decode too
    assertEquals(Base4DNA.decode(dna.toLowerCase()), bin);

    // grouping (group=2) should insert exactly one separator for 4 chars => "XX-XX"
    const g2 = Base4DNA.encode(bin, 2, "-");
    assertEquals(g2.length, 5);
    assertEquals(g2[2], "-");
    assertEquals(Base4DNA.decode(g2), bin);

    // grouping (group=4) should not change single-byte output (no extra separator)
    const g4 = Base4DNA.encode(bin, 4, "-");
    assertEquals(g4, dna);
  }
});

Deno.test("spec: exhaustive 0..255 mapping matches bit pattern (00 A,01 C,10 G,11 T)", () => {
  // For each byte, check each 2-bit chunk maps correctly:
  // bits 6..7 -> char0, 4..5 -> char1, 2..3 -> char2, 0..1 -> char3
  const map = ["A", "C", "G", "T"];

  for (let b = 0; b <= 255; b++) {
    const dna = Base4DNA.encode(new Uint8Array([b]));
    const expected =
      map[(b >>> 6) & 3] +
      map[(b >>> 4) & 3] +
      map[(b >>> 2) & 3] +
      map[(b >>> 0) & 3];

    assertEquals(dna, expected);
  }
});
