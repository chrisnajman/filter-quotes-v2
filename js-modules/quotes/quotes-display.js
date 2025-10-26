import { wordCount } from "./utils.js"
const quotesList = document.getElementById("quotes-list")
const quoteTemplate = document.getElementById("quote-template")

export default function quotesDisplay(items) {
  items.forEach((item) => {
    const QUOTE_TPL = quoteTemplate.content.cloneNode(true)
    const quoteContainer = QUOTE_TPL.querySelector(".quote-container")
    const textContainer = QUOTE_TPL.querySelector(".text-container")

    const author = QUOTE_TPL.querySelector("[data-author]")
    const tagContainer = QUOTE_TPL.querySelector("#tags")
    const tagGroup = QUOTE_TPL.querySelector("[data-tags]")
    const tags = [...item.tags]
    // Display tags a-z
    tags.sort()

    // If quote text > 25 words output <blockquote>; else <q>
    if (wordCount(item.quote.trim()) > 25) {
      textContainer.innerHTML = `
              <div class="quote-text flow">
                  <p class="pre-quote">${item.prequote.trim()}</p>
                  <blockquote>${item.quote.trim()}</blockquote>
                  <p class="post-quote">${item.postquote.trim()}</p>
              </div>
          `
    } else {
      textContainer.innerHTML = `
              <p class="quote-text">
                  <span class="pre-quote">${item.prequote.trim()}</span>
                  <q>${item.quote.trim()}</q>
                  <span class="post-quote">${item.postquote.trim()}</span>
              </p>
          `
    }

    item.author === ""
      ? (author.textContent = "Unknown")
      : (author.textContent = item.author.trim())

    if (tags.length === 0) {
      tagContainer.classList.add("hide")
    } else {
      tags.forEach((tag) => {
        const btn = document.createElement("button")
        btn.setAttribute("type", "button")
        btn.textContent = tag.trim()
        tagGroup.append(btn)
      })
    }

    quotesList.append(quoteContainer)
  })
}
