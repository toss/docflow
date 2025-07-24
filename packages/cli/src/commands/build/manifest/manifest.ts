import { PluginManager } from "../../../plugins/plugin-manager.js";

interface ManifestOptions {
  prefix?: string;
  pluginManager?: PluginManager;
}

/**
 * @public
 * @kind interface
 * @category Manifest
 * @name SidebarItem
 * @description
 * Represents a sidebar navigation item for the documentation site. Can be a link or a folder containing other items.
 * 
 * @param {string} text Display text for the sidebar item
 * @param {string} [link] Optional link URL for the item
 * @param {SidebarItem[]} [items] Optional array of sub-items for folder-type items
 * @param {boolean} [collapsed] Whether the folder should be collapsed by default
 */
export interface SidebarItem {
  text: string;
  link?: string;
  items?: SidebarItem[];
  collapsed?: boolean;
}

export class Manifest {
  private prefix: string;
  private paths: string[] = [];
  private pluginManager?: PluginManager;

  constructor({ prefix = "references", pluginManager }: ManifestOptions = {}) {
    this.prefix = prefix;
    this.pluginManager = pluginManager;
  }

  add(path: string): Manifest {
    this.paths.push(path);
    return this;
  }

  isEmpty(): boolean {
    return this.paths.length === 0;
  }

  toString() {
    const items = this.toSidebarItems();
    return JSON.stringify(items, null, 2);
  }

  toSidebarItems(): SidebarItem[] {
    const sorted = [...this.paths].sort();
    const result: SidebarItem[] = [];

    for (const path of sorted) {
      const parts = path.split("/");
      const fileName = parts.pop()!;

      let current = result;
      for (const folderName of parts) {
        let folder = current.find(
          (item) => item.text === folderName && !item.link,
        );

        if (!folder) {
          folder = {
            text: folderName,
            collapsed: true,
            items: [],
          };
          current.push(folder);
        }

        current = folder.items!;
      }

      current.push({
        text: fileName.replace(/\.(md|mdx)$/, ""),
        link: `${this.prefix}/${path}`,
      });
    }

    if (this.pluginManager) {
      return this.pluginManager.transformManifest(result);
    }

    return result;
  }
}
