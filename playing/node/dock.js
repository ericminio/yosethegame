const payload = (incoming) => {
  return new Promise((resolve, reject) => {
    let body = "";
    incoming.on("data", (chunk) => {
      body += chunk;
    });
    incoming.on("end", () => {
      resolve(body);
    });
    incoming.on("error", reject);
  });
};

export const dock = async (docks, request, response) => {
  const body = await payload(request);
  const shipName = JSON.parse(body).shipName;
  const answer = `keeping ${shipName} in dock`;
  docks[1] = shipName;
  response.writeHead(201, {
    "Access-Control-Allow-Origin": "*",
    "content-type": "text/plain",
    "content-length": answer.length,
  });
  response.end(answer);
};
