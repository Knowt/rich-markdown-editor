import Node from "./Node";
import tablesRule from "../rules/tables";
export default class Table extends Node {
    get name(): string;
    get schema(): {
        content: string;
        tableRole: string;
        isolating: boolean;
        group: string;
        parseDOM: {
            tag: string;
        }[];
        toDOM(): (string | {
            class: string;
        } | (string | {
            class: string;
        } | (string | (string | number)[] | {
            class: string;
        })[])[])[];
    };
    get rulePlugins(): (typeof tablesRule)[];
    commands({ schema }: {
        schema: any;
    }): {
        createTable: ({ rowsCount, colsCount }: {
            rowsCount: any;
            colsCount: any;
        }) => (state: any, dispatch: any) => void;
        setColumnAttr: ({ index, alignment }: {
            index: any;
            alignment: any;
        }) => (state: any, dispatch: any) => void;
        addColumnBefore: () => any;
        addColumnAfter: () => any;
        deleteColumn: () => any;
        addRowAfter: ({ index }: {
            index: any;
        }) => (state: any, dispatch: any) => void;
        deleteRow: () => any;
        deleteTable: () => any;
        toggleHeaderColumn: () => any;
        toggleHeaderRow: () => any;
        toggleHeaderCell: () => any;
        setCellAttr: () => any;
        fixTables: () => any;
    };
    keys(): {
        Tab: any;
        "Shift-Tab": any;
        Enter: (state: any, dispatch: any) => boolean;
    };
    toMarkdown(state: any, node: any): void;
    parseMarkdown(): {
        block: string;
    };
    get plugins(): any[];
}
//# sourceMappingURL=Table.d.ts.map