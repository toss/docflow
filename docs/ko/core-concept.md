# 핵심 개념

Docflow는 [JSDoc](https://jsdoc.app/)을 기반으로 라이브러리 문서를 자동으로 생성하는 도구예요. JSDoc은 JavaScript 코드에 주석으로 문서화 정보를 작성하는 표준 방식이에요. 이 문서에서는 Docflow의 핵심 개념과 기능을 소개할게요.

## 한 눈에 보는 흐름도

![concept-flow](/public/images/ko/core-concept/concept-flow.png)

## 레퍼런스 문서

Docflow는 JSDoc에서 **레퍼런스 문서**를 생성합니다.

:::info 레퍼런스 문서란?
레퍼런스 문서는 개발자가 특정 API나 함수에 대한 정확하고 완전한 정보를 빠르게 찾을 수 있도록 설계된 문서예요.
:::

Mozilla의 Web API 문서나 Node.js API 문서처럼, 개발자가 "이 함수는 어떻게 사용하지?", "매개변수는 무엇을 받지?", "반환값은 뭐지?" 같은 질문의 답을 즉시 찾을 수 있어야 합니다.

Docflow는 JSDoc의 `@param`, `@returns`, `@example` 같은 태그를 분석해서 함수 시그니처, 매개변수 테이블, 반환값 설명, 실제 사용 예제를 포함한 완전한 레퍼런스 문서를 자동으로 생성해요.

## JSDoc 지원 태그

Docflow는 JSDoc의 표준 태그와 문서 생성을 위한 커스텀 태그를 지원해요. 각 태그는 특정 목적에 따라 사용되며, 문서 생성 과정에서 다양한 역할을 수행해요.

**표준 JSDoc 태그**: [`@param`](https://jsdoc.app/tags-param.html), [`@returns`](https://jsdoc.app/tags-returns.html), [`@throws`](https://jsdoc.app/tags-throws.html), [`@example`](https://jsdoc.app/tags-example.html), [`@deprecated`](https://jsdoc.app/tags-deprecated.html), [`@see`](https://jsdoc.app/tags-see.html), [`@version`](https://jsdoc.app/tags-version.html), [`@description`](https://jsdoc.app/tags-description.html), [`@kind`](https://jsdoc.app/tags-kind.html), [`@name`](https://jsdoc.app/tags-name.html)

**Docflow 전용 태그**: `@public`, `@category`, `@generate`

이러한 태그들을 조합해서 구조화된 문서를 자동으로 생성할 수 있어요.

## JSDoc 템플릿 사용법

Docflow는 일관된 문서 생성을 위해 표준화된 JSDoc 템플릿을 사용해요. 다음은 예시 코드에서 사용하는 예시와 생성되는 문서 예시에요.

### 태그 예시

````typescript
/**
 * @public
 * @kind function
 * @category Math
 * @name calculateArea
 * @signature
 * ```typescript
 * calculateArea(radius: number): number
 * ```
 * @description
 * 원의 넓이를 계산합니다. 반지름을 입력받아 파이(π)와 제곱을 이용해 정확한 넓이를 반환합니다.
 *
 * @param {number} radius - 원의 반지름 (양수여야 함)
 * @returns {number} 계산된 원의 넓이
 *
 * @example
 * ```typescript
 * import { calculateArea } from '@mylib/math';
 *
 * const area = calculateArea(5);
 * console.log(area); // 78.53981633974483
 * ```
 *
 * @version Android/5.186.0, iOS/5.231.0, Web/5.0.0
 */
export function calculateArea(radius: number): number {
  return Math.PI * radius * radius;
}
````

### 문서 변환 결과

#### **생성되는 파일 경로**

```
docs/references/math/calculateArea.md
```

#### **Markdown 결과**

````markdown
---
source: packages/math/src/calculateArea.ts
---

# calculateArea

```typescript
calculateArea(radius: number): number
```

원의 넓이를 계산합니다. 반지름을 입력받아 파이(π)와 제곱을 이용해 정확한 넓이를 반환합니다.

## 매개변수

| 이름   | 타입   | 설명                      |
| ------ | ------ | ------------------------- |
| radius | number | 원의 반지름 (양수여야 함) |

## 반환값

| 타입   | 설명             |
| ------ | ---------------- |
| number | 계산된 원의 넓이 |

## 예제

```typescript
import { calculateArea } from "@mylib/math";

const area = calculateArea(5);
console.log(area); // 78.53981633974483
```

## 버전 정보

- Android: 5.186.0
- iOS: 5.231.0
- Web: 5.0.0
````

브라우저에서는 이미지와 같이 볼 수 있어요.
![markdown-example](/public/images/ko/core-concept/markdown-example.png)

### 파일 구조 결정

JSDoc 태그에 따라 파일이 어떻게 구성되는지 알아볼게요.

**결정 규칙:**

1. `@name` 태그 → 파일명 (없으면 함수명 사용)
2. 폴더명 결정 우선순위:
   - `@category` 태그 값 (최우선)
   - 자동 감지된 TypeScript 선언 타입 (function, class, interface, type, enum, variable)
   - `"misc"` (기본값)

**동작 예시**

```typescript
/** @public @category Math */
export function add(a: number, b: number): number {}

/** @public */
export function multiply(x: number, y: number): number {}

/** @public */
export class Calculator {}

/** @public */
export interface UserConfig {}
```

**생성되는 폴더 구조:**

```
docs/references/
├── Math/           ← @category "Math"
├── function/       ← 자동 감지된 kind
├── class/          ← 자동 감지된 kind
├── interface/      ← 자동 감지된 kind
├── type/           ← 자동 감지된 kind
├── enum/           ← 자동 감지된 kind
├── variable/       ← 자동 감지된 kind
└── misc/           ← 기본값
```

## 플러그인 시스템

플러그인 시스템은 Docflow의 기본 기능을 확장하거나 커스터마이징할 때 사용해요. 예를 들어 VitePress 대신 Docusaurus나 Nextra로 문서를 생성하고 싶거나, 생성된 문서의 구조를 조직의 규칙에 맞게 변경하고 싶을 때 유용해요.

### 제너레이터 플러그인

```js
{
  plugins: [
    {
      name: "custom-generator",
      plugin: () => ({
        hooks: {
          provideGenerator: (name) => {
            if (name === "custom") {
              return new CustomGenerator();
            }
          },
        },
      }),
    },
  ];
}
```

제너레이터 플러그인으로 다양한 문서 형식을 지원할 수 있어요. 기본 VitePress 외에도 Docusaurus, Nextra 등 원하는 문서 시스템과 연동 가능해요.

### 매니페스트 변환

```js
{
  hooks: {
    transformManifest: (manifest) => {
      // VitePress 사이드바 형식을 Docusaurus 네비게이션으로 변환
      return manifest.map((item) => ({
        type: "category",
        label: item.text,
        items: item.items?.map((subItem) => ({
          type: "doc",
          id: subItem.link.replace(".md", ""),
        })),
      }));
    };
  }
}
```

Docflow가 기본적으로 생성하는 VitePress 매니페스트 형식을 다른 문서 시스템에서 사용할 수 있는 형식으로 변환할 수 있어요. 예를 들어 Docusaurus의 `sidebars.js` 형식이나 Nextra의 `_meta.json` 형식으로 자동 변환할 수 있어요.
