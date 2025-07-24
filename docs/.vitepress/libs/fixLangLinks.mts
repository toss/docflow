export function fixLangLinks() {
  document
    .querySelectorAll<HTMLAnchorElement>('a.VPLink.link[href="/en/ex.html"]')
    .forEach((a) => a.setAttribute("href", "/en/"));
}
