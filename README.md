# Flow Signal

> A lightweight, dependency-free workflow and lifecycle orchestration
> engine for JavaScript.

Flow Signal is a declarative workflow engine that orchestrates lifecycle
transitions, REST interactions, data transformations, caching,
conditional branching, and event broadcasting without depending on any
UI framework.

## Features

-   Zero dependencies
-   Native ES Modules
-   Browser and Node.js compatible
-   Declarative workflow execution
-   Lifecycle and transition management
-   Conditional branching (`eq`, `lt`, custom handlers)
-   HTTP integration through callback abstraction
-   Cache integration
-   Data mapping and transformation
-   UI framework agnostic
-   Async/await based
-   Extensible command architecture

## Installation

``` bash
npm install flow-signal
```

## Import

``` javascript
import Signaling from "flow-signal";
```

## Basic Example

``` javascript
const signaling = Signaling(
  principal,
  results,
  location,
  [],
  {},
  lifecycle,
  [],
  [],
  null,
  "orders",
  "admin",
  []
);

await signaling.execute(
  signaling.lifecycle,
  switchCallback,
  panelCallback,
  broadcastCallback,
  httpCallback,
  cacheCallback,
  rulesCallback
);
```

## Design Goals

-   No Lodash
-   Native JavaScript
-   Browser-first
-   Framework agnostic
-   Declarative workflows
-   Extensible architecture

## License

MIT
