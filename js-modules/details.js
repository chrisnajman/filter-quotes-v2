export default function details() {
  document.querySelectorAll("details").forEach((detail) => {
    const summary = detail.querySelector("summary")

    // Initialize aria-expanded based on initial state
    summary.setAttribute("aria-expanded", detail.open ? "true" : "false")

    // Update aria-expanded whenever the <details> element opens/closes
    detail.addEventListener("toggle", () => {
      summary.setAttribute("aria-expanded", detail.open ? "true" : "false")
    })

    // Close the <details> element when Escape is pressed inside it
    // Accessibility: returns focus to the <summary> after closing
    detail.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (detail.open) {
          detail.removeAttribute("open")
          summary.setAttribute("aria-expanded", "false")
          summary.focus()
        }
      }
    })
  })
}
