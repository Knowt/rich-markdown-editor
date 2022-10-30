import { parseMarkdown } from "./server";

test("renders an empty doc", () => {
  const ast = parseMarkdown("");

  expect(ast.toJSON()).toEqual({
    content: [{ type: "paragraph" }],
    type: "doc",
  });
});
