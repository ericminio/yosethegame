import fs from "fs";

export const astroport = (_, response) => {
  const html = fs
    .readFileSync(new URL("./astroport.html", import.meta.url), "utf-8")
    .toString();
  response.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
    "content-type": "text/html",
    "content-length": html.length,
  });
  response.end(html);
};
