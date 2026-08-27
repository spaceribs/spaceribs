# nx-threejs Specification

## Purpose

Nx plugin for three.js asset pipelines. It generates libraries that hold 3D
assets and converts authored OBJ geometry into the glTF formats a web
application can load. Used inside this repository; not published to npm.

## Requirements

### Requirement: Asset library generation

The plugin SHALL provide a generator that creates a library configured to hold
3D assets, so that asset packages are laid out consistently.

#### Scenario: An asset library is scaffolded

- **WHEN** the `asset-library` generator is run with a name
- **THEN** a library project is created, configured for asset content

### Requirement: OBJ conversion

The plugin SHALL provide a `build` executor that converts every OBJ file in a
configured source folder into both glTF and binary glTF, so that authored
geometry becomes loadable by three.js.

#### Scenario: Each OBJ is converted to both formats

- **WHEN** the `build` executor runs over a folder of `.obj` files
- **THEN** a `.gltf` and a `.glb` are produced for each one, in their
  configured output folders

#### Scenario: Converted assets are importable

- **WHEN** conversion completes
- **THEN** index files are written so the generated assets can be imported by
  name

#### Scenario: Conversion reports its outcome

- **WHEN** the executor finishes
- **THEN** it reports success or failure rather than exiting silently
