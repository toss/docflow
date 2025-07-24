---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Docflow"
  text: "JSDoc 기반 라이브러리 문서 자동화 도구"
  image:
    loading: eager
    fetchpriority: high
    decoding: async
    src: /hero.png
    alt:
  actions:
    - theme: brand
      text: Docflow 알아보기
      link: /ko/intro
    - theme: alt
      text: 레퍼런스
      link: /ko/reference/cli/Configuration/Config
    - theme: alt
      text: 설치
      link: /ko/installation

features:
  - title: AI로 생성되는 문서
    details: Docflow가 JSDoc 주석을 AI로 자동 생성해요. 문서화에 소요되는 시간을 크게 절약해요.
  - title: 코드와 늘 일치하는 문서
    details: TypeScript 통합으로 코드 시그니처와 타입을 자동 반영해요. 코드와 함께 문서가 업데이트돼요.
  - title: 자유로운 문서 형식
    details: 프로젝트 요구에 맞게 문서를 유연하게 생성해요. VitePress뿐 아니라 다양한 출력 형식을 플러그인으로 지원해요.
  - title: 모노리포 지원
    details: Yarn, Npm, Pnpm 워크스페이스 모두를 지원해요. 여러 패키지를 하나의 코드베이스에서 효율적으로 운영해요.
---
