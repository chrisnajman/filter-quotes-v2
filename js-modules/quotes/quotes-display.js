const QUOTES = "./json/quotes.json"
import wordCount from "./word-count.js"
const fail = document.getElementById("fail")
const quotesList = document.getElementById("quotes-list")
const quoteTemplate = document.getElementById("quote-template")

export default async function quotesDisplay() {
  try {
    const response = await fetch(QUOTES)

    if (response.ok) {
      const items = await response.json()

      items.forEach((item) => {
        const QUOTE_TPL = quoteTemplate.content.cloneNode(true)
        const quoteContainer = QUOTE_TPL.querySelector(".quote-container")
        const textContainer = QUOTE_TPL.querySelector(".text-container")

        const author = QUOTE_TPL.querySelector("[data-author]")
        const tagContainer = QUOTE_TPL.querySelector("#tags")
        const tagGroup = QUOTE_TPL.querySelector("[data-tags]")
        const tags = [...item.tags]

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

      // After all quotes have been appended, count button occurrences
      const allButtons = document.querySelectorAll(".quote button")
      const counts = {}

      // Count occurrences of each button label
      allButtons.forEach((btn) => {
        const label = btn.textContent.trim()
        counts[label] = (counts[label] || 0) + 1
      })

      // Disable buttons that appear only once
      allButtons.forEach((btn) => {
        const label = btn.textContent.trim()
        if (counts[label] === 1) {
          btn.setAttribute("disabled", "")
        }
      })
    } else {
      fail.textContent = "Something went wrong. Please try again later..."
    }
  } catch (e) {
    console.log(e)
  }
}
