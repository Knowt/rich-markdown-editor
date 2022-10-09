import { parseMarkdown } from "./server";

test("renders an empty doc", () => {
  const ast = parseMarkdown("");

  if ( ast ) {
    expect(ast.toJSON()).toEqual({
      content: [{ type: "paragraph" }],
      type: "doc",
    });
  }
});
