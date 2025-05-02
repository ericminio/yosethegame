export const ping = {
  name: "Ping",
  expectations:
    "Update your server for <code>/ping</code> to answer with json { &quot;pong&quot;: &quot;hi there!&quot; }",
  open: () => true,
  play: async (playerServerUrl) => {
    const response = await fetch(`${playerServerUrl}/ping`);
    const status = response.status;
    const contentType = response.headers.get("content-type");
    const content = await response.text();

    const expected = {
      status: 200,
      contentType: "application/json",
      content: JSON.stringify({ pong: "hi there!" }),
    };
    return status === expected.status &&
      contentType === expected.contentType &&
      content === expected.content
      ? { status: "passed" }
      : {
          status: "failed",
          expected,
          actual: { status, contentType, content },
        };
  },
};
