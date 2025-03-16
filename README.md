# List Creation and Management Application

[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-1.9.5-purple)](https://redux-toolkit.js.org/)
[![Styled Components](https://img.shields.io/badge/Styled_Components-6.0.8-pink)](https://styled-components.com/)

A modern React application for creating and managing lists with real-time updates and responsive design. Implements Redux Toolkit for state management and styled-components for UI styling.

## Key Features

- **API Integration**: Fetches initial lists from `https://apis.ccbp.in/list-creation/lists`
- **List Selection**: Choose exactly two lists to combine into a new list
- **Item Management**: Move items between lists using intuitive arrow controls
- **State Management**: Redux Toolkit for predictable state transitions
- **Responsive Design**: Grid layout adapts to screen sizes (mobile/tablet/desktop)
- **Error Handling**: Custom error states and retry functionality
- **Loading States**: Smooth loading indicators during API calls
- **Persistent Updates**: Maintains list state after creation/updates

## Technologies Used

- **React** (Functional Components & Hooks)
- **Redux Toolkit** (State Management)
- **Styled Components** (CSS-in-JS)
- **React Router** (Navigation)
- **JavaScript ES6+** (Modern Syntax)
- **Git** (Version Control)

## Installation & Setup

1. **Clone Repository**
```bash
git clone https://github.com/your-username/list-creation-app.git
cd list-creation-app
```

2. **Install Dependencies**
```bash
npm install
```

3. **Start Development Server**
```bash
npm start
```

4. **Build for Production**
```bash
npm run build
```

## Redux State Management

```javascript
{
  lists: {
    items: [],       // All available lists
    selected: [],    // Currently selected list IDs
    status: 'idle',  // API call status (idle/loading/succeeded/failed)
    error: null      // Error messages
  }
}
```

## API Integration

### List Creation Endpoint
`GET https://apis.ccbp.in/list-creation/lists`

**Data Transformation:**
```javascript
// Transforms API response into two initial lists
[
  {
    list_number: 1,
    items: evenIndexItems // First list contains even-indexed items
  },
  {
    list_number: 2,
    items: oddIndexItems  // Second list contains odd-indexed items
  }
]
```

## Key Components

### ListDirectory.js
- Main view showing all lists
- Handles list selection and creation
- Implements responsive grid layout
- Manages API loading/error states

### ListsDisplay.js
- List creation/editing interface
- Three-column layout (Source → New List → Target)
- Arrow controls for item movement
- Update/Cancel functionality

## Project Structure

```
src/
├── components/
│   ├── ListDirectory.js    # Main list display/selection
│   └── ListsDisplay.js     # List creation/editing interface
├── redux/
│   ├── listsSlice.js       # Redux Toolkit slice for list logic
│   └── store.js            # Redux store configuration
├── App.js                  # Root component
└── index.js                # Entry point
```

## Implementation Details

1. **Responsive Grid**  
   Dynamic columns based on screen size:
   - Mobile (2 column)
   - Tablet (2 columns)
   - Desktop (4 columns)

2. **List Creation Rules**
   - Requires exactly 2 selected lists
   - Shows error for invalid selections
   - Generates new list with sequential numbering

3. **Item Movement**  
   Deep copy state management:
   ```javascript
   const newState = JSON.parse(JSON.stringify(prev));
   // Item transfer logic between lists
   ```

## Deployment

Deployed using GitHub Pages:  
[Live Demo](https://dnitish07.github.io/list-manager/)


## Acknowledgements

NxtWave for API endpoints and design specifications  
Redux Toolkit documentation for state management patterns  
Styled Components team for CSS-in-JS solutions

