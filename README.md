# Symbiotic-UI

A dynamic UI system built with Expo React Native and Tailwind that adapts to user needs in realtime using LLMs.

Users can simply prompt:

` Change the background of button to yellow `
or
` Shift profile button to left most corner `

and the UI updates instantly at runtime.

Symbiotic-UI enables hyper-customizable applications without rebuilding screens manually.

---

# Project Structure

-  test-app
Mock UI inspired by Instagram. Contains the ` symbiotic ` folder with all core files responsible for dynamic rendering.

-  backend
Simple Express backend integrated with OpenAI LLM for understanding natural language prompts and returning JSON operations.

---

# How It Works

The project converts JSX wrapped inside:

` <SymbioticUI>{jsx}</SymbioticUI> `

into a JSON tree (registry).
This registry stores references, layout, and styles.

The renderer then reconstructs the UI from the JSON tree in realtime.

Once the registry exists, multiple runtime operations can be performed:

-  Reorder children
-  Update design tokens
-  Hide or show elements
-  Patch text/content

The LLM acts as an NLP engine.
It converts prompts like:

` Change background color to yellow `

into structured JSON operations that mutate the registry instantly.

All operations are persisted in local storage, so changes remain even after reopening the app.

Developer experience remains the top priority throughout the architecture.

---

# Folder Structure

### 1. types.ts (The Blueprint)

Purpose: Contains all TypeScript interfaces like ` SymTree `, ` SymNode `, and ` DesignTokens `.

Role: Defines the exact schema for the JSON Virtual DOM so the parser, renderer, and LLM all communicate consistently.

---

### 2. registry.ts (The Memory Vaults)

Purpose: Stores ` RuntimeComponentMap `, ` RuntimeFunctionCache `, and ` RuntimeStaticCache `.

Role: Since JSON cannot store React components or functions, this file temporarily caches them by ID and reconnects them during rendering.

---

### 3. parser.ts (The Serializer)

Purpose: Contains ` parseJSXToRegistry `.

Role: Converts React JSX into a flat JSON tree while extracting props, styles, and references.

---

### 4. utils.ts (The Mutation Engine)

Purpose: Contains ` applyOperations `, ` sanitizeTokens `, and ` tokensToClassName `.

Role: Handles runtime mutations like:

-  HIDE
-  SHOW
-  STYLE
-  REORDER

without destroying React state.

---

### 5. SymbioticUI.tsx (The Wrapper & State Manager)

Purpose: Contains ` SymbioticProvider ` and the ` <SymbioticUI/> ` wrapper.

Role:

-  Parses JSX into registry
-  Loads saved operations from storage
-  Applies runtime mutations
-  Sends updated tree to renderer

---

### 6. renderer.tsx (The Painter)

Purpose: Contains ` SymbioticRenderer ` and edit overlays.

Role: Reconstructs the JSON tree into React Native elements and injects visual editing tools like:

-  Red hidden overlays
-  Blue editable borders
-  Floating edit badges

---

# How To Use

Currently ` <SymbioticUI/> ` exists as an in-project component.
The future plan is to release it as an npm package for developers.

Take a look at:

-  app/index.tsx
-  app/reels.tsx
-  app/messages.tsx

First wrap your app inside ``<SymbioticProvider/>``

Then Wrap any component like this:

``` 
<SymbioticUI sym-name="bottom-nav"> 
  <View sym-id="container" className="flex gap-2 bg-black"> 
    <TouchableOpacity sym-id="home"> <Text className="text-white">Home</Text> </TouchableOpacity>
    <TouchableOpacity sym-id="profile"> <Text className="text-white">Profile</Text> </TouchableOpacity>
  </View>
</SymbioticUI>
```

Which is converted into following registry structure internally.
```
{
  "root": "root",
  "nodes": {
    "root": {
      "id": "root",
      "type": "Root",
      "props": {},
      "children": ["container"]
    },
    "container": {
      "id": "container",
      "type": "Component",
      "props": {
        "className": "flex gap-2 bg-black",
        "designTokens": {}
      },
      "children": ["home", "profile"]
    },
    "home": {
      "id": "home",
      "type": "Component",
      "props": {
        "designTokens": {}
      },
      "children": ["auto-uuid-1"]
    },
    "profile": {
      "id": "profile",
      "type": "Component",
      "props": {
        "designTokens": {}
      },
      "children": ["auto-uuid-2"]
    },
    "auto-uuid-1": {
      "id": "auto-uuid-1",
      "type": "StaticNode",
      "props": {},
      "children": []
    },
    "auto-uuid-2": {
      "id": "auto-uuid-2",
      "type": "StaticNode",
      "props": {},
      "children": []
    }
  }
}
````

Important:

-  Every element inside ` <SymbioticUI/> ` must have a semantic ` sym-id `
-  ` sym-id ` helps the LLM correctly identify and mutate elements
-  Avoid random naming conventions, ` sym-id ` should hold semantic meaning
- The component/project must use TailwindCSS
- Because Tailwind purges unused classes, you must add a safelist to your ``tailwind.config.js`` for the colors you want the LLM to access dynamically (e.g., pattern: /bg-(red|blue|purple|green)-500/)."

---

# Runtime Operations

Available helper functions:

` addOperations(symName, []) ` To update the registry via operations.
Example - 
```
 const { addOperations } = useSymbiotic();
 addOperations(symName, [{ type: "SHOW", target: node.id }]); //node.id : is sym-id of the element.

// Which under the hood does prop manipulation.
// nodes[target].props.hidden = false; 
```

` resetOperations(symName) ` To reset all the opertaions perfromed by update function.
Example - 
```
 const { resetOperations } = useSymbiotic();
 resetOperations(symName);

// This deletes all the operations associated with the sym-name from the localstorage.
```

Current supported operations:

-  Reordering children
-  Updating design tokens
-  Hide elements
-  Show elements

---

# Known Issues

-  LLM hallucinations
-  Inconsistent UI hydration/state sync in some edge cases

---

# Future Plans

-  Release npm package
-  Better hydration handling
-  Smarter LLM operation validation
-  Expanded design token support

---

Still actively developing the first public release.

If you liked the project, give it a star and stay connected!

[LinkedIn](https://www.linkedin.com/in/prasad-katkade/) | [Twitter/X](https://x.com/_prasadd_)
