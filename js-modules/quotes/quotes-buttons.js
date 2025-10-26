export default function quotesButtons() {
  const clearFilters = document.getElementById("clear-filters")
  const lis = document.querySelectorAll(".quote")
  const buttons = document.querySelectorAll(".quote button")

  let activeFilter = null

  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const selectedValue = e.target.textContent.trim()

      if (activeFilter === selectedValue) {
        activeFilter = null
        filterInactive()
        return
      }

      activeFilter = selectedValue
      applyFilter(selectedValue)
    })
  })

  clearFilters.addEventListener("click", () => {
    activeFilter = null
    filterInactive()
  })

  function filterInactive() {
    lis.forEach((li) => li.removeAttribute("hidden"))
    buttons.forEach((btn) => btn.classList.remove("active"))
    clearFilters.classList.remove("active")
    clearFilters.setAttribute("disabled", "")
  }

  function applyFilter(selectedValue) {
    lis.forEach((li) => {
      const liButtons = [...li.querySelectorAll("button")]
      const hasMatch = liButtons.some(
        (btn) => btn.textContent.trim() === selectedValue
      )
      li.toggleAttribute("hidden", !hasMatch)
    })

    buttons.forEach((btn) => {
      btn.classList.toggle("active", btn.textContent.trim() === selectedValue)
    })

    clearFilters.classList.add("active")
    clearFilters.removeAttribute("disabled")
  }

  // Export these so aside-buttons.js can use them
  return { applyFilter, filterInactive }
}
