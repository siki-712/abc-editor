# ABC Editor

A React component for editing ABC music notation with syntax highlighting, autocomplete, and real-time validation.

## Features

- **Syntax Highlighting**: Color-coded ABC notation elements
- **Line Numbers**: Clear visual reference for navigation
- **Autocomplete**: Smart suggestions for ABC notation commands and fields
- **Real-time Validation**: Measure beat count validation with visual feedback
- **Preview**: Live preview of music notation using abcjs
- **Error Highlighting**: Hover over validation errors to highlight the problematic measure

## Installation

```bash
npm install @ovnonvo/abc-editor
```

or

```bash
yarn add @ovnonvo/abc-editor
```

## Peer Dependencies

This package requires the following peer dependencies:

```json
{
  "react": "^18.0.0 || ^19.0.0",
  "react-dom": "^18.0.0 || ^19.0.0",
  "abcjs": "^6.0.0"
}
```

Install them if you haven't already:

```bash
npm install react react-dom abcjs
```

## Usage

### Basic Example

```tsx
import { useState } from 'react';
import { AbcEditor, AbcPreview } from '@ovnonvo/abc-editor';
// Import styles
import '@ovnonvo/abc-editor/styles.css';

function App() {
  const [abcCode, setAbcCode] = useState(`X:1
T:Untitled
M:4/4
K:C
C D E F | G A B c |`);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <AbcEditor value={abcCode} onChange={setAbcCode} />
      <AbcPreview value={abcCode} />
    </div>
  );
}

export default App;
```

**Important:** Don't forget to import the CSS file to get the proper styling!

### Components

#### `AbcEditor`

The main editor component with syntax highlighting and validation.

**Props:**
- `value` (string): The ABC notation code
- `onChange` ((value: string) => void): Callback when the code changes

**Features:**
- Line numbers
- Syntax highlighting
- Autocomplete (type `/` to trigger)
- Real-time validation
- Error display with hover highlighting

#### `AbcPreview`

Preview component that renders the ABC notation as sheet music.

**Props:**
- `value` (string): The ABC notation code to render

### Autocomplete

Type `/` followed by a command to trigger autocomplete:

- `/header` - Insert ABC header template
- `/note` - Insert note example
- `/chord` - Insert chord example
- `/measure` - Insert measure example

### Validation

The editor validates measure beat counts based on the time signature (M:) and unit note length (L:):

- Errors are displayed at the bottom of the editor
- Hover over an error to highlight the problematic measure
- Shows line number, measure number, and expected vs. actual beat count

### Hooks

#### `useLineNumbers(value: string): string`

Generates line numbers for the editor.

```tsx
import { useLineNumbers } from '@ovnonvo/abc-editor';

const lineNumbers = useLineNumbers(abcCode);
```

#### `useAbcAutoComplete(options)`

Provides autocomplete functionality for ABC notation.

```tsx
import { useAbcAutoComplete } from '@ovnonvo/abc-editor';

const {
  isOpen,
  suggestions,
  selectedIndex,
  position,
  handleKeyDown,
  selectSuggestion,
  handleMouseEnter,
} = useAbcAutoComplete({
  value: abcCode,
  textareaRef,
  onChange: setAbcCode,
});
```

### Utilities

#### `highlightAbc(code: string): string`

Returns syntax-highlighted HTML for ABC notation.

```tsx
import { highlightAbc } from '@ovnonvo/abc-editor';

const highlighted = highlightAbc('C D E F | G A B c |');
```

#### `validateAbc(code: string): ValidationError[]`

Validates ABC notation and returns errors.

```tsx
import { validateAbc } from '@ovnonvo/abc-editor';

const errors = validateAbc(abcCode);
```

### Types

```tsx
import type {
  AbcField,
  AbcFieldKey,
  ValidationError,
} from '@ovnonvo/abc-editor';
```

## Styling

The package includes pre-built CSS with all necessary styles. Simply import the CSS file as shown in the usage example:

```tsx
import '@ovnonvo/abc-editor/styles.css';
```

**Note:** You don't need to install or configure Tailwind CSS in your project. All styles are included in the package.

If you need custom styling, you can override the CSS variables defined in the stylesheet or add your own CSS rules.

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build library
npm run build

# Run tests
npm test
```

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Credits

Built with:
- [React](https://reactjs.org/)
- [abcjs](https://www.abcjs.net/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
