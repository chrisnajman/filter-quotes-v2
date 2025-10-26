import {
  countAsideButtons,
  getSingleInstance,
  disableSingleButtons,
  sortButtons,
} from "./utils.js"

export default function asideButtons(items) {
  // Collect all authors
  const authors = items
    .map((item) => item.author.trim())
    .filter((a) => a !== "")
    .sort()

  // Collect and flatten all tag arrays
  const tags = items
    .flatMap((item) => item.tags || []) // safely handle missing tags
    .map((tag) => tag.trim())
    .filter((tag) => tag !== "")
    .sort()

  // Count occurrences of authors and tags
  const countAuthors = countAsideButtons(authors)
  const countTags = countAsideButtons(tags)

  // Keep only authors and tags items that appear once
  const singleAuthors = getSingleInstance(authors, countAuthors)
  const singleTags = getSingleInstance(tags, countTags)

  // Collect all <button> elements inside [data-all-authors] and [data-all-tags]
  const authorButtons = [
    ...document.querySelectorAll("[data-all-authors] button"),
  ]
  const tagButtons = [...document.querySelectorAll("[data-all-tags] button")]

  // Disable author and tag buttons whose text matches items that appear only once
  disableSingleButtons(authorButtons, singleAuthors)
  disableSingleButtons(tagButtons, singleTags)

  // Sort buttons: enabled first, then disabled; alphabetical within each group
  sortButtons(authorButtons)
  sortButtons(tagButtons)

  // Re-append buttons in new order
  const authorButtonsContainer = document.querySelector("[data-all-authors]")
  const tagButtonsContainer = document.querySelector("[data-all-tags]")
  authorButtons.forEach((btn) => authorButtonsContainer.appendChild(btn))
  tagButtons.forEach((btn) => tagButtonsContainer.appendChild(btn))
}
