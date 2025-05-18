export const getDocks = async (docks, request, response) => {
  const answer = JSON.stringify({ docks });
  response.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
    "content-type": "application/json",
    "content-length": answer.length,
  });
  response.end(answer);
};
