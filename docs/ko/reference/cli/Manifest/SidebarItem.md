---
sourcePath: "packages/cli/src/commands/build/manifest/manifest.ts"
---

# SidebarItem

 
문서 사이트의 사이드바 네비게이션 항목을 나타내요. 링크 또는 다른 항목을 포함하는 폴더가 될 수 있어요.


## 시그니처

```typescript
interface SidebarItem {
  text: string;
  link?: string;
  items?: SidebarItem[];
  collapsed?: boolean;
}
```

### 속성

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">text</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">사이드바 항목의 표시 텍스트</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">link</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">항목의 링크 URL (선택)</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">items</span> · <span class="post-parameters--type">SidebarItem[]</span>
    <br/>
    <p class="post-parameters--description">폴더 타입 항목의 하위 항목 배열 (선택)</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">collapsed</span> · <span class="post-parameters--type">boolean</span>
    <br/>
    <p class="post-parameters--description">폴더의 기본 접힘 여부</p>
  </li>
</ul>
