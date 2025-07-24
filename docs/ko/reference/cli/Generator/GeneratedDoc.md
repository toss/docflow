---
sourcePath: "packages/cli/src/core/types/generator.types.ts"
---

# GeneratedDoc

 
문서 생성 결과로 파일 경로, 내용, 상대 경로 정보를 포함해요.


## 시그니처

```typescript
interface GeneratedDoc { filePath: StandardizedFilePath; content: string; relativePath: string }
```

### 매개변수

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">filePath</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">StandardizedFilePath</span>
    <br/>
    <p class="post-parameters--description">문서가 저장될 절대 파일 경로</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">content</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">생성된 Markdown 내용</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">relativePath</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">출력 디렉토리로부터의 상대 경로</p>
  </li>
</ul>
