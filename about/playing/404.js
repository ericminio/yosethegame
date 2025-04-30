export const failingWith404 = (response) => {
  const text = "NOT FOUND";
  response.writeHead(404, {
    "Access-Control-Allow-Origin": "*",
    "content-type": "text/plain",
    "content-length": text.length,
  });
  response.end(text);
};
