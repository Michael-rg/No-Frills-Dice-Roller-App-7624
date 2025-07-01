# 🎲 No Frills Dice - Complete Project Requirements

## Project Overview
A modern, interactive dice rolling application built with React, featuring 3D animations, dark mode, and responsive design. Users can roll 1-12 dice, hold specific dice, and enjoy premium visual feedback.

## Technical Stack Requirements

### Core Technologies
- **Framework**: React 18.3.1 (JSX components only)
- **Build Tool**: Vite 5.4.2
- **Styling**: Tailwind CSS 3.4.17
- **Animations**: Framer Motion 11.0.8
- **Icons**: React Icons 5.4.0 (Feather Icons specifically)
- **Node.js**: ES Modules (type: "module")

### Development Dependencies
- **ESLint**: 9.9.1 with React hooks plugin
- **PostCSS**: 8.4.49 with Autoprefixer 10.4.20
- **Vite React Plugin**: 4.3.1

## File Structure Requirements

```
project/
├── src/
│   ├── components/
│   │   ├── Dice.jsx
│   │   ├── DiceGrid.jsx
│   │   ├── Controls.jsx
│   │   └── DarkModeToggle.jsx
│   ├── common/
│   │   └── SafeIcon.jsx
│   ├── hooks/
│   │   └── useDarkMode.js
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── scripts/
│   ├── backup.js
│   ├── restore.js
│   ├── list-backups.js
│   └── clean-backups.js
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
└── .gitignore
```

## Functional Requirements

### 1. Dice Management
- **Dice Count**: Support 1-12 dice simultaneously
- **Dice Values**: Standard 6-sided dice (1-6 dots)
- **Initial State**: Random values on load
- **Grid Layout**: Maximum 4 dice per row, responsive wrapping

### 2. Rolling Mechanics
- **Individual Roll**: Roll only non-held dice
- **Roll All**: Reset all holds and roll all dice
- **Animation Duration**: 800ms rolling animation
- **Animation Disable**: No interaction during rolling
- **Random Generation**: Math.floor(Math.random() * 6) + 1

### 3. Hold System
- **Click to Hold**: Toggle hold state by clicking dice
- **Visual Indicator**: Blue background and corner indicator for held dice
- **Hold Persistence**: Held dice maintain values during rolls
- **Hold Reset**: "Roll All" clears all holds

### 4. User Interface Requirements

#### Color Scheme
- **Primary Blue**: #007AFF (iOS system blue)
- **Light Mode**: Blue-50 to Indigo-100 gradient background
- **Dark Mode**: Gray-900 to Gray-800 gradient background
- **Component Backgrounds**: White (light) / Gray-800 (dark)

#### Typography
- **Font**: System font stack (-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto)
- **Title**: 2xl/3xl font size, bold weight
- **Subtitle**: Small text, gray-600/gray-300
- **Buttons**: Semibold weight, appropriate sizing

#### Spacing & Layout
- **Container**: Max-width 28rem (448px) for main content
- **Dice Size**: 56x56px mobile, 64x64px desktop
- **Dice Gap**: 12px between dice
- **Component Gap**: 16px between major sections
- **Padding**: 16px page padding

### 5. Responsive Design Requirements

#### Breakpoints
- **Mobile**: < 640px (sm breakpoint)
- **Desktop**: ≥ 640px

#### Mobile Adaptations
- **Title**: 2xl font size
- **Dice**: 56x56px (14x14 Tailwind units)
- **Dots**: 8x8px (2x2 Tailwind units)
- **Button Layout**: Stacked vertically
- **Grid**: 6 columns for dice count selector

#### Desktop Adaptations
- **Title**: 3xl font size
- **Dice**: 64x64px (16x16 Tailwind units)  
- **Dots**: 10x10px (2.5x2.5 Tailwind units)
- **Button Layout**: Side by side
- **Grid**: Same 6 columns maintained

## Visual Requirements

### 1. Dice Appearance
- **Shape**: Rounded rectangles (rounded-lg)
- **3D Effect**: Layered shadows creating depth illusion
- **Border**: 2px solid border
- **Colors**: White background, gray border (light mode)
- **Hover Effect**: Elevated shadow, slight scale increase

