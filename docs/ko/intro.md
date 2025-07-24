# Docflow 소개

Docflow는 문서 작성자의 반복 업무를 자동화해 빠르고 정확한 API 문서를 제공하는 CLI 도구예요.

Docflow를 사용하면 코드와 문서 작성을 한 번에 할 수 있어요. 코드에 작성한 JSDoc 주석이 그대로 공식 문서 사이트로 변환되어, IDE에서 보던 주석이 사용자에게는 완성된 API 문서가 돼요. 더 이상 문서를 따로 작성하고 관리할 필요가 없도록 지원해요.

Docflow는 TypeScript 타입 시스템을 활용해 함수 파라미터, 반환값, 제네릭 등 모든 타입 정보를 정확하게 추출해요. 추출한 정보는 문서에 자동으로 반영되기 때문에 코드와 문서 불일치 걱정이 없어요.

또한, AI를 활용한 자동 문서 생성 기능을 제공해요. `@generate` 태그를 추가하면 함수 시그니처를 분석해서 적절한 JSDoc 주석을 자동으로 만들어줍니다. 이를 통해 문서 작성에 드는 시간을 획기적으로 줄일 수 있어요.

![/public/images/generate-example.png](/public/images/generate-example.gif)

## 제공하는 기능

Docflow가 제공하는 주요 기능은 다음과 같아요.

- [**문서 빌드**](/ko/command/build) (`docflow build`): `@public` 태그가 있는 JSDoc을 파싱해서 Markdown 문서를 자동으로 생성해요. VitePress를 기본으로 지원하며, 플러그인을 통해 다른 형식으로도 출력할 수 있어요.
- [**문서 검증**](/ko/command/check) (`docflow check`): 모든 public API에 `@public` 태그와 JSDoc 주석이 있는지 검사해요. 문서화에 있어 놓친 API가 없는지 확인할 수 있어요.
- [**자동 생성**](/ko/command/generate) (`docflow generate`): `@generate` 태그가 있는 함수에 대해 AI가 자동으로 JSDoc 주석을 생성해요. 함수 시그니처를 분석해서 파라미터 설명, 반환값, 예제 코드까지 만들어줘요.
- [**플러그인 시스템**](/ko/plugins): 다양한 출력 형식과 기능을 지원하는 플러그인 시스템이에요. VitePress 외에도 Nextra, Docusaurus 등 원하는 형식으로 문서를 생성할 수 있어요.
