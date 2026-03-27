# docflow

## 0.0.3

### Patch Changes

- 6dfd8b9: export PropertyData type

## 0.0.2

### Patch Changes

- db6fd69: ### Features
  - Support `@property` tag for JSDoc parsing (#21)
  - Add `@param`, `@property`, `@returns` validation to `check` command (#20)
  - Support running commands from subdirectories in monorepo (#15)
  - Improve `extractSignature` to include JSDoc comments (#22)
  - Improve config usability (#9)

  ### Bug Fixes
  - Escape `<`, `>` inside backtick content (#25)
  - Fix barrel re-export with multiple file names (#24)
  - Fix JSDoc tag name and description merging (#23)
  - Fix JSDoc parameter parsing for deeply nested parameters (#16)
  - Remove root tsconfig fallback and add error handling for package tsconfig resolution (#14)
  - Fix tag value trim
  - Add shebang to CLI entry point (#8)
