export const isFilter = (arg: any): arg is Filter => {
  return (
    typeof arg === "string" &&
    (arg === "all" ||
      arg === "checked" ||
      arg === "unchecked" ||
      arg === "removed")
  );
};
