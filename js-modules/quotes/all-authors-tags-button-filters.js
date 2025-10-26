export default function asideButtonFilters({ applyFilter, filterInactive }) {
  const asideButtons = document.querySelectorAll("aside button")

  asideButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const text = e.target.textContent.trim()
      filterInactive() // reset current filters
      applyFilter(text) // reuse quotes filtering logic
      // Close 'All Author and Tags' <details> on click
      e.target.closest("details").removeAttribute("open")
    })
  })
}
