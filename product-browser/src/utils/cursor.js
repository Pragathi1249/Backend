function encodeCursor(data) {
  return Buffer.from(
    JSON.stringify(data)
  ).toString("base64");
}

function decodeCursor(cursor) {
  try {
    return JSON.parse(
      Buffer.from(cursor, "base64").toString("utf8")
    );
  } catch {
    throw new Error("Invalid cursor");
  }
}

module.exports = {
  encodeCursor,
  decodeCursor,
};