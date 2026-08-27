# typedoc Specification

## Purpose

Nx plugin that runs TypeDoc over workspace projects to produce API
documentation. Adapted from an upstream project and used inside this
repository; deliberately not published to npm.

## Requirements

### Requirement: Documentation generation

The plugin SHALL provide an executor that runs TypeDoc against a project and
writes API documentation to the configured output.

#### Scenario: Documentation is generated for a project

- **WHEN** the `typedoc` executor is run for a project
- **THEN** TypeDoc runs against that project's configuration and produces
  documentation output

### Requirement: Binary resolution from the workspace root

The executor SHALL resolve the TypeDoc binary from the workspace root, because
it runs with the project directory as its working directory and the binary is
installed at the root of the workspace.

#### Scenario: The binary resolves when run from a project directory

- **WHEN** the executor runs with a project root as its working directory
- **THEN** the TypeDoc binary installed at the workspace root is found and
  executed

### Requirement: Project configuration

The plugin SHALL provide a generator that adds TypeDoc configuration to a
project, so that documentation settings are not written by hand.

#### Scenario: A project is configured for TypeDoc

- **WHEN** the `config` generator is run against a project
- **THEN** TypeDoc configuration is added to that project
