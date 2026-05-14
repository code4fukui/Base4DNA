# Base4DNA


> **すべての生命はBase-4でエンコードされています。** このライブラリは単にそれを認めただけです。

**Base4DNA** は、`A`、`C`、`G`、`T` の4文字のみを使用してバイナリデータを表現する、小さく、遊び心のある、完全に決定論的なエンコード方式です。DNAの塩基にインスパイアされており、各文字は **2ビット** をエンコードします。正確で、可逆性があり、十分にテストされた実装です。

## 特徴

- 🧪 `A`、`C`、`G`、`T` を使用した **Base-4エンコード**
- 🔁 **ロスレスかつ可逆的**
- 🧠 シンプルで明示的なビットマッピング
- 🔊 声に出して読める（「A C G T」）
- 📄 テキスト、ログ、QRコード、コピー＆ペーストに安全
- 🦕 依存関係ゼロ
- 🧪 **網羅的にテスト済み**（全256バイト値）

## 使い方

### バイト列のエンコード / デコード

```js
import { Base4DNA } from "https://code4fukui.github.io/Base4DNA/Base4DNA.js";

const bytes = new Uint8Array([0xCA, 0xFE]);
const dna = Base4DNA.encode(bytes);
console.log(dna); // TAGGTTTG

const back = Base4DNA.decode(dna);
console.log(back); // Uint8Array [202, 254]
```

### UTF-8文字列のエンコード / デコード

```js
const dna = Base4DNA.encodeString("Hello DNA 🧬", 8);
console.log(dna);

const text = Base4DNA.decodeString(dna);
console.log(text);
```

## グループ化（ヒューマンフレンドリー）

```js
Base4DNA.encode(bytes, 4);
// TAGG-TTTG
```

デコード時は、スペースや一般的な区切り文字を自動的に無視します。

## テスト

すべてのテスト（網羅的なバイトテストを含む）を実行します：

```bash
deno test
```

## ライセンス

CC0 / Public Domain.