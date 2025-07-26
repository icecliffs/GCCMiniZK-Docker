// server.js
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const snarkjs = require('snarkjs');
const cors = require('cors');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors({
  origin: 'http://你猜猜这是什么',
  methods: ['POST'],
  allowedHeaders: ['Content-Type']
}));

// 预期的 public input
const EXPECTED_PUBLIC_JSON = JSON.stringify([
  "5060484087819291739153614466260351472818838563279695100645677673987094571861"
]);

app.post('/verify', upload.fields([
  { name: 'proof', maxCount: 1 },
  { name: 'public', maxCount: 1 }
]), async (req, res) => {
  try {
    const proofPath = req.files.proof[0].path;
    const publicPath = req.files.public[0].path;

    const proof = JSON.parse(fs.readFileSync(proofPath));
    const publicSignals = JSON.parse(fs.readFileSync(publicPath));

    const vKey = JSON.parse(fs.readFileSync('verification_key.json'));

    // Step 1: 验证 proof 合法性
    const isValid = await snarkjs.groth16.verify(vKey, publicSignals, proof);
    if (!isValid) {
      return res.status(400).json({ verified: false, error: 'Invalid proof' });
    }

    // Step 2: 验证 public inputs 是否匹配
    const actual = JSON.stringify(publicSignals);
    if (actual !== EXPECTED_PUBLIC_JSON) {
      return res.status(400).json({
        verified: false,
        error: 'Public input mismatch',
        expected: JSON.parse(EXPECTED_PUBLIC_JSON),
        actual: publicSignals
      });
    }

    return res.json({ verified: true, actual: "Last hint “Terminal C orange bag”" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ verified: false, error: "Wrong answer" });
  }
});

const PORT = process.env.PORT || 11451;
app.listen(PORT, () => console.log(`Verifier running on http://localhost:${PORT}`));