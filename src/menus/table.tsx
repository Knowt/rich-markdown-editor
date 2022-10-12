import {   
  TrashIcon,
  InsertLeftIcon,
  InsertRightIcon,
  InsertAboveIcon, 
  InsertBelowIcon,
} from "outline-icons";
import { MenuItem } from "../types";
import baseDictionary from "../dictionary";


interface TableMenuItemsInput {
  rowIndex: number;
  rtl: boolean;
}

export default function tableMenuItems(
  dictionary: typeof baseDictionary,
  tableIndexes: TableMenuItemsInput,
): MenuItem[] {
  const { rowIndex, rtl } = tableIndexes;

  return [
    {
      name: "deleteTable",
      tooltip: dictionary.deleteTable,
      icon: TrashIcon,
      active: () => false,
    },
    {
      name: "separator",
    },
    {
      name: "addRowBefore",
      tooltip: dictionary.addRowBefore,
      icon: InsertAboveIcon,
      attrs: { index: ( rowIndex as number ) - 1 },
      active: () => false,
    },
    {
      name: "addRowAfter",
      tooltip: dictionary.addRowAfter,
      icon: InsertBelowIcon,
      attrs: { index: ( rowIndex as number ) },
      active: () => false,
    },
    {
      name: "separator",
    },
    {
      name: rtl ? "addColumnAfter" : "addColumnBefore",
      tooltip: rtl ? dictionary.addColumnAfter : dictionary.addColumnBefore,
      icon: InsertLeftIcon,
      active: () => false,
    },
    {
      name: rtl ? "addColumnBefore" : "addColumnAfter",
      tooltip: rtl ? dictionary.addColumnBefore : dictionary.addColumnAfter,
      icon: InsertRightIcon,
      active: () => false,
    },
  ];
}
