pragma circom 2.1.6;

include "node_modules/circomlib/circuits/poseidon.circom";

template SafeCircuit() {
    signal input secret;          // 私有线索
    signal input div;
    signal input hash_expected;   // 唯一公信号

    // 一些非线性运算 + 除法结构
    signal a;
    signal b;
    signal c;
    signal d;

    // ⚠️ Circom 没有除法，需要手动实现 secret / 62417857 = a，即约束 a * 12347 = secret
    a <-- secret / div;
    a * div === secret;                 // a = s / 62417857
    b <== a * a;                        // b = (s / 62417857)^2
    c <== b * a;                        // c = (s / 62417857) ^ 3
    d <== c - secret;                   // d = (s / 62417857) ^ 3 - s

    // ---- Poseidon ----
    component h = Poseidon(1);
    h.inputs[0] <== d
;

    // • 哈希必须匹配公开值
    h.out === hash_expected;

}

// 仅暴露 hash_expected ⇒ publicSignals = [hash_expected]
component main {public [hash_expected]} = SafeCircuit();
