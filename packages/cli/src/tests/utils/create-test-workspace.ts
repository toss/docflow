import fs from "fs/promises";
import path from "path";
import { dir as tmpDir } from "tmp-promise";

export interface TestWorkspace {
  root: string;
  cleanup: () => Promise<void>;
  write: (relativePath: string, content: unknown) => Promise<void>;
  read: (relativePath: string) => Promise<string>;
}

export async function createTestWorkspace(): Promise<TestWorkspace> {
  const { path: root, cleanup } = await tmpDir({ unsafeCleanup: true });

  const write = async (filePath: string, content: unknown): Promise<void> => {
    const absPath = path.join(root, filePath);
    await fs.mkdir(path.dirname(absPath), { recursive: true });

    const formatContent = (content: unknown, isJsonFile: boolean) => {
      if (!isJsonFile) return String(content);
      return typeof content === "string"
        ? content
        : JSON.stringify(content, null, 2);
    };

    const isRcFile = /\.?\w*rc$/i.test(filePath);
    const isJsonFile = filePath.endsWith(".json");
    const finalContent = formatContent(content, isJsonFile || isRcFile);

    await fs.writeFile(absPath, finalContent, "utf8");
  };

  const read = async (filePath: string): Promise<string> => {
    const absPath = path.join(root, filePath);
    return fs.readFile(absPath, "utf8");
  };

  return { root, cleanup, write, read };
}
