# React Project/Folder Structure and tips for large react projects

## Overwiev of Folder Structure `src/`

Links:<br>
- [Structure React Projects](https://blog.webdevsimplified.com/2022-07/react-folder-structure/)
- [React Folder Structure 5 Steps](https://www.robinwieruch.de/react-folder-structure/)

### One folde for each react component

```
- src
--- App/
----- index.js
----- component.js
----- test.js
----- style.css
--- List/
----- index.js
----- component.js
----- test.js
----- style.css
----- hooks.js
----- types.js
...
```

- component.js holds actual implementation logic of the component
- index.js represents the public interface of the folder where everything gets exported that's relevant to the outside world.
- React Hooks and Types which are still only used by one component should remain in the component's file

In JavaScript, we can omit the /index.js for the imports, because it's the default:

`import { List } from '../List'`

### Folder Structure
```
.
└── /src
    ├── /assets
    ├── /components
    ├───── /ui
    ├───── /form
    ├───── /layout
    ├── /context
    ├── /data
    ├── /hooks
    ├── /pages
    ├── /services
    ├── index.tsx
    └── App.tsx
```

- `assets`
contains all images, css files, font files, etc. for your project. Pretty much anything that isn't code related will be stored in this folder
- `components`
contains general components that are reusable. Components is broken down into subfolders:
  - `ui`
  contains all our UI components like buttons, modals, cards, etc.
  - `form`
  form specific controls like checkboxes, inputs, date pickers, etc.
  - `layout`
  layout based components like sidebar, navbar, container, etc.
- `context`
stores all your React context files that are used across multiple pages
- `data`
data folder is similar to the assets folder, but this is for storing our data assets such as JSON files that contain information used in our code. Also contains global constant variables/environment variables.
- `hooks`
stores global hooks that are used across multiple pages
- `pages`
should contain one folder for each page in your application. Inside of those page specific folders should be a single root file that is your page (generally index.js) alongside all the files that are only applicable to that page
- `services`
contains all utility functions like formatters, validators, helpers and code for interfacing with any external API

### Aliases
[Resolve Path Alias in React Typescript](https://plusreturn.com/blog/how-to-configure-a-path-alias-in-a-react-typescript-app-for-cleaner-imports/#Configuring_an_Alias)

Set up the system to use aliases, so anything within the components folder could be imported as @components, assets as @assets, etc. If you have a custom Webpack, this is done through the  [resolve](https://webpack.js.org/configuration/resolve/) configuration. We are using [craco](https://github.com/dilanx/craco) (Create React App Configuration Override).

## Tips on building large react app

- 