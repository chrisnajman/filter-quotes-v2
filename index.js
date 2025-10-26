import themeSwitcher from "./js-modules/theme.js"
import loadingAnimation from "./js-modules/loader.js"
import details from "./js-modules/details.js"
import pageHeaderResizeObserver from "./js-modules/page-header-resize-observer.js"
import getQuotesData from "./js-modules/quotes/quotes-get-data.js"
import quotesButtons from "./js-modules/quotes/quotes-buttons.js"
import asideButtonFilters from "./js-modules/quotes/all-authors-tags-button-filters.js"

themeSwitcher()
loadingAnimation()
details()
pageHeaderResizeObserver()

async function init() {
  await getQuotesData()

  // Initialize the quotesButtons first so we get back the helpers
  const { applyFilter, filterInactive } = quotesButtons()

  // Pass them into asideButtonFilters
  asideButtonFilters({ applyFilter, filterInactive })
}

init()
