---
sourcePath: "packages/cli/src/core/types/parser.types.ts"
---

# ExportDeclaration

 
파일 경로, 심볼 이름, JSDoc 정보를 포함한 메타데이터와 함께 외부 공개된 선언을 나타내요.


## 시그니처

```typescript
type ExportDeclaration = {
  filePath: StandardizedFilePath;
  symbolName: string;
  declaration: ExportedDeclarations;
  kind: DeclarationKind;
  jsDoc: JSDoc;
  signature: string;
};
```

### 속성

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">filePath</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">StandardizedFilePath</span>
    <br/>
    <p class="post-parameters--description">외부 공개된 선언의 표준화된 파일 경로</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">symbolName</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">외부 공개된 선언의 심볼 이름</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">declaration</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">ExportedDeclarations</span>
    <br/>
    <p class="post-parameters--description">TypeScript 선언 객체</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">kind</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">DeclarationKind</span>
    <br/>
    <p class="post-parameters--description">선언의 타입</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">jsDoc</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">JSDoc</span>
    <br/>
    <p class="post-parameters--description">원시 JSDoc 데이터</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">signature</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">TypeScript 시그니처 문자열</p>
  </li>
</ul>
