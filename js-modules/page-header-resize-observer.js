export default function pageHeaderResizeObserver() {
  const root = document.querySelector("html")
  const pageHeader = document.querySelector(".header")

  const pageHeaderObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const styles = getComputedStyle(entry.target)
      const paddingBlockStart = parseFloat(styles.paddingBlockStart)
      const paddingBlockEnd = parseFloat(styles.paddingBlockEnd)
      const entryTopBotPadding = paddingBlockStart + paddingBlockEnd

      // Extra space below sticky header for skip-link targets
      const skipLinkVisualGap = 64 // px

      const customAdjustment = entryTopBotPadding + skipLinkVisualGap

      const pageHeaderHeightRems =
        (entry.contentRect.height + customAdjustment) / 16

      root.style = `scroll-padding-top: ${pageHeaderHeightRems}rem`
    }
  })

  pageHeaderObserver.observe(pageHeader)
}
