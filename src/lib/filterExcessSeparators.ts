import { EmbedDescriptor, MenuItem } from "../types";

export default function filterExcessSeparators(
  items: (MenuItem | EmbedDescriptor)[]
): (MenuItem | EmbedDescriptor)[] {
  return items.reduce((acc, item, index) => {
    // trim separators from start / end
    if (item.name === "separator" && index === 0) return acc;
    if (item.name === "separator" && index === items.length - 1) return acc;
    
    const next = items[index + 1];
    if (next && next.name === "separator" && item.name === "separator")
      return acc;

    // otherwise, continue
    return [...acc, item];
  }, []);
}
