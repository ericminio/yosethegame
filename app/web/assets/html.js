import fs from "fs";

export const html = fs
  .readFileSync(new URL("../index.html", import.meta.url))
  .toString();
