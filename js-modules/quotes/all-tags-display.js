import { uniqueItems } from "./utils.js"
const allTags = document.getElementById("all-tags")
const allTagsTemplate = document.getElementById("all-tags-template")

export default function allTagsDisplay(items) {
  // Collect and flatten all tag arrays
  const tags = items
    .flatMap((item) => item.tags || []) // safely handle missing tags
    .map((tag) => tag.trim())
    .filter((tag) => tag !== "")
    .sort()

  // Remove duplicates
  const uniqueTags = [...new Set(tags)]

  // If no tags, exit early
  if (uniqueTags.length === 0) return

  // Clone the template once
  const ALL_TAGS_TPL = allTagsTemplate.content.cloneNode(true)
  const tagGroup = ALL_TAGS_TPL.querySelector("[data-all-tags]")

  // Create a button for each tag
  uniqueItems(uniqueTags, tagGroup)

  // Append to the main container
  allTags.append(tagGroup)
}
