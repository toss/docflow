---
sourcePath: "packages/cli/src/core/types/parser.types.ts"
---

# TargetWithJSDoc

 
문서 생성을 위한 파싱된 JSDoc 데이터로, [ExportDeclaration](/ko/reference/cli/Parser/ExportDeclaration) 인터페이스를 확장해요.


## 시그니처

```typescript
interface TargetWithJSDoc extends ExportDeclaration {
  parsedJSDoc: ParsedJSDoc;
}
```

### 속성

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">parsedJSDoc</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">ParsedJSDoc</span>
    <br/>
    <p class="post-parameters--description">Docflow에서 사용하는 JSDoc 템플릿의 파싱 결과</p>
  </li>
</ul>
