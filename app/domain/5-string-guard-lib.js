export const stringGuardChooser = {
  getString: () => {
    const strings = [
      "yolo",
      "hello",
      "world",
      "geek",
      "javascript",
      "prime",
      "factors",
      "optimus",
      "batman",
      "surfer",
    ];
    const index = Math.floor(Math.random() * strings.length);
    return strings[index];
  },
};
