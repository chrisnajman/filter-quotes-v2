export default function quotesButtons() {
  // Cache references to important elements
  const clearFilters = document.getElementById("clear-filters")
  const lis = document.querySelectorAll(".quote")
  const buttons = document.querySelectorAll(".quote button, .tag-cloud button")

  // Track the currently active filter (null = no filter)
  let activeFilter = null

  // Add click behavior to each filter button
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const selectedValue = e.target.textContent.trim()

      // If clicking the same filter again → toggle off (reset view)
      if (activeFilter === selectedValue) {
        activeFilter = null
        filterInactive()
        return
      }

      // Otherwise set and apply the new filter
      activeFilter = selectedValue
      applyFilter(selectedValue)
    })
  })

  // Add behavior for the "Clear filters" button
  clearFilters.addEventListener("click", () => {
    activeFilter = null
    filterInactive()
  })

  /* ****************************************** */

  function filterInactive() {
    // Show all list items
    lis.forEach((li) => li.removeAttribute("hidden"))

    // Remove active styles from all filter buttons
    buttons.forEach((btn) => btn.classList.remove("active"))

    // Remove "active" styling from the clear button
    clearFilters.classList.remove("active")

    // Disable the clear button
    clearFilters.setAttribute("disabled", "")
  }

  function applyFilter(selectedValue) {
    // Show only list items that contain a button matching the selected value
    lis.forEach((li) => {
      // Cache buttons for this li once to avoid creating Array multiple times
      const liButtons = [...li.querySelectorAll("button")]
      const hasMatch = liButtons.some(
        (btn) => btn.textContent.trim() === selectedValue
      )

      // Hide item if no match, show if there is
      li.toggleAttribute("hidden", !hasMatch)
    })

    // Highlight all buttons that match the selected value
    buttons.forEach((btn) => {
      btn.classList.toggle("active", btn.textContent.trim() === selectedValue)
    })

    // Add active styling to the clear button
    clearFilters.classList.add("active")

    // Enable the clear button
    clearFilters.removeAttribute("disabled")
  }
}
