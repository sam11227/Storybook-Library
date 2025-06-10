# Micdrop Table Component 

## How to use this repository

```
npm i
npm run storybook
```

Folder structure:
```
Repository Root
├── src
│   ├── components
│   │   └── (Component Library)
│   ├── lib
│   │   └── components
│   │       └── Table
│   │           └── (Component to modify)
│   └── stories
│       └── * (Page examples to implement)```

There are two types of components found here:
- Components that import the Table in lib/components/table
-- These will contain example data, static, to develop against in Storybook
- Components that import the flowbite-svelte table
-- This has an extremely different API shape than our component table.

The table we are looking for you to build should contain the following features:
- Full text search
- Per-category filtering
- Ability to show/hide certain columns (preferences for that specific table stored on the localstorage)
- drag and drop reordering (always leverage the listPosition key on the object)
- Full-row clicking (used to redirect users to another page)
- Ability to place view components inline in a cell
- Ability to place interactive view components inline in a cell, such as cells that trigger popups, or the 3 dots "more" popover
- Ability to sort any column multiple times
- Ability to enable multi-select functionality with checkboxes
- Support for a "no data" render. Ideally, this is just a slot that can be styled from the calling page.
- Working client-side and server-side pagination approaches
- Display total row count
- Hover states per row
- Hover states per cell
- In responsive, convert to a List View and provide a render function to format the views as shown in attached figmas
- Unit and Integration tests to cover all of this

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run storybook

# or start the server and open the app in a new browser tab
npm run storybook -- --open
```
