export const ping = {
  name: "Ping",
  open: true,
  play: async (playerServerUrl) => {
    const response = await fetch(`${playerServerUrl}/ping`);
    const status = response.status;
    const contentType = response.headers.get("content-type");
    const content = await response.text();

    return status === 200 &&
      contentType === "application/json" &&
      JSON.stringify({ alive: true }) === content
      ? "passed"
      : "failed";
  },
};
