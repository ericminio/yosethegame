export const buildUrl = (segments) => {
  return segments
    .map((s) => s.replace(/\/*$/, ""))
    .map((s) => s.replace(/^\/*/, ""))
    .join("/");
};
