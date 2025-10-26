/** aside-buttons.js */
// ====================

// Count occurrences of authors and tags
export function countAsideButtons(array) {
  return array.reduce((acc, num) => {
    if (!num) return acc
    acc[num] = (acc[num] || 0) + 1
    return acc
  }, {})
}

// Keep only authors and tags items that appear once
export function getSingleInstance(arr, counter) {
  return arr.filter((num) => counter[num] === 1)
}

// Disable author and tag buttons whose text matches items that appear only once
export function disableSingleButtons(buttons, buttonType) {
  buttons.forEach((btn) => {
    const text = btn.textContent.trim()
    if (buttonType.includes(text)) {
      btn.setAttribute("disabled", "")
    }
  })
}

// Sort buttons: enabled first, then disabled; alphabetical within each group
export function sortButtons(buttons) {
  buttons.sort((a, b) => {
    const aDisabled = a.hasAttribute("disabled")
    const bDisabled = b.hasAttribute("disabled")

    // Enabled first
    if (aDisabled !== bDisabled) return aDisabled ? 1 : -1

    // Same group → alphabetical
    const aText = a.textContent.trim().toLowerCase()
    const bText = b.textContent.trim().toLowerCase()
    return aText.localeCompare(bText)
  })
}

/** all-authors-display.js, all-tags-display.js */
// ===============================================

// Create a button for each tag
export function uniqueItems(itemsList, group) {
  itemsList.forEach((itemType) => {
    const btn = document.createElement("button")
    btn.type = "button"
    btn.textContent = itemType
    group.append(btn)
  })
}

/** quotes-display.js */
// ========================

// Count sentence length of quote
export function wordCount(sentence) {
  return sentence.trim().split(/\s+/).length
}
