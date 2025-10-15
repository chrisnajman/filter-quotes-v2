import themeSwitcher from "./js-modules/theme.js"
import loadingAnimation from "./js-modules/loader.js"
import details from "./js-modules/details.js"
import pageHeaderResizeObserver from "./js-modules/page-header-resize-observer.js"
import quotesDisplay from "./js-modules/quotes/quotes-display.js"
import quotesButtons from "./js-modules/quotes/quotes-buttons.js"

themeSwitcher()
loadingAnimation()
details()
pageHeaderResizeObserver()

async function init() {
  await quotesDisplay()
  quotesButtons()
}

init()
