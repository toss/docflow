# docflow build

`@public` JSDoc 태그가 있는 TypeScript/JavaScript 코드를 바탕으로 Markdown 문서를 자동으로 생성해요.

### 기본 사용법

현재 워크스페이스의 모든 패키지에서 `@public` 태그가 있는 함수들의 문서를 생성합니다.

```bash
docflow build
```

## 예제

### 특정 출력 디렉토리로 생성

설정 파일에서 출력 디렉토리를 지정한 경우에 사용되는 필드에요.  

```javascript
export default {
  commands: {
    build: {
      outputDir: "docs/api",
    },
  },
};
```

### manifest 파일 생성

VitePress sidebar나 Nextra navigation을 위한 manifest 파일을 함께 생성 할 수 있어요. 이 파일은 생성된 문서의 네비게이션 구조 데이터를 제공해요.

```javascript
export default {
  commands: {
    build: {
      manifest: {
        enabled: true,
        path: "docs/.vitepress/sidebar.json",
      },
    },
  },
};
```

### 커스텀 제너레이터 사용

Nextra나 다른 문서 시스템용 제너레이터를 사용할 경우 plugin에 제너레이터 이름을 지정할 수 있어요. 기본값은 `vitepress`에요.

```javascript
export default {
  commands: {
    build: {
      generator: {
        name: "nextra",
        signatureLanguage: "tsx",
      },
    },
  },
};
```

### 문서 섹션 레이블 커스터마이징

생성되는 문서의 섹션 제목을 커스터마이징할 수 있어요. 기본적으로는 parameters, returns, examples 등으로 정의돼있어요.

```javascript
export default {
  commands: {
    build: {
      generator: {
        name: "vitepress",
        labels: {
          parameters: "매개변수",
          returns: "반환값",
          examples: "예제",
          signature: "사용법",
        },
      },
    },
  },
};
```

## 내부 동작

코드의 변경 사항이 발생하면, JSDoc 주석으로 작성된 인터페이스와 실제 API 문서 간에 불일치가 생길 수 있어요. build 명령어를 사용하면, 이러한 문제를 방지하고 항상 최신 상태의 문서를 유지할 수 있어 개발자와 사용자가 신뢰성 있는 정보를 얻을 수 있게 돼요.

`build` 커맨드는 프로젝트의 파일을 분석해서 `@public` JSDoc 태그가 있는 함수, 클래스, 인터페이스 등에 대한 Markdown 문서를 자동으로 생성해요.

### 내부 동작 과정

`docflow build` 명령어가 실행될 때 내부적으로 진행되는 절차는 다음과 같아요.

1. **설정 파일 로드**: `docflow.config.js` 파일에서 프로젝트 설정을 읽어와요.
2. **워크스페이스 패키지 탐색**: 설정된 include/exclude 패턴에 따라 대상 패키지들을 찾아요.
3. **플러그인 시스템 초기화**: 등록된 플러그인들을 로드하고 제너레이터를 준비해요.
4. **각 패키지별 처리**:
   - TypeScript 설정을 로드하고 소스 파일들을 파싱해요
   - export되는 선언들만 추출해서 barrel re-export는 제외시켜요.
   - `@public` JSDoc 태그가 있는 선언들만 필터링해요.
   - JSDoc 주석을 파싱해서 문서 생성에 필요한 정보를 추출해요.
   - 각 선언에 대해 Markdown 문서를 생성하고 저장해요.
5. **Manifest 파일 생성**: 모든 생성된 문서 정보를 기반으로 네비게이션용 manifest 파일을 생성해요.

### 출력 구조

기본적으로 생성된 문서는 다음과 같은 구조를 가져요.

```
docs/references/
├── package-name/
│   ├── category/
│   │   ├── functionName.md
│   │   └── className.md
│   └── misc/
│       └── uncategorized.md
└── manifest.json
```

폴더 구조는 JSDoc의 `@category` 태그나 TypeScript 선언 타입(function, class 등)에 따라 자동으로 구성돼요.

## 설정 옵션

### outputDir

- **타입**: `string`
- **기본값**: `"docs/references"`
- **설명**: 생성된 문서가 저장될 디렉토리 경로예요.

### generator.name

- **타입**: `string`
- **기본값**: `"vitepress"`
- **설명**: 사용할 제너레이터 이름이에요. (vitepress 또는 플러그인 이름)

### generator.signatureLanguage

- **타입**: `string`
- **기본값**: `"typescript"`
- **설명**: 코드 시그니처 구문 강조에 사용할 언어예요. (typescript, tsx, javascript 등)

### generator.labels

- **타입**: `object`
- **설명**: 문서 섹션의 레이블을 커스터마이징할 수 있어요.
- **기본값**:
  ```typescript
  {
    parameters: "Parameters",
    returns: "Returns",
    throws: "Throws",
    examples: "Examples",
    see: "See",
    version: "Version",
    deprecated: "Deprecated",
    signature: "Signature",
    typedef: "Type Definitions"
  }
  ```

### manifest.enabled

- **타입**: `boolean`
- **기본값**: `true`
- **설명**: manifest.json 파일 생성 여부예요.

### manifest.path

- **타입**: `string`
- **기본값**: `outputDir + "/manifest.json"`
- **설명**: manifest 파일이 저장될 경로예요. (프로젝트 루트 기준 상대 경로 또는 절대 경로)

### manifest.prefix

- **타입**: `string`
- **기본값**: `"docs/references"`
- **설명**: 문서 링크에 사용될 기본 접두사예요.
