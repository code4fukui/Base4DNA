# Base4DNA

**全ての生命は Base-4 エンコーディングされています。このライブラリはそれを認めています。**

**Base4DNA** は小さくて遊び心のある、完全に決定論的なエンコーディングです。2ビットを表す4文字 `A`, `C`, `G`, `T` を使用しており、DNAのヌクレオチドに着想を得ています。正しく、可逆的で、十分にテストされた実装です。

## 機能

- 🧪 `A`, `C`, `G`, `T` を使用した **Base-4 エンコーディング**
- 🔁 **無損失・可逆的**
- 🧠 単純明快なビットマッピング
- 🔊 読み上げ可能 ("A C G T")
- 📄 テキスト、ログ、QRコード、コピー&ペーストに安全
- 🦕 ゼロ依存
- 🧪 **徹底的にテスト** (全256バイト値)

## 使い方

### バイト列のエンコード/デコード

```js
import { Base4DNA } from "https://code4fukui.github.io/Base4DNA/Base4DNA.js";

const bytes = new Uint8Array([0xCA, 0xFE]);
const dna = Base4DNA.encode(bytes);
console.log(dna); // TAGGTTTG

const back = Base4DNA.decode(dna);
console.log(back); // Uint8Array [202, 254]
```

### UTF-8 文字列のエンコード/デコード

```js
const dna = Base4DNA.encodeString("Hello DNA 🧬", 8);
console.log(dna);

const text = Base4DNA.decodeString(dna);
console.log(text);
```

## グループ化（人間向け）

```js
Base4DNA.encode(bytes, 4);
// TAGG-TTTG
```

デコード時は自動的にスペースや一般的な区切り文字を無視します。

## ライセンス

CC0 / Public Domain.