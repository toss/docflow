# docflow check

export된 함수, 클래스, 인터페이스, 타입에서 `@public` JSDoc 태그가 없거나 `@param`/`@property`/`@returns` 태그가 누락된 것들을 찾아서 알려줘요.

## 예제

### 기본 사용법

현재 워크스페이스의 모든 패키지에서 JSDoc이 누락된 export들을 검사해요.

```bash
docflow check
```

### 특정 엔트리 포인트만 검사

설정 파일에서 검사할 엔트리 포인트를 지정한 경우에 사용되는 필드에요.

```javascript
export default {
  commands: {
    check: {
      entryPoints: ["packages/core/src/index.ts"],
    },
  },
};
```

## 내부 동작

한 번에 모든 API를 문서화하는 것은 어려워요. 점진적으로 문서화를 진행하면서 놓친 부분이 있는지 확인할 때 사용하는 명령어예요.

`check` 커맨드는 각 패키지의 export된 선언들을 검사해서 다음 항목들을 리포트해요.

- `@public` 태그가 없는 선언
- 함수에서 `@param` 태그가 누락되거나 불필요한 `@param` 태그가 있는 선언
- 인터페이스, 타입 별칭, 객체 리터럴에서 `@property` 태그가 누락되거나 불필요한 `@property` 태그가 있는 선언
- `@returns` 태그가 누락되거나 실제 반환 타입과 일치하지 않는 함수

### 검사 대상

다음 선언 타입을 검사해요.

- **함수 선언** (`function`, 화살표 함수, 함수 표현식): `@param`, `@returns` 태그를 검증해요.
- **인터페이스** (`interface`): 프로퍼티와 메서드에 대한 `@property` 태그를 검증해요.
- **타입 별칭** (`type`): 객체 타입 리터럴의 프로퍼티에 대한 `@property` 태그를 검증해요.
- **객체 리터럴** (`const obj = { ... }`): 프로퍼티에 대한 `@property` 태그를 검증해요.

### 내부 동작 과정

`docflow check` 명령어가 실행될 때 내부적으로 진행되는 절차는 다음과 같아요.

1. **설정 파일 로드**: `docflow.config.js` 파일에서 프로젝트 설정을 읽어와요.
2. **워크스페이스 패키지 탐색**: 설정된 include/exclude 패턴에 따라 대상 패키지들을 찾아요.
3. **각 패키지별 처리**:
   - TypeScript 설정을 로드하고 소스 파일들을 파싱해요.
   - 엔트리 포인트 파일들만 필터링해요. (기본값은 package.json의 main, module, exports 필드에요.)
   - export되는 선언들만 추출해서 barrel re-export는 제외시켜요.
   - `@public` JSDoc 태그가 없는 선언들을 찾아서 리포트해요.
   - `@public` 태그가 있는 선언들에 대해 `@param`, `@property`와 `@returns` 태그를 검증해요.

### 출력 예시

다음과 같은 형태로 검사 결과를 보여줘요.

```bash
npx docflow check
📝 core processing...
❌ core has missing JSDoc:
  - packages/core/index.ts:fetchData - missing @public
  - packages/core/utils.ts:processData - missing @param for 'input'
  - packages/core/utils.ts:processData - missing @returns
  - packages/core/types.ts:Config - missing @property for 'host'

📝 math processing...
✅ math has JSDoc for all exports
```

- ✅ 모든 export에 `@public` 태그가 있고, `@param`/`@property`/`@returns` 검증을 통과한 경우
- ❌ 문제가 있는 export가 있는 경우, 파일 경로·심볼명·에러 메시지를 표시해요

### 에러 타입

| 에러                             | 설명                                                              |
| -------------------------------- | ----------------------------------------------------------------- |
| `missing @public`                | `@public` 태그가 없어요.                                          |
| `missing @param for '<name>'`    | 코드에 존재하는 함수 파라미터에 대한 `@param` 태그가 없어요.      |
| `unused @param '<name>'`         | 코드에 존재하지 않는 함수 파라미터에 대한 `@param` 태그가 있어요. |
| `missing @property for '<name>'` | 코드에 존재하는 프로퍼티에 대한 `@property` 태그가 없어요.        |
| `unused @property '<name>'`      | 코드에 존재하지 않는 프로퍼티에 대한 `@property` 태그가 있어요.   |
| `missing @returns`               | 함수에 `@returns` 태그가 없어요.                                  |
| `Expected <type>, got <type>`    | `@returns` 태그의 타입이 실제 반환 타입과 일치하지 않아요.        |

## 설정 옵션

### entryPoints

- **타입**: `string[]`
- **기본값**: package.json의 main, module, exports에서 자동 감지
- **설명**: 검사할 엔트리 포인트 파일들이에요. 지정하지 않으면 package.json에서 자동으로 찾아요.
