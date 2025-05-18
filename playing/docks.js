export const getDocks = async (docks, _, response) => {
  const docksAsArray = Object.keys(docks).reduce((acc, key) => {
    acc.push({ gate: key, shipName: docks[key] });
    return acc;
  }, []);
  const answer = JSON.stringify({ docks: docksAsArray });
  response.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
    "content-type": "application/json",
    "content-length": answer.length,
  });
  response.end(answer);
};
