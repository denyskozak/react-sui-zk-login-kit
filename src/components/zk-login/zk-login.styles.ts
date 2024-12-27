import styled from "@emotion/styled";
import {Box, Button} from "@mui/material";

export const Container = styled(Box)({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "400px",
    maxHeight: "400px",
    margin: "auto",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
});

export const Typography = styled.span`
    color: #000000;
    width: 100%;
    padding: 0;
    margin: 0;
`;

export const IconContainer = styled(Box)({
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    marginTop: "16px",
});

export const Icon = styled.button`
    width: 56px;
    height: 56px;
    background-color: #f5f5f5;
    border-radius: 8px;
    display: flex;
    padding: 0;

    &:hover {
        border-color: #1a1a1a;
    }
`;

export const IconImg = styled.img({
    width: 40, height: 40, margin: "auto",
});

export const TwitchIconImg = styled.img({
    width: 25, height: 25, margin: "auto",
});

export const MoreOptionsButton = styled(Button)({
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