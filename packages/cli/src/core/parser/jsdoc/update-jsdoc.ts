import { Node } from "ts-morph";

export function updateJSDoc(declaration: Node, newJSDoc: string): void {
  const sourceFile = declaration.getSourceFile();

  if (Node.isJSDocable(declaration)) {
    const jsDocs = declaration.getJsDocs();
    jsDocs.forEach((jsDoc) => {
      jsDoc.remove();
    });
  }

  const fullStart = declaration.getFullStart();
  const leadingTriviaWidth = declaration.getLeadingTriviaWidth();
  const actualStart = fullStart + leadingTriviaWidth;

  sourceFile.insertText(actualStart, newJSDoc + "\n");
}
