# spaceribs-site Specification

## Purpose

The personal site published at spaceribs.tech. An Angular application that
renders an interactive 3D scene, server-rendered and pre-rendered so it can be
served as static files from GitHub Pages.

## Requirements

### Requirement: Interactive 3D scene

The site SHALL render an interactive three.js scene on its home page, since the
scene is the substance of the page rather than decoration.

#### Scenario: The scene renders and can be manipulated

- **WHEN** a visitor opens the home page
- **THEN** a WebGL scene is rendered and can be orbited with pointer input

#### Scenario: Models are loaded from the asset library

- **WHEN** the scene initialises
- **THEN** glTF models are loaded and placed in the scene

#### Scenario: The scene is rendered with its intended treatment

- **WHEN** the scene draws
- **THEN** it passes through a post-processing chain that applies the site's
  pixelated look

### Requirement: Routing

The site SHALL lazy-load its home feature and send unknown paths back to the
root, so that a deep link into a static host does not dead-end.

#### Scenario: The home route is lazy-loaded

- **WHEN** the application starts
- **THEN** the home feature is loaded as a separate chunk

#### Scenario: Unknown paths redirect to the root

- **WHEN** a visitor requests a path that does not exist
- **THEN** they are redirected to the root route

### Requirement: Static deployment

The site SHALL be pre-rendered and published to GitHub Pages, so that no
server-side runtime is required to host it.

#### Scenario: The site is pre-rendered and deployed

- **WHEN** the docs workflow runs
- **THEN** the site is pre-rendered, bundled with the generated API
  documentation, and deployed to GitHub Pages
