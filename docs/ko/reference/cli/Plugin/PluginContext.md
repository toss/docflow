---
sourcePath: "packages/cli/src/plugins/types/plugin.types.ts"
---

# PluginContext

 
플러그인 실행 시 전달되는 컨텍스트 정보에요. 워크스페이스 경로와 설정 데이터를 포함해요.


## 시그니처

```typescript
interface PluginContext { workspacePath?: string; config?: Config }
```

### 매개변수

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">workspacePath</span> · <span class="post-parameters--type">string</span>
    <br/>
    <p class="post-parameters--description">워크스페이스 루트 디렉토리의 절대 경로</p>
  </li>
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">config</span> · <span class="post-parameters--type">Config</span>
    <br/>
    <p class="post-parameters--description">프로젝트, 명령어, 플러그인 설정을 포함하는 완전한 설정 객체</p>
  </li>
</ul>
