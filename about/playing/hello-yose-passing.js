export const helloYosePassing = (response) => {
  const html = "<html><body>Hello Yose</body></html>";
  response.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
    "content-type": "text/html",
    "content-length": html.length,
  });
  response.end(html);
};
