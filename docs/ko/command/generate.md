# docflow generate

`@generate` JSDoc 태그가 있는 함수들에 대해 AI가 자동으로 완전한 JSDoc 주석을 생성해줘요.

## 예제

### 기본 사용법

현재 워크스페이스의 모든 패키지에서 `@generate` 태그가 있는 함수들을 찾아서 JSDoc을 자동 생성합니다.

```bash
docflow generate
```

### AI fetcher 설정

AI 서비스를 사용해서 JSDoc을 생성하려면 fetcher 함수를 설정해야 해요.

```javascript
export default {
  commands: {
    generate: {
      jsdoc: {
        fetcher: async ({ signature, prompt }) => {
          const response = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
              },
              body: JSON.stringify({
                model: "gpt-4",
                messages: [{ role: "user", content: prompt }],
              }),
            },
          );
          const data = await response.json();
          return data.choices[0].message.content;
        },
      },
    },
  },
};
```

### 커스텀 프롬프트 설정

JSDoc 생성에 사용할 프롬프트를 커스터마이징할 수 있어요.

```javascript
export default {
  commands: {
    generate: {
      jsdoc: {
        fetcher: myFetcher,
        prompt: `
Generate Korean JSDoc documentation for this function.
Include @public, @param, @returns, and @example tags.
`,
      },
    },
  },
};
```

## 내부 동작

`@generate` 태그를 사용하면 AI가 함수의 시그니처를 분석해서 자동으로 완전한 JSDoc 주석을 생성해서 업데이트할 수 있어요.

`generate` 커맨드는 각 패키지에서 `@generate` 태그가 있는 함수들을 찾아서 AI가 자동으로 `@public` 태그를 포함한 완전한 JSDoc을 생성해줘요. 생성된 JSDoc에는 매개변수 설명, 반환값, 예제 코드가 모두 포함돼요.

### 내부 동작 과정

`docflow generate` 명령어가 실행될 때 내부적으로 진행되는 절차는 다음과 같아요.

1. **설정 파일 로드**: `docflow.config.js` 파일에서 프로젝트 설정과 AI fetcher를 읽어와요.
2. **워크스페이스 패키지 탐색**: 설정된 include/exclude 패턴에 따라 대상 패키지들을 찾아요.
3. **각 패키지별 처리**:
   - TypeScript 설정을 로드하고 소스 파일들을 파싱해요.
   - export되는 선언들만 추출해서 barrel re-export는 제외시켜요.
   - `@generate` JSDoc 태그가 있는 선언들만 필터링해요.
   - 각 함수의 TypeScript 시그니처를 추출해요.
4. **파일 선택**: 사용자가 어떤 함수들의 JSDoc을 생성할지 선택할 수 있어요.
5. **AI JSDoc 생성**: 선택된 함수들에 대해 AI가 JSDoc을 생성하고 파일에 저장해요.

### 출력 예시

다음과 같은 형태로 생성 과정을 보여줘요.

```bash
npx docflow generate
  - @libs/root (.)
  - core (packages/core)
  - math (packages/math)
📝 core processing...
📝 math processing...
? Select targets for JSDoc generation: …
❯ All targets
  1. fetchData (core)
  2. calculateArea (math)
✔ Select targets for JSDoc generation: · All targets
✅ packages/core/index.ts fetchData updated
✅ packages/math/index.ts calculateArea updated
✅ generate done
```

### 사용 전후 비교

**사용 전:**

```typescript
/**
 * @generate
 */
export function calculateArea(radius: number): number {
  return Math.PI * radius * radius;
}
```

**사용 후:**

````typescript
/**
 * @public
 * @kind function
 * @category Math
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

## 설정 옵션

### jsdoc.fetcher

- **타입**: `(params: { signature: string, prompt: string }) => Promise<string>`
- **필수**: true
- **설명**: AI 서비스에서 JSDoc을 가져오는 함수예요. OpenAI, Claude, Gemini 등 원하는 AI 서비스를 사용할 수 있어요.

### jsdoc.prompt

- **타입**: `string`
- **기본값**: 내장된 영문 프롬프트
- **설명**: JSDoc 생성에 사용할 프롬프트예요. 원하는 스타일이나 언어로 커스터마이징할 수 있어요.
