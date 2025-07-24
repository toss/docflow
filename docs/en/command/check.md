# docflow check

Finds and reports exported functions, classes, and interfaces that don't have `@public` JSDoc tags.

## Examples

### Basic Usage

Checks for missing JSDoc on exports in all packages in the current workspace.

```bash
docflow check
```

### Check Specific Entry Points Only

Field used when entry points to check are specified in the configuration file.

```javascript
export default {
  commands: {
    check: {
      entryPoints: ["packages/core/src/index.ts"],
    },
  },
};
```

## Internal Operation

Documenting all APIs at once is difficult. This command is used to check for missed parts while progressively documenting.

The `check` command examines exported functions in each package and reports files with exports that don't have `@public` tags. Functions without `@public` tags are excluded from documentation targets, so if they are public APIs, please document them with `@public` tags.

### Internal Process

The internal procedure when the `docflow check` command is executed is as follows:

1. **Load Configuration File**: Read project settings from the `docflow.config.js` file.
2. **Explore Workspace Packages**: Find target packages according to configured include/exclude patterns.
3. **Process Each Package**:
   - Load TypeScript configuration and parse source files
   - Filter only entry point files (default is main, module, exports fields in package.json)
   - Extract only exported declarations, excluding barrel re-exports
   - Find and report declarations without `@public` JSDoc tags

### Output Example

Shows check results in the following format:

```bash
npx docflow check
📝 core processing...
❌ core has missing JSDoc:
  - packages/core/index.ts:fetchData
  - packages/core/utils.ts:processData

📝 math processing...
✅ math has JSDoc for all exports
```

- ✅ When all exports have `@public` tags
- ❌ When there are exports missing JSDoc, shows file path and function name

## Configuration Options

### entryPoints

- **Type**: `string[]`
- **Default**: Auto-detected from main, module, exports in package.json
- **Description**: Entry point files to check. If not specified, automatically finds them from package.json.