# 프로젝트 설정

## 기본 설정

프로젝트 루트에 `docflow.config.js` 파일을 생성해요. 아래는 설정 파일의 예시예요.

:::warning 설정 파일은 프로젝트에 맞게 조정해 주세요
설정 파일은 프로젝트에 맞게 조정해야 해요. 아래 예시는 기본적인 설정을 보여주는 것이에요.
:::

```js
/** @type {import('docflow').Config} */
export default {
  project: {
    root: process.cwd(), // 프로젝트 루트 디렉토리
    packageManager: "yarn", // 패키지 매니저: 'npm' | 'yarn' | 'pnpm'
    workspace: {
      include: ["packages/*"], // 포함할 워크스페이스 패턴
      exclude: ["packages/internal-*"], // 제외할 워크스페이스 패턴
    },
  },
  commands: {
    build: {
      // 문서 빌드 설정
      outputDir: "docs/references", // 문서 출력 디렉토리
      manifest: {
        enabled: true, // 매니페스트 파일 생성 여부
        prefix: "docs/references", // 매니페스트 경로 접두사
      },
      generator: {
        name: "vitepress", // 문서 생성기 종류
        signatureLanguage: "typescript", // 시그니처 언어
      },
    },
    check: {
      // 문서 검증 설정
      entryPoints: ["packages/core/src/index.ts"], // 엔트리 포인트 (자동 감지 가능)
    },
    generate: {
      jsdoc: {
        fetcher: async ({ signature, prompt }) => {
          // OpenAI, Claude 등 AI 서비스 호출
          const response = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: "gpt-4",
                messages: [
                  { role: "system", content: prompt },
                  { role: "user", content: signature },
                ],
              }),
            }
          );
          const data = await response.json();
          return data.choices[0].message.content;
        },
      },
    },
  },
};
```

Docflow의 설정은 명령어마다 구체적으로 구성할 수 있어요. 각 설정 항목에 대해 자세히 알아볼게요.

## project 설정

### `project.root` (필수)

프로젝트의 루트 디렉토리를 설정해요. 문서에서 모든 상대 경로의 기준점이 됩니다.

```js
{
  project: {
    root: process.cwd() // 현재 디렉토리
  }
}
```

### `project.packageManager` (필수)

프로젝트에서 사용하는 패키지 매니저를 지정해요. 패키지 매니저마다 워크스페이스를 감지하는 방법이 달라지기 때문이에요. 자세한 내부 동작은 아래 표에서 확인하세요.

```js
{
  project: {
    packageManager: "yarn" // "yarn" | "pnpm" | "npm"
  }
}
```

**내부 동작:**

Docflow는 각 패키지 매니저별로 다른 명령어를 사용해서 워크스페이스 정보를 수집하고, 모든 결과를 `[{name, location}]` 형태의 배열로 변환해요. `name`은 패키지 이름, `location`은 상대 경로예요.

| 패키지 매니저 | 명령어                           | 결과                                    |
| ------------- | -------------------------------- | --------------------------------------- |
| yarn          | `yarn workspaces list --json`    | `Array<{name, location}>`               |
| pnpm          | `pnpm list -r --depth=-1 --json` | `Array<{name, version, path, ...}`>     |
| npm           | `npm ls --json`                  | `Array<{name, version, location, ...}>` |

### `project.workspace`

워크스페이스에서 어떤 패키지를 포함하고 제외할지 결정해요. glob 패턴을 사용해서 지정할 수 있어요. 아래처럼, **packages/internal-** 패턴을 제외하면, `packages/internal-utils` 같은 내부 패키지는 문서 생성에서 제외돼요.

```js
project: {
  workspace: {
    include: ["packages/*", "apps/*"], // 포함할 패턴
    exclude: ["packages/internal-*"]   // 제외할 패턴
  }
}
// 다음과 같이 필터링:
// ✅ packages/core -> 포함
// ✅ packages/ui -> 포함
// ❌ packages/internal-utils -> 제외
// ❌ apps/web -> 제외 (include에 없음)
```

## commands.build 설정

`docflow build` 명령어가 실행될 때 사용되는 설정들이에요. 문서가 어디에 생성될지, 어떤 형식으로 출력될지, 매니페스트 파일을 만들지 등을 결정할 수 있어요. build 명령어의 자세한 사용법은 [build 명령어 문서](/ko/command/build)를 참고하세요.

### `outputDir`

생성된 문서를 저장할 디렉토리예요. 모든 Markdown 파일이 이 디렉토리에 저장되고, 패키지별로 서브디렉토리가 생성돼요.

```js
{
  commands: {
    build: {
      outputDir: "docs/references" // 기본값
    }
  }
}
```

위와 같이 설정했을 때 core, ui 하위 문서들은 다음과 같이 서브디렉토리로 생성돼요.

```txt
docs/
└── references/
    ├── core/
    │   ├── index.md
    │   └── utils.md
    └── ui/
        ├── button.md
        └── input.md
```

### `manifest`

매니페스트 파일은 문서 빌드 시 자동으로 생성되는 파일로, VitePress 사이드바 형식의 네비게이션 구조를 포함해요. `docs/en/reference/manifest.json`과 같이 생성되며, VitePress 설정에서 `items: koReferenceManifest`처럼 직접 사용할 수 있어요.

