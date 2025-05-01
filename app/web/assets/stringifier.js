export const stringify = (o) => {
  if (typeof o === "string") return `"${o}"`;
  if (typeof o === "number") return String(o);
  if (typeof o === "boolean") return String(o);
  if (typeof o === "function") return o.toString();
  if (Array.isArray(o)) return `[${o.map((i) => stringify(i)).join(",")}]`;

  const keys = Object.keys(o);
  const codes = keys.map((key) => key + ":" + stringify(o[key]));

  return `{${codes.join(",")}}`;
};
