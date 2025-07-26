#!/bin/bash

set -e

npm install circomlib

# Step 1: Compile the circuit
circom circuit.circom --r1cs --wasm --sym

# Step 2: Download trusted setup params (only once)
if [ ! -f powersOfTau28_hez_final_14.ptau ]; then
    wget -O powersOfTau28_hez_final_14.ptau \
  https://storage.googleapis.com/zkevm/ptau/powersOfTau28_hez_final_14.ptau
fi

# Step 3: Generate proving and verifying keys
snarkjs groth16 setup circuit.r1cs powersOfTau28_hez_final_14.ptau circuit.zkey
snarkjs zkey export verificationkey circuit.zkey verification_key.json

# Step 4: Generate witness
node circuit_js/generate_witness.js circuit_js/circuit.wasm input.json witness.wtns

# Step 5: Generate proof
snarkjs groth16 prove circuit.zkey witness.wtns proof.json public.json

# Step 6: Verify proof
snarkjs groth16 verify verification_key.json public.json proof.json