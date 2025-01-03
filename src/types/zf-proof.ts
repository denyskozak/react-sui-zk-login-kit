import { getZkLoginSignature } from "@mysten/sui/zklogin";

export type ZkProof = Omit<
    Parameters<typeof getZkLoginSignature>['0']['inputs'],
    'addressSeed'
>;