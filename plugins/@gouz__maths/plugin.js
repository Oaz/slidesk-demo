// KaTeX renders every slide once, when the page loads: the speaker view and
// the exports then receive slides already rendered
(() => {
  const options = { throwOnError: false };
  for (const slide of document.querySelectorAll(".sd-slide")) {
    // ```math blocks: their content is kept as written, \\ and \, included
    for (const code of slide.querySelectorAll("pre > code.language-math")) {
      const block = document.createElement("div");
      block.className = "sd-math";
      katex.render(code.textContent, block, { ...options, displayMode: true });
      code.parentElement.replaceWith(block);
    }
    // `$…$` inline code
    for (const code of slide.querySelectorAll("code")) {
      const text = code.textContent.trim();
      if (text.length < 3 || !text.startsWith("$") || !text.endsWith("$"))
        continue;
      const inline = document.createElement("span");
      katex.render(text.slice(1, -1), inline, options);
      code.replaceWith(inline);
    }
    // $$…$$ in the text; a single $ is left alone, prices use it
    renderMathInElement(slide, {
      ...options,
      delimiters: [{ left: "$$", right: "$$", display: true }],
      ignoredClasses: ["sd-notes"],
    });
  }
})();
