# wang-tiles Specification

## Purpose

Deterministic constraint-based tiling over an N-dimensional coordinate space,
published as `@spaceribs/wang-tiles`. Callers describe tiles and the
constraints between their edges, and the library collapses a region into a
consistent arrangement that satisfies them.

## Requirements

### Requirement: Seeded pseudo-random generation

The library SHALL derive its randomness from a caller-supplied seed so that the
same seed produces the same sequence, making generated worlds reproducible.

#### Scenario: The same seed yields the same sequence

- **WHEN** a `RandomGenerator` is constructed with a seed string
- **THEN** it yields a deterministic sequence of numbers for that seed

### Requirement: Weighted selection

The library SHALL support selecting an element from a weighted array, so that
some tiles can be made more likely than others.

#### Scenario: Selection respects weights

- **WHEN** a weighted array is sampled through a seeded generator
- **THEN** elements are chosen in proportion to their weights

#### Scenario: A dominant weight always wins

- **WHEN** one element's weight overwhelms the others
- **THEN** that element is the one selected

#### Scenario: An empty array is an error

- **WHEN** selection is attempted against an array with no elements
- **THEN** an error is raised rather than an undefined element returned

### Requirement: N-dimensional coordinate map

The library SHALL provide a `Map`-compatible container keyed by numeric
coordinate tuples of any dimensionality, so that one- two- and three-
dimensional spaces share an implementation.

#### Scenario: Values are stored and retrieved by coordinate

- **WHEN** a value is set at a coordinate
- **THEN** reading that coordinate returns the value, and setting it again
  overwrites the previous one

#### Scenario: Neighbours are addressable

- **WHEN** the neighbours of a coordinate are requested
- **THEN** the adjacent entries on each axis are returned

#### Scenario: Standard map operations are supported

- **WHEN** `has`, `delete`, `clear` or `forEach` is called
- **THEN** the container behaves as a `Map` keyed by coordinate

### Requirement: Constraint-driven tile sets

The library SHALL let a tile set be narrowed to those tiles whose edges satisfy
a given constraint, so that only legal neighbours remain as candidates.

#### Scenario: A tile set narrows to legal candidates

- **WHEN** a tile set is reduced by an edge constraint
- **THEN** the result contains only tiles compatible with that constraint

### Requirement: Chunk observation

The library SHALL collapse a chunk by observing tiles in turn, propagating the
constraints of each observation to the candidates still available elsewhere.

#### Scenario: Observation starts at the centre

- **WHEN** a chunk is observed
- **THEN** the centre of the chunk is the first tile resolved

#### Scenario: Every tile is resolved

- **WHEN** observation runs to completion
- **THEN** all tiles in the chunk hold a value

#### Scenario: Observation constrains its neighbours

- **WHEN** a tile is observed
- **THEN** the candidate tile sets of the affected coordinates are reduced
  accordingly

#### Scenario: Constraints produce coherent structures

- **WHEN** a chunk is generated from constraints describing rooms
- **THEN** the resulting rooms are contiguous rather than fragmented

### Requirement: Serialization

Chunks, worlds and coordinate maps SHALL be serializable to plain JSON so that
generated output can be stored and inspected.

#### Scenario: A generated structure round-trips to JSON

- **WHEN** `toJSON` is called on a chunk, world or coordinate map
- **THEN** a plain object keyed by coordinate is returned
