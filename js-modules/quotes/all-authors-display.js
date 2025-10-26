import { uniqueItems } from "./utils.js"
const allAuthors = document.getElementById("all-authors")
const allAuthorsTemplate = document.getElementById("all-authors-template")

export default function allAuthorsDisplay(items) {
  // Collect all authors
  const authors = items
    .map((item) => item.author.trim())
    .filter((a) => a !== "")
    .sort()

  // Remove duplicates
  const uniqueAuthors = [...new Set(authors)]

  // If no authors, exit early
  if (uniqueAuthors.length === 0) return

  // Clone the template once
  const ALL_AUTHORS_TPL = allAuthorsTemplate.content.cloneNode(true)
  const authorGroup = ALL_AUTHORS_TPL.querySelector("[data-all-authors]")

  // Create a button for each author
  uniqueItems(uniqueAuthors, authorGroup)

  // Append to the main container
  allAuthors.append(authorGroup)
}
