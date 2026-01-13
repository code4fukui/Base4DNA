// Base4DNA.js
// Base4DNA: 2 bits per char using A/C/G/T
// Mapping: 00 A, 01 C, 10 G, 11 T

export class Base4DNA {
  static #ALPHABET = "ACGT";

  /**
   * Encode Uint8Array -> Base4DNA string
   * @param {Uint8Array} bytes
   * @param {number} [group=0] insert separator every N chars (0 = none)
   * @param {string} [separator="-"]
   * @returns {string}
   */
  static encode(bytes, group = 0, separator = "-") {
    if (!(bytes instanceof Uint8Array)) {
      throw new TypeError("Base4DNA.encode: bytes must be a Uint8Array");
    }
    if (!Number.isInteger(group) || group < 0) {
      throw new TypeError("Base4DNA.encode: group must be an integer >= 0");
    }

    const A = Base4DNA.#ALPHABET;
    const out = [];

    for (let i = 0; i < bytes.length; i++) {
      const b = bytes[i];
      out.push(
        A[(b >>> 6) & 0b11],
        A[(b >>> 4) & 0b11],
        A[(b >>> 2) & 0b11],
        A[(b >>> 0) & 0b11],
      );
    }

    if (group > 0 && out.length > group) {
      const grouped = [];
      for (let i = 0; i < out.length; i++) {
        if (i > 0 && (i % group) === 0) grouped.push(separator);
        grouped.push(out[i]);
      }
      return grouped.join("");
    }

    return out.join("");
  }

  /**
   * Decode Base4DNA string -> Uint8Array
   * @param {string} str
   * @param {RegExp} [ignore=/[\s\-_:\.]/g] chars to ignore
   * @returns {Uint8Array}
   */
  static decode(str, ignore = /[\s\-_:\.]/g) {
    if (typeof str !== "string") {
      throw new TypeError("Base4DNA.decode: str must be a string");
    }
    if (!(ignore instanceof RegExp)) {
      throw new TypeError("Base4DNA.decode: ignore must be a RegExp");
    }

    const clean = str.replace(ignore, "").toUpperCase();
    if ((clean.length % 4) !== 0) {
      throw new Error(`Base4DNA.decode: length must be a multiple of 4 (got ${clean.length})`);
    }

    const out = new Uint8Array(clean.length / 4);

    const val = (ch) => {
      switch (ch) {
        case "A": return 0;
        case "C": return 1;
        case "G": return 2;
        case "T": return 3;
        default: return -1;
      }
    };

    for (let i = 0, j = 0; i < clean.length; i += 4, j++) {
      const v0 = val(clean[i]);
      const v1 = val(clean[i + 1]);
      const v2 = val(clean[i + 2]);
      const v3 = val(clean[i + 3]);

      if ((v0 | v1 | v2 | v3) < 0) {
        const badIndex =
          v0 < 0 ? i :
          v1 < 0 ? i + 1 :
          v2 < 0 ? i + 2 : i + 3;
        throw new Error(`Base4DNA.decode: invalid character "${clean[badIndex]}" at position ${badIndex}`);
      }

      out[j] = (v0 << 6) | (v1 << 4) | (v2 << 2) | v3;
    }

    return out;
  }

  /** Encode UTF-8 string -> Base4DNA */
  static encodeString(text, group, separator) {
    if (typeof text !== "string") {
      throw new TypeError("Base4DNA.encodeString: text must be a string");
    }
    return Base4DNA.encode(new TextEncoder().encode(text), group, separator);
  }

  /** Decode Base4DNA -> UTF-8 string */
  static decodeString(dna, ignore) {
    return new TextDecoder().decode(Base4DNA.decode(dna, ignore));
  }
}
