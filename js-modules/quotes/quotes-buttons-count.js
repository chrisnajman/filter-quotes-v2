export default function quotesButtonsCount() {
  // After all quotes have been appended, count button occurrences
  const quoteButtons = document.querySelectorAll(".quote button")
  const counts = {}

  // Count occurrences of each button label
  quoteButtons.forEach((btn) => {
    const label = btn.textContent.trim()
    counts[label] = (counts[label] || 0) + 1
  })

  // Disable buttons that appear only once
  quoteButtons.forEach((btn) => {
    const label = btn.textContent.trim()
    if (counts[label] === 1) {
      btn.setAttribute("disabled", "")
    }
  })
}
