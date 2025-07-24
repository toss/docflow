---
sourcePath: "packages/cli/src/core/types/parser.types.ts"
---

# TargetWithJSDoc

문서 생성을 위해 파싱된 JSDoc 데이터로, [ExportDeclaration](/ko/reference/cli/Parser/ExportDeclaration)을 확장한 인터페이스에요.

## 시그니처

```typescript
interface TargetWithJSDoc extends ExportDeclaration {
  parsedJSDoc: ParsedJSDoc;
}
```

### 매개변수

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">parsedJSDoc</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">ParsedJSDoc</span>
    <br/>
    <p class="post-parameters--description">Docflow에서 사용하는 JSDoc 템플릿을 파싱한 결과</p>
  </li>
</ul>
