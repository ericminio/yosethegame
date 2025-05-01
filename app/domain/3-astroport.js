export const astroport = {
  name: "Astroport",
  open: (store) => {
    const helloYoseResult = store.get("Hello Yose");
    const pingResult = store.get("Ping");
    if (helloYoseResult && helloYoseResult.status === "passed") {
      return pingResult && pingResult.status === "passed";
    }
    return false;
  },
  play: async () => ({ status: "failed" }),
};
