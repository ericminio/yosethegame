export const helloYose = {
  name: "Hello Yose",
  open: true,
  play: async (playerServerUrl) => {
    const response = await fetch(playerServerUrl);
    const status = response.status;
    const contentType = response.headers.get("content-type");
    const content = await response.text();

    return status === 200 &&
      contentType === "text/html" &&
      content.indexOf("Hello Yose") !== -1
      ? "passed"
      : "failed";
  },
};
