import type { Config } from "docflow";

const EN_BUILD_OPTIONS = {
  outputDir: "docs/en/reference",
  generator: {
    name: "vitepress",
    signatureLanguage: "typescript",
    labels: {
      parameters: "Parameters",
      returns: "Returns",
      throws: "Throws",
      examples: "Examples",
      see: "See",
      version: "Version",
      deprecated: "Deprecated",
      signature: "Signature",
      typedef: "Type Definitions",
    },
  },
  manifest: {
    enabled: true,
    prefix: "/en/reference",
    path: "docs/en/reference/manifest.json",
  },
};

const KO_BUILD_OPTIONS = {
  outputDir: "docs/ko/reference",
  generator: {
    name: "vitepress",
    signatureLanguage: "typescript",
    labels: {
      parameters: "매개변수",
      returns: "반환값",
      throws: "예외",
      examples: "예시 코드",
      see: "참고",
      version: "버전",
      deprecated: "사용 중단",
      signature: "시그니처",
      typedef: "타입 정의",
    },
  },
  manifest: {
    enabled: true,
    prefix: "/ko/reference",
    path: "docs/ko/reference/manifest.json",
  },
};

const BUILD_OPTIONS = {
  en: EN_BUILD_OPTIONS,
  ko: KO_BUILD_OPTIONS,
};

const BUILD_TARGET =
  (process.env.LANGUAGE as keyof typeof BUILD_OPTIONS) || "en";

const config: Config = {
  project: {
    root: ".",
    packageManager: "yarn",
    workspace: {
      include: ["packages/*"],
      exclude: [],
    },
  },
  commands: {
    build: BUILD_OPTIONS[BUILD_TARGET],
    check: {
      entryPoints: ["packages/cli/src/index.ts"],
    },
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
                model: "gpt-4o",
                messages: [{ role: "user", content: prompt }],
              }),
            }
          );
          const data = await response.json();
          return data.choices[0].message.content;
        },
      },
    },
  },
  plugins: [],
};

export default config;
