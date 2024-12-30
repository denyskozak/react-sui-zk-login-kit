import { Box } from '@mui/system'
import { useState } from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Button, Paper, Tooltip } from '@mui/material';

const TEXT = "npm i react-sui-zk-login-kit -S";
export const CopyToClipboard = () => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(TEXT);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <Paper sx={{ width: '280px', border: 'solid 1px #000000' }} className="copy-box">
            <Box sx={{p: '6px'}}>
                {copied ? 'Copied!' :TEXT}
            </Box>
            <Tooltip title="Copy to clipboard">
                <Button onClick={handleCopy} sx={{minWidth: '30px', outline: 'none'}}>
                    <ContentCopyIcon sx={{height: '20px', color: '#000000'}}/>
                </Button>
            </Tooltip>
        </Paper>
    );
}
