export const helloYose = {
  name: "Hello Yose",
  expectations:
    "Update your server for <code>/</code> to answer with a page containing &quot;Hello Yose&quot;",
  open: () => true,
  hidden: () => false,
  play: async (playerServerUrl) => {
    const response = await fetch(playerServerUrl);
    const status = response.status;
    const contentType = response.headers.get("content-type");
    const content = await response.text();

    const expected = {
      status: 200,
      contentType: "text/html",
      content: 'A web page containing text "Hello Yose"',
    };
    return status === expected.status &&
      contentType === expected.contentType &&
      content.indexOf("Hello Yose") !== -1
      ? { status: "passed" }
      : {
          status: "failed",
          expected,
          actual: { status, contentType, content },
        };
  },
};