#### Dot Patterns (Exact Positions)
```javascript
// 9-position grid system (0-8 indices)
const dotPositions = [
  'top-0.5 left-0.5',        // 0: top-left
  'top-0.5 left-1/2 -translate-x-1/2',     // 1: top-center  
  'top-0.5 right-0.5',       // 2: top-right
  'top-1/2 left-0.5 -translate-y-1/2',     // 3: middle-left
  'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2', // 4: center
  'top-1/2 right-0.5 -translate-y-1/2',    // 5: middle-right
  'bottom-0.5 left-0.5',     // 6: bottom-left
  'bottom-0.5 left-1/2 -translate-x-1/2',  // 7: bottom-center
  'bottom-0.5 right-0.5'     // 8: bottom-right
];

// Patterns for each face
const patterns = {
  1: [4],           // center only
  2: [0, 8],        // diagonal corners
  3: [0, 4, 8],     // diagonal line
  4: [0, 2, 6, 8],  // four corners
  5: [0, 2, 4, 6, 8], // corners + center
  6: [0, 1, 2, 6, 7, 8] // two columns
};
```

### 2. Animation Requirements

#### Rolling Animation
- **Duration**: 800ms
- **Easing**: "easeOut"
- **Rotation**: Multi-axis rotation (X, Y, Z)
- **Keyframes**: [0°, 360°, 720°, 1080°] for X-axis
- **Timing**: [0, 0.3, 0.6, 1.0] distribution

#### Interactive Animations
- **Hover**: 1.05x scale, enhanced shadow
- **Tap**: 0.95x scale feedback
- **Hold Indicator**: Scale from 0 to 1 on activation

#### Page Load Animations
- **Stagger**: 0.1s delay between components
- **Initial**: Opacity 0, slight Y offset
- **Final**: Opacity 1, normal position

### 3. Dark Mode Requirements

#### Implementation
- **Storage**: localStorage persistence
- **System**: Respect prefers-color-scheme
- **Toggle**: Fixed top-right position
- **Animation**: Smooth 300ms transitions

#### Color Mappings
```css
/* Light Mode */
background: from-blue-50 to-indigo-100
text: gray-800
components: white bg, gray-200 borders

/* Dark Mode */  
background: from-gray-900 to-gray-800
text: white
components: gray-800 bg, gray-700 borders
```

## Component Specifications

### 1. App.jsx (Main Component)
- **State Management**: 
  - numDice: number (1-12)
  - dice: array of {id, value} objects
  - heldDice: Set of dice IDs
  - isRolling: boolean
- **Effects**: Re-initialize dice when count changes
- **Layout**: Centered flex column with max-width container

### 2. Dice.jsx (Individual Die)
- **Props**: value, isHeld, isRolling, onClick
- **3D Styling**: transform-style: preserve-3d
- **Dot Rendering**: Absolute positioned circles
- **Hold Indicator**: Blue corner badge with white dot

### 3. DiceGrid.jsx (Dice Container)
- **Layout**: Rows of maximum 4 dice each
- **Grouping**: Array chunking into rows
- **Animation**: Staggered appearance (0.1s per row)
- **Centering**: Flex justify-center for each row

### 4. Controls.jsx (Interface Panel)
- **Dice Selector**: 6-column grid of number buttons
- **Action Buttons**: Roll and Roll All with icons
- **State Handling**: Disable during rolling animations
- **Responsive**: Stack buttons vertically on mobile

### 5. DarkModeToggle.jsx (Theme Switcher)
- **Position**: Fixed top-right with z-50
- **Icons**: Sun (light mode), Moon (dark mode)
- **Animation**: 180° rotation on toggle
- **Styling**: Gradient backgrounds matching theme

### 6. SafeIcon.jsx (Icon Wrapper)
- **Purpose**: Safe icon rendering with fallback
- **Fallback**: FiAlertTriangle if icon fails
- **Support**: React.createElement for dynamic icons
- **Error Handling**: Try-catch around icon resolution

### 7. useDarkMode.js (Theme Hook)
- **Storage**: localStorage with 'darkMode' key
- **System Detection**: window.matchMedia for preference
- **DOM Manipulation**: Add/remove 'dark' class on html
- **Return**: [isDark, toggleDarkMode] tuple

## Performance Requirements

### 1. Animation Performance
- **GPU Acceleration**: transform-gpu class usage
- **Efficient Updates**: useCallback for event handlers
- **Minimal Re-renders**: Proper dependency arrays

### 2. Bundle Size
- **Icon Loading**: Destructured imports only
- **Tree Shaking**: ES module compatible exports
- **Code Splitting**: Component-level separation

