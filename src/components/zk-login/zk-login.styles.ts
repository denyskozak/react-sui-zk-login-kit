import styled from "@emotion/styled";

export const Container = styled.div({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "200px",
    maxWidth: "320px",
    maxHeight: "320px",
    margin: "auto",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
});

export const Typography = styled.span`
    color: #000000;
    width: 100%;
    padding: 0;
    margin: 5px 0;
`;

export const Code = styled.code`
    color: #000000;
    width: 100%;
    padding: 0;
    margin: 5px 0;
    font-size: 10px;
    word-wrap: break-word;
`;

export const IconContainer = styled.div({
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

export const Button = styled.button({
    marginTop: "20px",
    backgroundColor: "#f5f5f5",
    color: "#333",
    borderRadius: "8px",
    textTransform: "none",
    padding: "8px 16px",
    "&:hover": {
        backgroundColor: "#e0e0e0",
        borderColor: "#1a1a1a"
    },
});