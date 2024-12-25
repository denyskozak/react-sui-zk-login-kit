import React from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google"; // Replace with your icon or SVG
import FacebookIcon from "@mui/icons-material/Facebook"; // Replace with your icon or SVG
import TwitchIcon from "@mui/icons-material/SportsEsports"; // Replace with your icon or SVG
import { useGoogleAuth } from "../../src/hooks/useGoogleAuth"; // Example of your hook
import { SuiClient } from "@mysten/sui/client";
import styled from '@emotion/styled';

// Styled Components
const Container = styled(Box)({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "400px",
    maxHeight: "400px",
    margin: "auto",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
});

const IconContainer = styled(Box)({
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    marginTop: "20px",
});

const MoreOptionsButton = styled(Button)({
    marginTop: "20px",
    backgroundColor: "#f5f5f5",
    color: "#333",
    borderRadius: "8px",
    textTransform: "none",
    padding: "8px 16px",
    "&:hover": {
        backgroundColor: "#e0e0e0",
    },
});

interface GoogleAuthParam {
    redirectURI: string;
    clientId: string;
}


interface ZKLoginProps {
    provider: 'google',
    googleParams: GoogleAuthParam,
    proverProvider: string,
    suiClient: SuiClient,
    title?: string,
}

export const ZkLogin: React.FC<ZKLoginProps> = (props) => {
    const { provider, googleParams, proverProvider, suiClient, title = 'Sign In With Your Preferred Service' } = props;
    const { handleRedirectToGoogle } = useGoogleAuth();

    const handleGoogleLogin = () => {
        handleRedirectToGoogle(googleParams.clientId, googleParams.redirectURI, "your_nonce_here");
    };

    return (
        <Container>
            <Typography variant="h6" style={{ marginBottom: "20px", color: '#000000' }}>
                {title}
            </Typography>
            <IconContainer>
                <IconButton
                    onClick={handleGoogleLogin}
                    style={{
                        backgroundColor: "#f5f5f5",
                        padding: "12px",
                        borderRadius: "8px",
                    }}
                >
                    <GoogleIcon style={{ fontSize: "32px" }} />
                </IconButton>
                <IconButton
                    style={{
                        backgroundColor: "#f5f5f5",
                        padding: "12px",
                        borderRadius: "8px",
                    }}
                >
                    <TwitchIcon style={{ fontSize: "32px" }} />
                </IconButton>
            </IconContainer>
        </Container>
    );
};
