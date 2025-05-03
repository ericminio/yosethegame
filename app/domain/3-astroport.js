export const astroport = {
  name: "Astroport",
  expectations: "Update your server for ... (coming soon)",
  open: (store) => {
    const helloYoseResult = store.get("Hello Yose");
    const pingResult = store.get("Ping");
    if (helloYoseResult && helloYoseResult.status === "passed") {
      return pingResult && pingResult.status === "passed";
    }
    return false;
  },
  hidden: () => false,
  play: async () => ({ status: "failed" }),
};