### 3. Runtime Performance
- **Dice Updates**: Immutable state updates
- **Hold System**: Set data structure for O(1) lookups
- **Random Generation**: Efficient Math.random usage

## Accessibility Requirements

### 1. Keyboard Navigation
- **Focus Management**: Visible focus indicators
- **Tab Order**: Logical navigation sequence
- **Enter/Space**: Button activation support

### 2. Screen Readers
- **Semantic HTML**: Proper button and label elements
- **ARIA Labels**: Descriptive button text
- **State Announcement**: Hold state communication

### 3. Visual Accessibility
- **Color Contrast**: WCAG AA compliance
- **Focus Indicators**: High contrast outlines
- **Text Sizing**: Scalable font units

## Browser Support Requirements

### Minimum Supported Versions
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Required Features
- **CSS Grid**: Layout system
- **CSS Custom Properties**: Theme variables
- **ES Modules**: Native module support
- **Flexbox**: Component layouts

## Build Requirements

### 1. Development Server
- **Command**: `npm run dev`
- **Port**: Auto-assigned by Vite
- **Hot Reload**: Instant component updates
- **Error Overlay**: Development error display

### 2. Production Build
- **Command**: `npm run build`
- **Output**: `dist/` directory
- **Optimization**: Minification, tree-shaking
- **Assets**: Optimized images and fonts

### 3. Linting
- **Command**: `npm run lint`
- **Rules**: React hooks, unused variables
- **Integration**: Pre-build linting check

## Backup System Requirements

### 1. Backup Creation
- **Command**: `npm run backup [description]`
- **Includes**: src/, config files, index.html
- **Format**: Timestamped folders
- **Metadata**: JSON info file with details

### 2. Backup Management
- **List**: `npm run list-backups` with sizes and dates
- **Restore**: `npm run restore` with interactive selection
- **Cleanup**: `npm run clean-backups` with retention options

### 3. Backup Structure
```
backups/
├── backup-2024-01-15T10-30-00/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── backup-info.json
```

## Security Requirements

### 1. Dependency Security
- **Source**: npm registry only
- **Versions**: Pinned major versions
- **Auditing**: Regular security audits

### 2. Build Security
- **CSP**: Content Security Policy headers
- **HTTPS**: Secure protocol in production
- **Sanitization**: No user input processing

## Testing Requirements

### 1. Manual Testing Checklist
- [ ] All dice counts (1-12) work correctly
- [ ] Rolling animations complete properly
- [ ] Hold system toggles correctly
- [ ] Dark mode persists across sessions
- [ ] Responsive design works on mobile/desktop
- [ ] All buttons disabled during rolling
- [ ] Random values generate correctly

### 2. Browser Testing
- [ ] Chrome desktop/mobile
- [ ] Firefox desktop/mobile  
- [ ] Safari desktop/mobile
- [ ] Edge desktop

### 3. Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility
- [ ] High contrast mode support
- [ ] Focus indicators visible

## Documentation Requirements

### 1. Code Documentation
- **Comments**: Complex logic explanation
- **PropTypes**: Component interface documentation
- **README**: Setup and usage instructions

### 2. User Documentation
- **Interface**: Intuitive, self-explanatory design
- **Tooltips**: Helpful hover text where needed
- **Error States**: Clear feedback for issues

## Deployment Requirements

### 1. Static Hosting
- **Compatibility**: Any static host (Netlify, Vercel, etc.)
- **Base Path**: Configurable via Vite base option
- **Assets**: Relative path references

### 2. Environment
- **Node.js**: 16+ for development
- **Build Output**: Standard static files
- **CDN**: Compatible with content delivery networks

## Future Enhancement Considerations

### 1. Potential Features
- **Sound Effects**: Roll and hold audio feedback
- **Statistics**: Roll history and analytics
- **Themes**: Additional color schemes
- **Dice Types**: D4, D8, D10, D12, D20 support

### 2. Technical Improvements
- **PWA**: Progressive Web App capabilities
- **Offline**: Service worker implementation
- **Performance**: Further optimization opportunities

## Quality Assurance Standards

### 1. Code Quality
- **Consistency**: Uniform formatting and style
- **Modularity**: Single responsibility components
- **Reusability**: Generic, composable components
- **Maintainability**: Clear, readable code

### 2. User Experience
- **Responsiveness**: < 100ms interaction feedback
- **Smoothness**: 60fps animations
- **Intuitiveness**: No learning curve required
- **Polish**: Premium feel and finish