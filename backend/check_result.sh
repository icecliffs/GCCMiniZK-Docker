#!/bin/bash
set -e

# 只接收以下文件
# - proof.json
# - public.json

EXPECTED_PUBLIC_JSON='["20784164527384392756880867157508175460830630808606996744351565669311727403191"]'

# Step 1: 验证 Proof 是否有效
snarkjs groth16 verify verification_key.json submit/public.json submit/proof.json

# Step 2: 验证 public input 是否正确
ACTUAL_PUBLIC_JSON=$(cat submit/public.json | tr -d '\n' | jq -c '.')
echo $ACTUAL_PUBLIC_JSON
if [ "$ACTUAL_PUBLIC_JSON" != "$EXPECTED_PUBLIC_JSON" ]; then
  echo "❌ Public input mismatch!"
  echo "Expected: $EXPECTED_PUBLIC_JSON"
  echo "Actual:   $ACTUAL_PUBLIC_JSON"
  exit 1
else
  echo "✅ Public input match confirmed."
fi