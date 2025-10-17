# Filter Quotations

<details>
  <summary><strong id="menu">Menu</strong></summary>

- [Description](#description)
- [Features](#features)
- [JSON](#json)
- [HTML `<template>`](#html-template)
- [JavaScript](#javascript)
- [Accessibility](#accessibility)
- [Theme Toggling](#theme-toggling)
- [Testing and Compatibility](#testing-and-compatibility)
- [How to Run](#how-to-run)
- [Build & Deployment Setup for `/docs` Folder](#build--deployment-setup-for-docs-folder)

</details>

## Description

A lightweight web app for browsing and filtering a collection of quotations by author or tag. Built with semantic HTML and modern vanilla JavaScript, it uses a JSON data source and an HTML `<template>` to generate the quotation list dynamically, with a focus on accessibility and clear structure.

Longer entries are rendered as `<blockquote>` elements, while shorter ones use inline `<q>` tags for natural quotation formatting.

[View on GitHub Pages](https://chrisnajman.github.io/filter-quotations-v2)

[Back to menu](#menu)

---

## Features

### Filtering quotations

- Displays a list of quotations, each containing one or more filter buttons (e.g. author names or tags).
- Clicking an **active** filter button shows only the quotations that include that author or tag.
- The active filter is visually highlighted across all matching buttons.
- A "Clear filters" button resets the list to show all quotations.

### Conditional rendering

- Quotations of **25 words or fewer** are displayed using a `<q>` element (inline quotations).
- Quotations **over 25 words** are displayed using a `<blockquote>` element (block-level quotations).
- This enhances readability while maintaining semantic meaning.

### Details dropdown

- Keyboard support: pressing `Escape` closes the currently focused `<details>`.
- ARIA attributes (`aria-expanded`) synchronized with open/close state.

[Back to menu](#menu)

---

## JSON

The structure of a JSON entry is as follows:

```json
{
  "prequote": "Pre-quote",
  "quote": "Quote",
  "postquote": "Pre-quote",
  "author": "Author",
  "tags": ["Tag-1", "Tag-2", "Tag-3", "Tag-4", "Tag-5", "Tag-(n)"]
}
```

To create your own quotations list, open `./json/quotes.json`, remove the existing entries, and add your own, using the template above as a model.

Don't forget to separate entries with a comma, i.e.

```json
[
  {
    "prequote": "",
    "quote": "",
    "postquote": "",
    "author": "",
    "tags": []
  },
  {
    "prequote": "",
    "quote": "",
    "postquote": "",
    "author": "",
    "tags": []
  },
  {
    "prequote": "",
    "quote": "",
    "postquote": "",
    "author": "",
    "tags": []
  }
]
```

### Notes

- The last entry in a JSON file is **not** followed by a comma.
- Both **prequote** and **postquote** are optional. They can be used to supply a preamble or a postamble (real word!) to the quotation. If either are not required, leave the field value as `""` and the corresponding HTML will be hidden.
- If the **author** is unknown, leave the field value as `""`: a button with a label of "Unknown" will be created.
- You can create as many **tags** as you like. If you don't want any, leave the field value as an empty array (`[]`) and the entire list item will be hidden.

[Back to menu](#menu)

---

## HTML `<template>`

The JSON entries are inserted into an HTML `<template>` via `quotes-display.js`.

The `<template>` element provides a reusable structure for each quotation, allowing the script to clone and populate it with data from the JSON file without repeating markup in the HTML.

```html
<template id="quote-template">
  <li class="quote-container quote flow">
    <!-- Begin Quotations output -->
    <div class="text-container"></div>
    <!-- End Quotations output -->
    <ul>
      <li>
        <span class="info">Author:</span>
        <button
          type="button"
          data-author
        ></button>
      </li>
      <li
        class="tags"
        id="tags"
      >
        <span class="info">Tags:</span>
        <ul>
          <li>
            <div
              class="buttons-container"
              data-tags
            ></div>
          </li>
        </ul>
      </li>
    </ul>
  </li>
</template>
```

[Back to menu](#menu)

---

## JavaScript

Built with **vanilla ES6 JavaScript**, focusing on modern syntax and browser APIs.

The JavaScript has been split into separate modules, improving code modularity:

- `index.js`: Initializes the app using an asynchronous `init()` function.

  - The function first **awaits `quotesDisplay()`**, which fetches the JSON file and renders the quotations dynamically from the `<template>`.
  - Only after that process completes does it call `quotesButtons()`, ensuring that all quotation elements and filter buttons exist in the DOM before event listeners are attached.
  - This sequence guarantees that filtering behavior is safely applied to dynamically generated content.

- `quotes-display.js`: Handles fetching and displaying quotations from an external JSON file using the Fetch API.

  - Retrieves `quotes.json` asynchronously and checks for a successful response.
  - Clones the HTML `<template>` for each quotation, filling in quotation text, author, and tags.
  - Depending on word count (determined via `word-count.js`), inserts the text into either a `<q>` or `<blockquote>` element.
  - Gracefully handles missing data:
    - Displays "Unknown" when the author field is empty.
    - Hides the tags section if no tags exist.
  - Dynamically creates `<button>` elements for each tag and appends them to the appropriate quotation.
  - If there is only one instance of an **author** or **tag**, the `disabled` attribute is attached to its `<button>`.
  - Outputs a message to the user (`#fail`) if data fails to load or the fetch request encounters an error.
  - Completes rendering before the filtering logic (`quotes-buttons.js`) is executed.

- `word-count.js`: Counts the number of words in a given string.

  - Exports a simple function that trims whitespace and splits the text using a regular expression (`/\s+/`) to calculate an accurate word count.
  - Used by `quotes-display.js` to decide whether to render the quotation text as an inline `<q>` (short quotations) or block-level `<blockquote>` (long quotations).

- `quotes-buttons.js`: Controls the interactive filtering behavior for the quotations list:
  - Selects and caches key DOM elements: the list items (`.quote`), each quote’s filter buttons, and the "Clear filters" button.
  - Tracks which filter (author or tag) is currently active.
  - Handles click events on quotation buttons to apply or remove filters.
    - Clicking a button shows only quotations containing that author or tag.
    - Clicking the same button again resets the view.
  - Updates visual states:
    - Highlights active filter buttons across all matching quotations.
    - Enables and styles the "Clear filters" button when a filter is active.
    - Disables and clears it when no filter is applied.
  - Uses simple helper functions:
    - `applyFilter(selectedValue)` — hides non-matching quotations and updates button states.
    - `filterInactive()` — resets all filters and restores the full quotations list.

### Other

- `page-header-resize-observer.js`: Observes the `.header` element and updates the root’s `scroll-padding-top` based on header size and the `--skip-link-gap` CSS variable (in `base.css`), ensuring skip links and anchor targets scroll into view with proper spacing below a fixed or sticky header.

- `details.js`: Handles `<details>` accessibility and behavior.

  - Syncs `aria-expanded` between `<summary>` and `<details>`.
  - Supports closing via the `Escape` key and restores focus.

- `loader.js`: See [Loader Git repository](https://github.com/chrisnajman/loader)

- `theme.js`: Handles theme toggling (light/dark mode) and local storage management.

[Back to menu](#menu)

---

## Accessibility

- ARIA attributes (`aria-expanded`) dynamically updated on all `<summary>` elements.
- Escape key support: closes the open `<details>` and returns focus to its `<summary>`.
- Quotations rendered as `<blockquote>` elements for longer text benefit assistive technologies by clearly indicating quoted or cited material. Screen readers announce them as quotations, improving semantic context.
- The inline `<q>` element is retained for shorter quotations to ensure natural, readable inline flow while remaining accessible.

### No JS

If JavaScript is disabled, a warning message is displayed and the loader animation, theme-toggler, quotations display and filtering cease to function.

[Back to menu](#menu)

---

## Theme Toggling

The application includes a dark mode and light mode toggle:

- The current theme state is stored in **local storage** and applied automatically on page reload.
- Accessible buttons with appropriate ARIA attributes are used to improve usability.

> [!IMPORTANT]
> Remember to change `const LOCAL_STORAGE_PREFIX` in `js-modules/theme.js` to a unique identifier.

[Back to menu](#menu)

---

## Testing and Compatibility

The application has been tested on the following platforms and browsers:

- **Operating System**: Windows 11
- **Browsers**:
  - Google Chrome
  - Mozilla Firefox
  - Microsoft Edge

### Device View Testing

The layout and functionality have been verified in both browser and device simulation views to ensure responsiveness and usability.

[Back to menu](#menu)

---

## How to Run

1. Clone or download the repository to your local machine.
2. Open the project folder and start a simple HTTP server (e.g., using `Live Server` in VS Code or Python's `http.server` module).
3. Open the project in a modern browser (e.g., Chrome, Firefox, or Edge).

[Back to menu](#menu)

---

## Build & Deployment Setup for `/docs` Folder

If you want to deploy a minified version of this project to **GitHub Pages**, read on.

### 1. Install Required Packages

Run this once in your project root to install dev dependencies:

```bash
npm install
```

### 2. Run the full build process

> [!IMPORTANT]
> Any assets not described in `package.json` must be added. In the current project we don't have an `img` folder. If you create one and add images to it, you have to add this to `copy:assets`, e.g.

#### Current `package.json`

```
"copy:assets": "shx cp -r  site.webmanifest favicon.ico favicon-16x16.png favicon-32x32.png apple-touch-icon.png android-chrome-192x192.png android-chrome-512x512.png docs/",
```

#### Updated `package.json` with "img"

```
"copy:assets": "shx cp -r  img site.webmanifest favicon.ico favicon-16x16.png favicon-32x32.png apple-touch-icon.png android-chrome-192x192.png android-chrome-512x512.png docs/",
```

etc, etc.

Then in the terminal, run:

```bash
npm run build
```

### 3. Deploy to GitHub Pages

Once you've created a repository and pushed the files,

- go to `https://github.com/[your-name]/[your-project-name]/settings/pages`.
- Under "Build and deployment > Branch" make sure you set the branch to `main` and folder to `/docs`.
- Click "Save".

> [!NOTE]
> For a detailed description of the build process, configuration files and npm packages see my [GitHub Pages Optimised Build](https://github.com/chrisnajman/github-pages-optimised-build).

[Back to menu](#menu)
