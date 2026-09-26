import {cp, mkdir} from "node:fs/promises";

const source = new URL("../src/components/zk-login/logos", import.meta.url);
const destination = new URL("../dist/components/zk-login/logos", import.meta.url);

await mkdir(destination, {recursive: true});
await cp(source, destination, {recursive: true});
