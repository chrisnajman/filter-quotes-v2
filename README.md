# Filter Quotations

<details>
  <summary><strong id="menu">Menu</strong></summary>

- [Description](#description)
- [Features](#features)
- [JSON](#json)
- [HTML `<template>`s](#html-templates)
- [JavaScript](#javascript)
- [No JS](#no-js)
- [Accessibility](#accessibility)
- [Theme Toggling](#theme-toggling)
- [Testing and Compatibility](#testing-and-compatibility)
- [How to Run](#how-to-run)
- [Build & Deployment Setup for `/docs` Folder](#build--deployment-setup-for-docs-folder)

</details>

## Description

A lightweight web app for browsing and filtering a collection of quotations by author or tag. Built with semantic HTML and modern vanilla JavaScript, it uses a JSON data source and an HTML `<template>` to generate the quotation list dynamically, with a focus on accessibility and clear structure.

Longer entries are rendered as `<blockquote>` elements, while shorter ones use inline `<q>` tags for natural quotation formatting.

- Includes an "All Authors and Tags" sidebar, listing every unique author and tag found in the JSON file.
- Clicking any author or tag in the sidebar filters the quotations list using the same interactive logic as the buttons within individual quotations.
- Sidebar panels close automatically when a selection is made.

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

### All Authors and Tags Sidebar

- Displays all authors and tags in a collapsible `<details>` panel on the side.
- Buttons are generated dynamically from the JSON data.
- Authors or tags that appear only once are **disabled** to indicate they cannot filter multiple quotations.
- Clicking a sidebar button applies the same filter logic as quotation buttons and closes the panel automatically.
- Buttons visually indicate the active filter.

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

## HTML `<template>`s

The JSON entries are inserted into HTML `<template>`s via `quotes-display.js`.

The `<template>` element provides a reusable structure for each quotation, allowing the script to clone and populate it with data from the JSON file without repeating markup in the HTML.

- The **All Authors and Tags** templates are populated dynamically from the JSON using `all-authors-display.js` and `all-tags-display.js`.
- Unique authors and tags are converted into `<button>` elements and inserted into their respective `<template>` containers.
- Buttons that appear only once are automatically disabled, and all buttons are sorted alphabetically with enabled buttons displayed first.

### Quotations `<template>`

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

### All Authors and Tags `<template>`s

```html
<template id="all-authors-template">
  <div
    class="buttons"
    data-all-authors
  ></div>
</template>
<template id="all-tags-template">
  <div
    class="buttons"
    data-all-tags
  ></div>
</template>
```

[Back to menu](#menu)

---

## JavaScript

Built with **vanilla ES6 JavaScript**, focusing on modern syntax and browser APIs.

The JavaScript has been split into separate modules, improving code modularity:

- `index.js`: Main entry point for the app.

  - Defines and immediately runs an asynchronous `init()` function that orchestrates fetching, rendering, and filtering quotations:

    - **`await getQuotesData()`** — fetches the JSON data and renders the quotations, also populating the sidebar.
    - **`quotesButtons()`** — initializes filtering logic on quotation buttons and returns helper functions `applyFilter` and `filterInactive`.
    - **`asideButtonFilters({ applyFilter, filterInactive })`** — connects sidebar author/tag buttons to the same filtering system.

  - The four auxiliary functions — `themeSwitcher()`, `loadingAnimation()`, `details()`, and `pageHeaderResizeObserver()` — are called beforehand to set up global behaviors.

- `quotes-get-data.js`: Fetches the JSON quotations file, passes the data to` quotes-display.js` to render the list, runs `quotes-buttons-count.js` to disable singleton buttons, and populates the sidebar via - `all-authors-display.js`, `all-tags-display.js`, and `all-authors-tags-buttons.js`.
- `quotes-display.js`: Clones the quotation template for each JSON entry, inserts quote text, pre/post-quote text, author, and tags. Short quotes use `<q>`; long quotes use `<blockquote>`. Handles missing authors/tags gracefully.
- `quotes-buttons.js`: Adds interactive filtering to quotation buttons and the "Clear filters" button. Tracks active filters, updates visibility of quotations, and highlights active buttons. Exports `applyFilter` and `filterInactive` for reuse by sidebar buttons.
- `quotes-buttons-count.js`: Counts occurrences of each author/tag button and disables buttons that appear only once.

- `all-authors-display.js`: Populates the "All Authors" sidebar panel with unique authors from JSON.
- `all-tags-display.js`: Populates the "All Tags" sidebar panel with unique tags from JSON.
- `all-authors-tags-buttons.js`: Applies sorting and disables singleton buttons in the sidebar panels.
- `all-authors-tags-button-filters.js`: Connects sidebar buttons to the filtering logic in `quotes-buttons.j`s. Clicking a sidebar button applies a filter and closes the panel.

- `utils.js`: Contains helper functions for counting occurrences, disabling singleton buttons, sorting, creating buttons from arrays, and calculating word count for quote formatting.

### Other

- `page-header-resize-observer.js`: Observes the `.header` element and updates the root’s `scroll-padding-top` based on header size and the `--skip-link-gap` CSS variable (in `base.css`), ensuring skip links and anchor targets scroll into view with proper spacing below a fixed or sticky header.

- `details.js`: Handles `<details>` accessibility and behavior.

  - Syncs `aria-expanded` between `<summary>` and `<details>`.
  - Supports closing via the `Escape` key and restores focus.

- `loader.js`: See [Loader Git repository](https://github.com/chrisnajman/loader)

- `theme.js`: Handles theme toggling (light/dark mode) and local storage management.

[Back to menu](#menu)

---

## No JS

If JavaScript is disabled, a warning message is displayed to the user.

The `no-js` class provides a simple fallback mechanism that lets you adjust styles and messages when JavaScript is unavailable.

### How it Works

#### HTML

```html
<!DOCTYPE html>
<html
  lang="en"
  class="no-js"
>
  <head>
    <!-- If JavaScript IS enabled, remove the 'no-js' class from <html> tag -->
    <script>
      document.documentElement.classList.remove("no-js")
    </script>

    <!-- Rest of <head> items -->
  </head>

  <body>
    <!-- <body> content -->
    <noscript class="container">
      <p>
        JavaScript must be enabled for the quotations to display and the
        filtering to work.
      </p>
    </noscript>
    <!-- <body> content -->
  </body>
</html>
```

#### CSS

`no-js.css`:

```css
.no-js {
  & .theme-toggler,
  & .details-container,
  & .quotes-container .btn-clear-filters,
  & .authors-tags,
  & .loader,
  & .loader::after {
    display: none;
  }
}

noscript p {
  width: fit-content;
  margin-inline: auto;
  border: 0.1875rem solid var(--warning);
  background-color: var(--body-fg);
  color: var(--el-bg);
  padding: 1em 1.5em;
  border-radius: 0.75rem;
  text-align: center;
  text-wrap: balance;
}
```

In general, add any elements you want hidden inside the `.no-js { ... }` block.

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
