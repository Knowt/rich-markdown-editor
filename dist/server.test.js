"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
test("renders an empty doc", () => {
    const ast = server_1.parseMarkdown("");
    expect(ast.toJSON()).toEqual({
        content: [{ type: "paragraph" }],
        type: "doc",
    });
});
//# sourceMappingURL=server.test.js.map