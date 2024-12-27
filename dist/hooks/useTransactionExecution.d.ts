export declare const useTransactionExecution: () => {
    executing: boolean;
    digest: string | null;
    executeTransaction: (transactionBlock: Uint8Array, signature: string) => Promise<void>;
};
