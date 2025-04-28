export const wireEvents = async (document) => {
  document.querySelector("#run").addEventListener("click", () => {
    run(document, challenges);
  });
};
