import {useCallback, useLayoutEffect, useState} from "react";
import {Box, Button, Paper, Typography} from "@mui/material";
import {getFaucetHost, requestSuiFromFaucetV2} from '@mysten/sui/faucet';
import {Transaction} from "@mysten/sui/transactions";
import {useZKLogin} from "../../../src";

interface ExecuteTxProps {
    address: string;
}

function mistToSui(mistAmount: bigint | number): number {
    const MIST_PER_SUI = 1_000_000_000; // 1 SUI = 10^9 MIST
    return Number(mistAmount) / MIST_PER_SUI;
}

export const ExecuteTx = ({address}: ExecuteTxProps) => {
    const [balance, setBalance] = useState(0);
    const [txDigest, setTxDigest] = useState('');
    const {executeTransaction, client} = useZKLogin();

    const getSuiCoins = useCallback(async () => {
        const coins = await client.getCoins({
            owner: address,
            coinType: "0x2::sui::SUI"
        });

        const sum = coins?.data?.reduce((sum, coin) => sum + Number(coin.balance), 0) || 0;
        setBalance(mistToSui(sum))
    }, []);

    useLayoutEffect(() => {
        getSuiCoins()
    }, []);

    const faucetHandle = async () => {
        await requestSuiFromFaucetV2({
            host: getFaucetHost('devnet'),
            recipient: address,
        });
        getSuiCoins();
    }

    const executeTestTX = async () => {
        const tx = new Transaction();

        const [coin] = tx.splitCoins(tx.gas, [100]);
        tx.transferObjects(
            [coin],
            "0xfa0f8542f256e669694624aa3ee7bfbde5af54641646a3a05924cf9e329a8a36"
        );
        tx.setSender(address);
        const digest = await executeTransaction(tx);
        if (digest) {
            setTxDigest(digest)
        }
        getSuiCoins();
    }

    return (
        <Paper sx={{padding: '24px', marginTop: '24px', justifyContent: 'center'}}>
            <Typography>
                Test Transaction Panel (not part of ZkLoginComponent)
            </Typography>
            <Typography>
                Balance: {balance} Sui
            </Typography>

            <Box>
                <Button onClick={faucetHandle}>Faucet</Button>
            </Box>

            {balance > 0 && (
                <Box>
                    <Button onClick={executeTestTX}>Execute Test Transaction</Button>
                </Box>
            )}

            {txDigest && (
                <Typography>
                    TX Digest: <a href={`https://devnet.suivision.xyz/txblock/${txDigest}`}
                                  target="_blank">{txDigest}</a>
                </Typography>
            )}
        </Paper>
    )
}