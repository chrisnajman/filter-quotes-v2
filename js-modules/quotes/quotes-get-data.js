const QUOTES = "./json/quotes.json"
import quotesDisplay from "./quotes-display.js"
import quotesButtonsCount from "./quotes-buttons-count.js"
import allAuthorsDisplay from "./all-authors-display.js"
import allTagsDisplay from "./all-tags-display.js"
import asideButtons from "./all-authors-tags-buttons.js"

const fail = document.getElementById("fail")

export default async function getQuotesData() {
  try {
    const response = await fetch(QUOTES)

    if (response.ok) {
      const items = await response.json()
      quotesDisplay(items)
      quotesButtonsCount()
      allAuthorsDisplay(items)
      allTagsDisplay(items)
      asideButtons(items)
    } else {
      fail.textContent = "Something went wrong. Please try again later..."
    }
  } catch (err) {
    console.error(err)
  }
}