```js
{
  commands: {
    build: {
      manifest: {
        enabled: true,
        prefix: "ko/reference",
        path: "docs/references"
      }
    }
  }
}
```

`enabled`를 `true`로 설정하면 `docs/references/manifest.json` 파일이 생성돼요. `prefix`는 매니페스트 안에 링크를 생성할 때 사용하는 경로 접두사로, 위 설정에서는 `/docs/references/core/index.md` 같은 링크가 생성돼요. `path`는 매니페스트 파일이 저장될 위치이며, 기본적으로 `outputDir`과 동일한 값이 사용돼요.

**생성되는 매니페스트 예시**

```json
[
  {
    "text": "cli", // 최상위 카테고리
    "collapsed": true,
    "items": [
      {
        "text": "Configuration", // 하위 카테고리
        "collapsed": true,
        "items": [
          {
            "text": "Config", // 문서 제목
            "link": "/ko/reference/cli/Configuration/Config.md" // VitePress 링크
          }
        ]
      },
      {
        "text": "Generator",
        "collapsed": true,
        "items": [
          {
            "text": "MarkdownDocument",
            "link": "/ko/reference/cli/Generator/MarkdownDocument.md"
          },
          {
            "text": "MarkdownGenerator",
            "link": "/ko/reference/cli/Generator/MarkdownGenerator.md"
          }
        ]
      }
    ]
  }
]
```

### `generator` 설정

문서 생성 방식을 제어해요. 기본적으로 VitePress에서 동작할 수 있는 Markdown 문서를 생성해요. 플러그인을 통해서 다른 형식으로도 생성할 수 있어요.

```js
{
  commands: {
    build: {
      generator: {
        name: "vitepress",                // 필수: 제너레이터 이름
        signatureLanguage: "typescript",  // 기본값: "typescript"
        labels: {                         // label 커스터마이징
          typedef: "타입 정의"
          signature: "시그니처",
          parameters: "파라미터",
          returns: "반환값",
          throws: "예외",
          examples: "예제",
          see: "참고",
          version: "버전",
          deprecated: "사용 중단",
        }
      }
    }
  }
}
```

`name`은 어떤 제너레이터를 사용할지 결정해요 (내장 "VitePress" 또는 플러그인 이름). `signatureLanguage`는 코드 블록의 언어 하이라이팅에 사용돼요.

`labels`는 생성된 문서의 섹션 헤더를 커스터마이징할 수 있어요. 각 라벨의 기본값과 문서에 반영되는 예시는 다음과 같아요:

```markdown
## 시그니처 (signature)

### 파라미터 (parameters)

### 반환값 (returns)

### 예외 (throws)

### 예제 (examples)

### 참고 (see)

### 버전 (version)

### 사용 중단 (deprecated)
```

## commands.check 설정

### `entryPoints`

문서 검증을 수행할 엔트리 포인트를 지정해요.

```js
{
  commands: {
    check: {
      entryPoints: ["src/index.ts", "src/api.ts"] // 선택사항
    }
  }
}
```

설정하지 않으면 `package.json`의 `main` 또는 `exports` 필드에서 자동으로 감지해요. 둘 다 없으면 `["index.ts"]`를 기본값으로 사용해요. 이 명령어는 public export이지만 `@public` 태그가 없는 컴포넌트들을 찾아서 알려줘요.

## commands.generate 설정

### `jsdoc` 설정

generate 명령어는 `@generate` 태그가 있는 함수에 대해 AI를 활용해 JSDoc 주석을 자동으로 생성하고 업데이트해요. `fetcher` 함수가 AI 서비스를 호출하여 함수의 TypeScript 시그니처와 프롬프트를 기반으로 JSDoc을 생성해요.

```js
{
  commands: {
    generate: {
      jsdoc: {
        fetcher: async ({ signature, prompt }) => {
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: 'gpt-4',
              messages: [
                { role: 'system', content: prompt },
                { role: 'user', content: signature }
              ]
            })
          });
          const data = await response.json();
          return data.choices[0].message.content;
        },
        prompt: "커스텀 프롬프트..." // 선택사항
      }
    }
  }
}
```

`prompt`를 별도로 설정하지 않으면 기본 JSDoc 생성 가이드가 사용돼요.

## plugins 설정

문서 생성 방식을 커스터마이징하거나 새로운 출력 형식을 추가할 수 있는 플러그인을 설정해요. 예를 들어 VitePress 대신 Nextra나 Docusaurus용 문서를 생성하거나, 생성된 매니페스트 구조를 변경할 수 있어요.

```js
{
  plugins: [
    {
      name: "custom-generator",
      plugin: (options) => ({
        hooks: {
          transformManifest: (manifest) => {
            return modifiedManifest;
          },
          provideGenerator: (name) => {
            if (name === "custom-generator") {
              return new CustomGenerator();
            }
          },
        },
      }),
    },
  ]
}
```

플러그인은 `hooks` 객체를 반환해야 해요. 현재 지원되는 훅은 `transformManifest`와 `provideGenerator`가 있으며, 빌드 과정에서 자동으로 호출돼요.
