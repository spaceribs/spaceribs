# buildings Specification

## Purpose

The 3D model assets used by the site: building components authored as voxel and
OBJ sources and compiled into web-loadable glTF. Consumed inside this
repository; not published to npm.

## Requirements

### Requirement: Model set

The library SHALL provide the building components the scene composes — ground,
two floors and a roof — so that a building can be assembled from parts rather
than loaded as one model.

#### Scenario: Components are importable by name

- **WHEN** a consumer imports from the library
- **THEN** the ground, floor and roof models are available as named exports

### Requirement: Compiled distribution formats

The library SHALL expose its models in both glTF and binary glTF, so consumers
can choose between the two.

#### Scenario: Both formats are exposed

- **WHEN** a consumer imports the library
- **THEN** glTF and glb variants of the models are reachable

### Requirement: Compilation from authored sources

Distributable models SHALL be generated from the authored OBJ sources by the
repository's own asset pipeline, so that the sources remain the point of edit.

#### Scenario: Models are regenerated from source

- **WHEN** the `compile` target is run
- **THEN** the nx-threejs build executor converts the OBJ sources into the
  glTF and glb output folders
