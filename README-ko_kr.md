# Docflow &middot; [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/docflow/blob/main/LICENSE) [![NPM badge](https://img.shields.io/npm/v/docflow?logo=npm)](https://www.npmjs.com/package/docflow)

[English](https://github.com/toss/docflow/blob/main/README.md) | 한국어

Docflow는 JSDoc 주석으로부터 API 문서를 자동으로 생성하는 TypeScript 우선 문서화 도구에요.

- Docflow는 `@public`, `@category`, `@example` 같은 필수 태그를 지원하며, JSDoc 주석에서 포괄적인 문서를 자동으로 생성해요.
- AI 통합을 염두에 두고 설계된 Docflow는 단일 `@generate` 태그로 함수에 대한 [완전한 JSDoc 주석을 생성](https://docflow.slash.page/ko/command/generate.html)할 수 있어요.
- Docflow는 정확한 TypeScript 타입 추출을 제공해서 문서가 항상 실제 코드 시그니처와 일치하도록 보장해요.
- Docflow는 플러그인 시스템을 포함해서 [VitePress](https://vitepress.dev/), [Docusaurus](https://docusaurus.io/), [Nextra](https://nextra.site/) 등의 문서를 생성할 수 있어요.

## 예제

```typescript
import { createCalculator } from "@toss/utils";

/**
 * @public
 * @category Math
 * 주어진 초기값으로 계산기 인스턴스를 생성합니다
 * @param initialValue - 계산의 시작값
 * @returns 계산 메서드가 포함된 계산기 객체
 * @example
 * const calc = createCalculator(10);
 * calc.add(5).multiply(2).getValue(); // 30
 */
export function createCalculator(initialValue: number) {
  return {
    add: (n: number) => createCalculator(initialValue + n),
    multiply: (n: number) => createCalculator(initialValue * n),
    getValue: () => initialValue,
  };
}
```

단순히 `docflow build`만 실행하면, 예제와 타입 정보 등이 포함된 문서 페이지가 자동으로 생성돼요.

## 기여하기

커뮤니티의 모든 분들의 기여를 환영해요. 자세한 기여 가이드는 아래를 참고해주세요.

[CONTRIBUTING](https://github.com/toss/docflow/blob/main/.github/CONTRIBUTING.md)

## 라이선스

MIT © Toss. 자세한 내용은 [LICENSE](./LICENSE)를 참고하세요.

<a title="Toss" href="https://toss.im">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://static.toss.im/logos/png/4x/logo-toss-reverse.png">
    <img alt="Toss" src="https://static.toss.im/logos/png/4x/logo-toss.png" width="100">
  </picture>
</a>
