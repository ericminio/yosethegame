export const pingPassing = (response) => {
  const pong = JSON.stringify({ pong: "hi there!" });
  response.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
    "content-type": "application/json",
    "content-length": pong.length,
  });
  response.end(pong);
};
