import { MenuItem } from "../types";

interface Input {
  item: MenuItem;
  commands: Record<string, any>;
}
/**
 * Handles default click on mark items in toolbar menu
 */
export const defaultMarkClick = (input: Input) => {
  const { item, commands } = input;
  console.log("ITEM", item, commands, input);
  if (item.customOnClick) {
    return item.customOnClick();
  }

  if (!item.name) return;
  commands[item.name](item.attrs);
};
