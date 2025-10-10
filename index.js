import themeSwitcher from "./js-modules/theme.js"
import loadingAnimation from "./js-modules/loader.js"
import details from "./js-modules/details.js"
import quotesDisplay from "./js-modules/quotes/quotes-display.js"
import quotesButtons from "./js-modules/quotes/quotes-buttons.js"

themeSwitcher()
loadingAnimation()
details()

async function init() {
  await quotesDisplay()
  quotesButtons()
}

init()
