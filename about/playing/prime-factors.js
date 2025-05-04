const decompose = (number) => {
  const factors = [];
  while (number % 2 === 0) {
    factors.push(2);
    number = number / 2;
  }
  return factors;
};

export const primeFactors = (request, response) => {
  const incoming = /primeFactors\?number=(.*)/.exec(request.url)[1];
  let status = 200;
  let answer;
  if (isNaN(incoming)) {
    status = 400;
    answer = JSON.stringify({
      number: incoming,
      error: "not a number",
    });
  } else {
    answer = JSON.stringify({
      number: Number(incoming),
      decomposition: decompose(incoming),
    });
  }

  response.writeHead(status, {
    "Access-Control-Allow-Origin": "*",
    "content-type": "application/json",
    "content-length": answer.length,
  });
  response.end(answer);
};
