# nx-web-ext Specification

## Purpose

Nx plugin for browser extensions, published as `@spaceribs/nx-web-ext`. It
generates extension applications and wraps `web-ext` so that developing and
packaging an extension are ordinary Nx targets.

## Requirements

### Requirement: Application generation

The plugin SHALL generate a browser extension application from an Nx generator,
so that a working extension exists without hand-assembling manifest, icons and
entry points.

#### Scenario: An extension application is scaffolded

- **WHEN** the `application` generator is run with a name and path
- **THEN** an extension project is created with a manifest, icon set and an
  action entry point

#### Scenario: The host framework is selectable

- **WHEN** the generator is run with `framework` set to angular or react
- **THEN** the generated application is built on that framework

#### Scenario: Routing suits an extension context

- **WHEN** a generated application uses routing
- **THEN** it is configured for hash-based routing, which an extension page can
  resolve

### Requirement: Development serving

The plugin SHALL provide a `serve` executor that builds the extension and runs
it in a browser through `web-ext`, so that the extension can be exercised while
being developed.

#### Scenario: The extension runs from its build output

- **WHEN** the `serve` executor is run against a configured build target
- **THEN** that target is built and `web-ext` launches a browser loading the
  result

#### Scenario: A missing build target is reported

- **WHEN** the executor is run with neither `browserTarget` nor `buildTarget`
  resolvable
- **THEN** it fails with an error naming the missing target rather than
  proceeding

### Requirement: Packaging

The plugin SHALL provide a `package` executor that packages built extension
output into a distributable archive via `web-ext`.

#### Scenario: Built output is packaged

- **WHEN** the `package` executor is run against built extension output
- **THEN** `web-ext` produces a zip suitable for submission to a store

### Requirement: Nx version range

The plugin SHALL support the Nx major versions declared in its peer
dependencies, so that consumers are not forced onto a single Nx release.

#### Scenario: Supported Nx versions install cleanly

- **WHEN** the plugin is installed into a workspace on Nx 20, 21, 22 or 23
- **THEN** its peer dependencies are satisfied
