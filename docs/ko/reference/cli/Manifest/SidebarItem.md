---
sourcePath: "packages/cli/src/commands/build/manifest/manifest.ts"
---

# SidebarItem

 
문서 사이트의 사이드바 내비게이션 항목을 나타내요. 링크이거나 다른 항목들을 포함하는 폴더일 수 있어요.


## 시그니처

```typescript
interface SidebarItem { text: string; link?: string; items?: SidebarItem[]; collapsed?: boolean }
```

### 매개변수

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">text</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">사이드바 항목의 표시 텍스트</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">link</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">항목의 선택적 링크 URL</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">items</span> · <span class="post-parameters--type">SidebarItem[]</span>
    <br/>
    <p class="post-parameters--description">폴더형 항목에 대한 선택적 하위 항목들의 배열</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">collapsed</span> · <span class="post-parameters--type">boolean</span>
    <br/>
    <p class="post-parameters--description">폴더가 기본적으로 접혀있어야 하는지 여부</p>
  </li>
</ul>
