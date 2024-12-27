interface GoogleParams {
    redirectURI: string;
    clientId: string;
    jwt?: string;
}
interface TwitchParams {
    redirectURI: string;
    clientId: string;
}
type Providers = {
    google?: GoogleParams;
    twitch?: TwitchParams;
};
interface ZKLoginProps {
    providers: Providers;
    proverProvider: string;
    title?: string;
    subTitle?: string;
    userSalt?: string;
    observeTokenInURL?: boolean;
}
export declare const ZkLogin: (props: ZKLoginProps) => import("react/jsx-runtime").JSX.Element;
export {};
