// https://vitepress.dev/guide/custom-theme
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { h } from "vue";
import { fixLangLinks } from "../libs/fixLangLinks.mts";
import "./style.css";

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    });
  },
  enhanceApp({ app, router, siteData }) {
    if (typeof window === "undefined") return;
    fixLangLinks();
    router.onAfterRouteChanged = () => {
      fixLangLinks();
    };
  },
} satisfies Theme;
