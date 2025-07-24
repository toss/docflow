import { type DefaultTheme, defineConfig } from "vitepress";
import koReferenceManifest from "../ko/reference/manifest.json";
import { offCollapsed } from "./libs/offCollapsed.mts";
import { sortByText } from "./libs/sortByText.mts";

export const ko = defineConfig({
  lang: "ko",
  description: "JSDoc 기반 라이브러리 문서 자동화 도구",

  themeConfig: {
    nav: nav(),

    sidebar: sidebar(),

    editLink: {
      pattern: "https://github.com/toss/docflow/edit/main/docs/:path",
      text: "GitHub에서 수정하기",
    },

    footer: {
      message: "MIT 라이선스에 따라 배포됩니다.",
      copyright: `Copyright © ${new Date().getFullYear()} Viva Republica, Inc.`,
    },

    outline: {
      label: "목차",
      level: "deep",
    },

    docFooter: {
      prev: "이전 페이지",
      next: "다음 페이지",
    },
  },
});

function nav(): DefaultTheme.NavItem[] {
  return [
    { text: "홈", link: "/" },
    { text: "소개", link: "/ko/intro" },
    { text: "레퍼런스", link: "/ko/reference/cli/Configuration/Config" },
  ];
}

function sidebar(): DefaultTheme.Sidebar {
  return [
    {
      text: "가이드",
      items: [
        { text: "소개", link: "/ko/intro" },
        { text: "핵심 개념", link: "/ko/core-concept" },
        { text: "설치하기", link: "/ko/installation" },
        { text: "프로젝트 설정", link: "/ko/config" },
        { text: "튜토리얼", link: "/ko/tutorial" },
      ],
    },
    {
      text: "명령어",
      items: [
        { text: "build", link: "/ko/command/build" },
        { text: "check", link: "/ko/command/check" },
        { text: "generate", link: "/ko/command/generate" },
      ],
    },
    {
      text: "고급",
      items: [{ text: "플러그인", link: "/ko/plugins" }],
    },
    {
      text: "API 레퍼런스",
      items: sortByText(offCollapsed(koReferenceManifest)),
    },
  ];
}

export const search: DefaultTheme.LocalSearchOptions["locales"] = {
  ko: {
    translations: {
      button: {
        buttonText: "검색",
        buttonAriaLabel: "검색",
      },
      modal: {
        backButtonTitle: "뒤로가기",
        displayDetails: "더보기",
        footer: {
          closeKeyAriaLabel: "닫기",
          closeText: "닫기",
          navigateDownKeyAriaLabel: "아래로",
          navigateText: "이동",
          navigateUpKeyAriaLabel: "위로",
          selectKeyAriaLabel: "선택",
          selectText: "선택",
        },
        noResultsText: "검색 결과를 찾지 못했어요.",
        resetButtonTitle: "모두 지우기",
      },
    },
  },
};
