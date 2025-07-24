# 시작하기

Docflow의 [핵심 개념](/ko/core-concept)을 이해하고 [설치](/ko/installation)와 [설정](/ko/config)이 완료되었다면, 이제 실제로 Docflow를 프로젝트에 추가하고 문서를 만드는 방법을 익혀볼게요.

## 1단계: 문서 사이트 설정

먼저 docs 폴더가 프로젝트 루트에 있는지 확인하세요. 이 폴더는 [레퍼런스 문서](/ko/core-concept#레퍼런스-문서)를 저장하는 곳이에요. 만일 docs 폴더가 없다면 문서화 프레임워크를 설치하고 설정해야 해요.

이 튜토리얼에서는 VitePress를 기준으로 설정하는 방법을 설명할게요.

### VitePress 초기화

아래 명령어를 실행하면 VitePress가 필요한 파일과 폴더를 자동으로 생성해요.

```bash
npx vitepress init
```

이제 아래의 프롬프트가 나타날 거예요. 각 항목에 맞게 입력해 주세요.

```bash
┌  Welcome to VitePress!
│
◇  Where should VitePress initialize the config?
│  ./docs // docs와 같이 폴더명을 정해주세요
│
◇  Site title:
│  my-library // 문서 사이트의 제목을 입력해주세요
│
◇  Site description:
│  This this is my-library // 문서 사이트의 설명을 자유롭게 입력해주세요
│
◇  Theme:
│  Default Theme // 테마를 자유롭게 선택해주세요
│
◇  Use TypeScript for config and theme files?
│  Yes // TypeScript를 사용할지 여부를 선택해주세요
│
◇  Add VitePress npm scripts to package.json?
│  Yes // package.json에 VitePress 관련 스크립트를 추가할지 여부를 선택해주세요
│
└  Done! Now run npm run docs:dev and start writing.

Tips:
- Make sure to add  docs/.vitepress/dist and  docs/.vitepress/cache to your .gitignore file.
```

## 2단계: 문서화할 함수 준비하기

문서 설정을 마쳤다면, 다음과 같이 구조를 만들고 문서화할 함수를 만들어 볼게요.

```txt
packages
├── core
│   └── index.ts
└── math
    └── index.ts
```

먼저 새로운 함수들을 파일에 추가해보세요.

```typescript
// packages/core/src/index.ts
export function fetchData(url: string): Promise<any> {
  return fetch(url).then((response) => response.json());
}

// packages/math/src/index.ts
export function calculateArea(radius: number): number {
  return Math.PI * radius * radius;
}
```

## 3단계: JSDoc 자동 생성

이제 함수들에 `@generate` 태그를 추가해서 AI가 자동으로 JSDoc을 생성하도록 해보세요.

```typescript
// packages/core/src/index.ts
/**
 * @generate
 */
export function fetchData(url: string): Promise<any> {
  return fetch(url).then((response) => response.json());
}

// packages/math/src/index.ts
/**
 * @generate
 */
export function calculateArea(radius: number): number {
  return Math.PI * radius * radius;
}
```

이제 `npx docflow generate` 명령어를 실행해보세요. 명령어가 실행되면 다음과 같은 프롬프트가 나와요. "All targets"를 선택해주세요.

```bash
npx docflow generate
  - @libs/root (.)
  - core (packages/core)
  - internal (packages/internal)
  - math (packages/math)
📝 core processing...
📝 math processing...
? Select targets for JSDoc generation: …
❯ All targets
  1. core (core)
  2. calculateArea (math)
✔ Select targets for JSDoc generation: · All targets
✅ /packages/core/index.ts core updated
✅ /packages/math/index.ts math updated
✅ generate done
```

여기까지 잘 진행됐다면, `packages/core/src/index.ts`와 `packages/math/src/index.ts` 파일에 다음과 같이 JSDoc 주석이 자동으로 추가되어 있을 거예요. 한 번 파일을 확인해 보세요.

````typescript
/**
 * @public
 * @kind function
 * @category index
 * @name core
 * @signature
 * ```typescript
 * function core(): string;
 * ```
 *
 * @description
 * 핵심 기능을 수행하는 함수예요. 이 함수는 시스템의 핵심 로직을 실행하고, 결과를 문자열로 반환해요.
 * 이 함수를 사용하면 시스템의 주요 기능을 쉽게 사용할 수 있어요.
 *
 * @returns {string} 시스템의 핵심 로직을 실행한 결과를 문자열로 반환해요.
 *
 * @example
 * ```typescript
 * import { core } from '@libs/core';
 *
 * const result = core();
 * console.log(result);
 * ```
 *
 * @version [1.0.0] 초기 버전
 * - 시스템의 핵심 기능을 구현했어요.
 */
export function core() {
  return "core";
}

// src/utils/math.ts
/**
 * @public
 * @kind function
 * @category index
 *
 * @name calculateArea
 * @signature
 * ```typescript
 * function calculateArea(radius: number): number;
 * ```
 *
 * @description
 * 주어진 반지름을 사용해서 원의 면적을 계산해요. 반지름을 입력하면 원의 면적을 반환하는 간단한 함수예요.
 *
 * @param {number} radius 원의 반지름으로, 단위는 픽셀이에요. 반지름은 양수여야 해요.
 * @returns {number} 원의 면적을 반환해요. 반지름이 0보다 작거나 같은 경우, 0을 반환해요.
 *
 * @example
 * ```typescript
 * import { calculateArea } from '@libs/math';
 *
 * const area = calculateArea(5);
 * console.log(area); // 78.53981633974483
 * ```
 */
export function calculateArea(radius: number): number {
  return Math.PI * radius * radius;
}
````

## 4단계: 마크다운 문서 만들기

이제 `@public` 태그가 있는 함수들을 브라우저에서 깨끗하게 파싱된 JSDoc 문서를 볼 수 있도록 Markdown 문서로 변환해보세요.

```bash
npx docflow build
```

실행하면 다음과 같은 파일이 생성될 거예요.

```
docs/references/
├── core/
│   └── index/
│       └── core.md
├── math/
│   └── index/
│       └── calculateArea.md
└── manifest.json
```

## 5단계: 문서 사이트 연동

Docflow는 여러 문서 사이트와 연동할 수 있어요. 생성된 `manifest.json`을 사이드바에 연동해보세요.

### VitePress 연동

```typescript
import { defineConfig } from "vitepress";
import manifest from "../docs/references/manifest.json";

export default defineConfig({
  themeConfig: {
    sidebar: [
      {
        text: "레퍼런스",
        items: reference,
      },
    ],
  },
});
```

```bash
npm run docs:dev
```

이제 브라우저에서 `http://localhost:{port}/references/math/index/calculateArea`로 접속하면 문서가 잘 보일 거예요.

## 6단계: 문서 검증

이제 math.ts 파일에 새로운 스펙이 추가되었다고 가정해 볼게요. 새로운 `calculateVolume` 함수를 추가해보세요.

```typescript
// packages/math/src/index.ts
export function calculateArea(radius: number): number {
  return Math.PI * radius * radius;
}

// packages/math/src/index.ts
export function calculateVolume(radius: number, height: number): number {
  return Math.PI * radius * radius * height;
}
```

이렇게 외부로 노출되는 API에 대해서는 문서화가 필요해요. 만약 문서 없이 넣는다면 어떻게 될까요? `docflow check` 명령어로 확인해보세요.

```bash
npx docflow check
📝 core processing...
✅ core has JSDoc for all exports

📝 math processing...
❌ math has missing JSDoc:
  - packages/math/index.ts:calculateVolume
```

보시다시피, 새로 추가한 `calculateVolume` 함수에 `@public` 태그가 누락되어 있어요.

새로 추가된 함수에 문서를 추가해보세요.

```typescript
// packages/math/src/index.ts
/**
 * @generate
 */
export function calculateVolume(radius: number, height: number): number {
  return Math.PI * radius * radius * height;
}
```

그리고 `npx docflow generate`를 다시 실행해서 JSDoc을 생성하고, `npx docflow build`로 문서를 업데이트하세요. 이렇게 코드 변경 사항을 문서에 즉시 반영할 수 있어요!

## 다음 단계

이제 Docflow의 기본 사용법을 익혔어요! 더 자세한 설정과 고급 기능은 다음 문서를 참고하세요.

- [플러그인 시스템](/ko/plugins)
