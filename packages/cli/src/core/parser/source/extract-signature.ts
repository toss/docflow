import {
  Node,
  InterfaceDeclaration,
  ClassDeclaration,
  VariableDeclaration,
  FunctionDeclaration,
  TypeAliasDeclaration,
  EnumDeclaration,
} from "ts-morph";

export function extractSignature(declaration: Node): string | undefined {
  if (Node.isFunctionDeclaration(declaration)) {
    return formatFunctionSignature(declaration);
  }

  if (Node.isVariableDeclaration(declaration)) {
    const initializer = declaration.getInitializer();
    if (initializer && Node.isArrowFunction(initializer)) {
      return formatArrowFunctionSignature(declaration);
    }
    return formatVariableSignature(declaration);
  }

  if (Node.isClassDeclaration(declaration)) {
    return formatClassSignature(declaration);
  }

  if (Node.isInterfaceDeclaration(declaration)) {
    return formatInterfaceSignature(declaration);
  }

  if (Node.isTypeAliasDeclaration(declaration)) {
    return formatTypeAliasSignature(declaration);
  }

  if (Node.isEnumDeclaration(declaration)) {
    return formatEnumSignature(declaration);
  }

  return undefined;
}

// function {name}<{generics}>({parameters}): {returnType};
function formatFunctionSignature(node: FunctionDeclaration): string {
  const name = node.getName() ?? "anonymous";
  const typeParams = node
    .getTypeParameters()
    .map((tp) => tp.getText())
    .join(", ");
  const params = node
    .getParameters()
    .map((p) => p.getText())
    .join(", ");
  const returnType = node.getReturnType().getText();

  return `function ${name}${
    typeParams ? `<${typeParams}>` : ""
  }(${params}): ${returnType};`;
}

// {let|const|var} {name}: <{generics}>({parameters}) => {returnType};
function formatArrowFunctionSignature(node: VariableDeclaration): string {
  const initializer = node.getInitializer();
  if (!initializer || !Node.isArrowFunction(initializer)) {
    return "";
  }

  const name = node.getName();
  const variableStatement = node.getVariableStatement();
  const declarationKind = variableStatement?.getDeclarationKind() ?? "const";

  const typeParams = initializer
    .getTypeParameters()
    .map((tp) => tp.getText())
    .join(", ");
  const params = initializer
    .getParameters()
    .map((p) => p.getText())
    .join(", ");
  const returnType = initializer.getReturnType().getText();

  return `${declarationKind} ${name}: ${
    typeParams ? `<${typeParams}>` : ""
  }(${params}) => ${returnType};`;
}

// {let|const|var} {name}: {type};
function formatVariableSignature(node: VariableDeclaration): string {
  const name = node.getName();
  const variableStatement = node.getVariableStatement();
  const declarationKind = variableStatement?.getDeclarationKind() ?? "const";
  const type = node.getType().getText();

  return `${declarationKind} ${name}: ${type};`;
}

// {abstract?} class {name}<{generics}> {extends ...}? {implements ...}?;
function formatClassSignature(node: ClassDeclaration): string {
  const name = node.getName() ?? "AnonymousClass";
  const isAbstract = node.isAbstract() ? "abstract " : "";
  const typeParams = node
    .getTypeParameters()
    .map((tp) => tp.getText())
    .join(", ");

  const extendsExpr = node.getExtends();
  const extendsText = extendsExpr ? ` extends ${extendsExpr.getText()}` : "";

  const implementsExprs = node.getImplements();
  const implementsText =
    implementsExprs.length > 0
      ? ` implements ${implementsExprs.map((i) => i.getText()).join(", ")}`
      : "";

  return `${isAbstract}class ${name}${
    typeParams ? `<${typeParams}>` : ""
  }${extendsText}${implementsText};`;
}

// interface {name}<{generics}> {extends ...}? { {members} }
function formatInterfaceSignature(node: InterfaceDeclaration): string {
  const name = node.getName();
  const typeParams = node
    .getTypeParameters()
    .map((tp) => tp.getText())
    .join(", ");

  const extendsExprs = node.getExtends();
  const extendsText =
    extendsExprs.length > 0
      ? ` extends ${extendsExprs.map((e) => e.getText()).join(", ")}`
      : "";

  const members = node
    .getMembers()
    .map((member) => {
      const text = member.getText().trim();
      return text.endsWith(";") ? text.slice(0, -1) : text;
    })
    .join("; ");

  return `interface ${name}${
    typeParams ? `<${typeParams}>` : ""
  }${extendsText} { ${members} }`;
}

// type {name}<{generics}> = {definition};
function formatTypeAliasSignature(node: TypeAliasDeclaration): string {
  const name = node.getName();
  const typeParams = node
    .getTypeParameters()
    .map((tp) => tp.getText())
    .join(", ");
  const type = node.getTypeNode()?.getText() ?? "unknown";

  return `type ${name}${typeParams ? `<${typeParams}>` : ""} = ${type};`;
}

// {const?} enum {name} { {members} }
function formatEnumSignature(node: EnumDeclaration): string {
  const name = node.getName();
  const isConst = node.isConstEnum() ? "const " : "";

  const members = node
    .getMembers()
    .map((member) => {
      const memberName = member.getName();
      const value = member.getValue();
      if (value !== undefined) {
        return `${memberName} = ${
          typeof value === "string" ? `"${value}"` : value
        }`;
      }
      return memberName;
    })
    .join(", ");

  return `${isConst}enum ${name} { ${members} }`;
}
