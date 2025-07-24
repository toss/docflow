import { DefaultTheme } from "vitepress";

export function offCollapsed(items: DefaultTheme.SidebarItem[]) {
  return items.map((item) => {
    if (item.text === "cli") {
      return { ...item, collapsed: false };
    }
    return item;
  });
}
