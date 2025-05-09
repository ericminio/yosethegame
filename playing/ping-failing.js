export const pingFailing = (response) => {
  const pong = JSON.stringify({ random: "not expected" });
  response.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
    "content-type": "application/json",
    "content-length": pong.length,
  });
  response.end(pong);
};
