# docflow check

Finds and reports exported functions, classes, interfaces, and types that are missing `@public` JSDoc tags or have incomplete `@param`/`@property`/`@returns` documentation.

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

The `check` command examines exported declarations in each package and reports:

- Declarations missing `@public` tags
- Functions with missing or extraneous `@param` tags
- Interfaces, type aliases, and object literals with missing or extraneous `@property` tags
- Functions with missing `@returns` tags or mismatched return types

### Validation Targets

The following declaration types are validated:

- **Function declarations** (`function`, arrow functions, function expressions): Validates `@param` and `@returns` tags.
- **Interfaces** (`interface`): Validates `@property` tags for properties and methods.
- **Type aliases** (`type`): Validates `@property` tags for properties in object type literals.
- **Object literals** (`const obj = { ... }`): Validates `@property` tags for properties.

### Internal Process

The internal procedure when the `docflow check` command is executed is as follows:

1. **Load Configuration File**: Read project settings from the `docflow.config.js` file.
2. **Explore Workspace Packages**: Find target packages according to configured include/exclude patterns.
3. **Process Each Package**:
   - Load TypeScript configuration and parse source files
   - Filter only entry point files (default is main, module, exports fields in package.json)
   - Extract only exported declarations, excluding barrel re-exports
   - Find and report declarations without `@public` JSDoc tags
   - For declarations with `@public` tags, validate `@param`/`@property` and `@returns` tags

### Output Example

Shows check results in the following format:

```bash
npx docflow check
📝 core processing...
❌ core has missing JSDoc:
  - packages/core/index.ts:fetchData - missing @public
  - packages/core/utils.ts:processData - missing @param for 'input'
  - packages/core/utils.ts:processData - missing @returns
  - packages/core/types.ts:Config - missing @property for 'host'

📝 math processing...
✅ math has JSDoc for all exports
```

- ✅ When all exports have `@public` tags and pass `@param`/`@property`/`@returns` validation
- ❌ When there are issues, shows file path, symbol name, and error message

### Error Types

| Error                            | Description                                                                 |
| -------------------------------- | --------------------------------------------------------------------------- |
| `missing @public`                | The `@public` tag is missing.                                               |
| `missing @param for '<name>'`    | A `@param` tag is missing for a function parameter that exists in code.     |
| `unused @param '<name>'`         | A `@param` tag exists for a function parameter that does not exist in code. |
| `missing @property for '<name>'` | A `@property` tag is missing for a property that exists in code.            |
| `unused @property '<name>'`      | A `@property` tag exists for a property that does not exist in code.        |
| `missing @returns`               | The function is missing a `@returns` tag.                                   |
| `Expected <type>, got <type>`    | The `@returns` tag type does not match the actual return type.              |

## Configuration Options

### entryPoints

- **Type**: `string[]`
- **Default**: Auto-detected from main, module, exports in package.json
- **Description**: Entry point files to check. If not specified, automatically finds them from package.json.
