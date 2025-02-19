export default function parseValidationErrors(errors) {
  if (!errors || typeof errors !== "object") {
    return []; // Return an empty array if errors are undefined/null
  }

  return Object.keys(errors).map((key) => ({
    field: key,
    message: errors[key]?.message || "Invalid input",
  }));
}
