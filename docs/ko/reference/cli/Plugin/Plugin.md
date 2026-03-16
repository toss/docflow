---
sourcePath: "packages/cli/src/plugins/types/plugin.types.ts"
---

# Plugin

 
Docflow 플러그인의 기본 구조를 정의하는 인터페이스에요. 플러그인 이름과 훅 함수들을 포함해요.


## 시그니처

```typescript
interface Plugin { name: string; hooks: {
    transformManifest?: (
      manifest: SidebarItem[],
      context: PluginContext,
    ) => SidebarItem[];
    provideGenerator?: () => MarkdownGenerator;
  } }
```

### 속성

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">name</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">플러그인의 고유 식별자</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">hooks</span><span class="post-parameters--required">Required</span> · <span class="post-parameters--type">object</span>
    <br/>
    <p class="post-parameters--description">플러그인이 구현할 수 있는 훅 함수들이 있는 객체</p>
    <ul class="post-parameters-ul">
  <li class="post-parameters-li ">
    <span class="post-parameters--name">transformManifest</span> · <span class="post-parameters--type">function</span>
    <br/>
    <p class="post-parameters--description">생성된 매니페스트 데이터를 변환하는 훅</p>
  </li>
  <li class="post-parameters-li ">
    <span class="post-parameters--name">provideGenerator</span> · <span class="post-parameters--type">function</span>
    <br/>
    <p class="post-parameters--description">커스텀 Markdown 생성기를 제공하는 훅</p>
  </li>
    </ul>
  </li>
</ul>
