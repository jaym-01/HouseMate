# HouseMate - Copilot Instructions

## Project Overview

HouseMate is a household management app designed to simplify living with roommates. The app handles rent/bill splitting, shared shopping lists with purchase rotation, and financial tracking over time.

### Core Features

1. **Rent & Bill Splitting**

   - Split rent and bills between housemates
   - Allow custom adjustments per person
   - Admin controls overall splits

2. **Shopping List & Purchase Rota**

   - Shared shopping list accessible to all housemates
   - Rotating purchase schedule (e.g., Person A buys toilet rolls, then Person B, etc.)
   - Tracks who's turn it is to buy each item

3. **Financial Aggregation & Balancing**

   - Costs aggregate over time
   - If someone buys an item out of turn, that cost is deducted from their rent and credited to the person whose turn it was
   - Monthly reset triggered by admin after paying landlord

4. **Admin Controls**

   - One admin per household
   - Controls splits, approves housemates, and manages settings
   - Triggers monthly reset

5. **User Management**
   - Create account and manage profile
   - Join/leave households
   - Update personal details

## Tech Stack

### Frontend

- **Framework**: React Native with Expo (~54.0.10)
- **Navigation**: Expo Router (file-based routing)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Language**: TypeScript with strict mode enabled
- **UI Components**: Custom components in `frontend/components/ui/`
- **Icons**: Lucide React Native

### Backend

- **Platform**: Firebase
- **Database**: Firestore
- **Authentication**: Firebase Auth
- **Location**: europe-west1
- **Local Development**: Firebase Emulators (Auth: 9099, Firestore: 9100, UI: 9101)

## Project Structure

```
HouseMate/
├── backend/
│   ├── firebase.json          # Firebase configuration
│   ├── firestore.rules        # Firestore security rules
│   └── firestore.indexes.json # Firestore indexes
├── frontend/
│   ├── app/                   # Expo Router pages
│   │   ├── _layout.tsx        # Root layout with navigation
│   │   ├── index.tsx          # Landing/home page
│   │   ├── +not-found.tsx     # 404 page
│   │   └── (tabs)/            # Tab-based navigation
│   │       ├── _layout.tsx
│   │       └── home.tsx
│   ├── components/
│   │   └── ui/                # Reusable UI components
│   ├── constants/             # App constants (colors, etc.)
│   ├── hooks/                 # Custom React hooks
│   ├── assets/                # Static assets (fonts, images)
│   ├── global.css             # Global Tailwind styles
│   ├── package.json
│   └── tsconfig.json
├── emulator.sh                # Android emulator launch script
├── requirements.txt           # Python dependencies (for backend scripts)
└── README.md
```

## Development Setup

### Prerequisites

- Node.js and npm
- Expo Go app on mobile device
- Firebase CLI (for emulators)
- Android emulator (optional, for testing)

### Getting Started

1. **Install Frontend Dependencies**

   ```bash
   cd frontend && npm i
   ```

2. **Run Frontend**

   ```bash
   npx expo start --tunnel
   ```

   Scan QR code with Expo Go app

3. **Run Firebase Emulators** (for local backend testing)
   ```bash
   firebase emulators:start
   ```
   Access emulator UI at http://localhost:9101

### Available Scripts

From `frontend/` directory:

- `npm start` - Start Expo with tunnel
- `npm run android` - Start on Android
- `npm run ios` - Start on iOS
- `npm run web` - Start web version
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Coding Standards

### General Guidelines

- **TypeScript**: Use strict mode (enabled in tsconfig.json)
- **Comments**: Only use comments for highlighting specific edge cases or non-obvious behavior. Code should be self-documenting through clear naming
- **Formatting**: Use Prettier (configured with Tailwind plugin)
- **Linting**: Follow ESLint rules (expo config + unused imports plugin)

### TypeScript

- Enable strict null checks
- No implicit any
- No implicit returns
- All types should be explicit

### React/React Native

- Use functional components with hooks
- Custom hooks in `frontend/hooks/`
- Component naming: PascalCase
- Props interface: ComponentNameProps

### Styling

- Use NativeWind (Tailwind) classes
- Colors defined in `frontend/constants/Colors.ts`
- Use `className` prop for styling
- Avoid inline styles unless necessary

### File Naming

- Components: PascalCase.tsx
- Hooks: camelCase.ts (prefixed with 'use')
- Utils/helpers: camelCase.ts
- Pages (Expo Router): lowercase.tsx or (group)/lowercase.tsx

### Path Aliases

- Use `@/` to reference from frontend root
- Example: `import { Button } from '@/components/ui/Button'`

### Code Organization & File Size

- **Keep files small and focused**: Each file should have a single, clear responsibility
- **Recommended maximum**: ~200-300 lines per file (excluding types/interfaces)
- **Split large components**: Extract sub-components, hooks, and utilities into separate files
- **Separate concerns**:
  - Business logic → custom hooks (e.g., `useShoppingRota.ts`)
  - Type definitions → separate `.types.ts` files
  - Utility functions → `utils/` or `lib/` directory
  - API/Firebase calls → `services/` or `api/` directory
  - Constants → `constants/` directory
- **Component structure**: If a component file exceeds 150-200 lines, consider:
  - Extracting child components to separate files
  - Moving hooks to dedicated files
  - Creating a component directory (e.g., `ShoppingList/` containing `index.tsx`, `ShoppingListItem.tsx`, `useShoppingList.ts`)
- **Readability over consolidation**: It's better to have multiple small, understandable files than one large, complex file

## Firebase/Firestore Guidelines

### Collections Structure (Recommended)

```
users/
  {userId}/
    - email
    - displayName
    - createdAt

households/
  {householdId}/
    - name
    - adminId
    - createdAt
    - members: []

  {householdId}/bills/
    {billId}/
      - name
      - amount
      - splits: {}
      - dueDate

  {householdId}/shoppingList/
    {itemId}/
      - name
      - rota: []
      - currentBuyerIndex
      - lastPurchase: {}

  {householdId}/transactions/
    {transactionId}/
      - type: 'purchase' | 'rent' | 'adjustment'
      - amount
      - buyerId
      - shouldHaveBeenBuyerId
      - timestamp
      - itemId (optional)
```

### Security

- Always use Firestore security rules (in `backend/firestore.rules`)
- Validate user permissions before operations
- Admin-only operations must check `adminId`

## Key Features Implementation Notes

### Shopping Rota Logic

- Track `currentBuyerIndex` on each shopping list item
- When item is purchased, increment index (modulo number of people in rota)
- If wrong person buys, create transaction record for adjustment

### Financial Aggregation

- All purchases create transaction records
- Calculate running balance per user
- On monthly reset (admin action):
  - Calculate final balances
  - Adjust rent splits accordingly
  - Archive transactions
  - Reset balances

### Admin Controls

- Admin role stored in household document
- Admin-only actions: edit splits, approve members, trigger reset
- UI should conditionally show admin features

## Testing & Debugging

### Frontend Testing

- Use Expo Go for quick testing on real devices
- Test on both iOS and Android when possible
- Use React DevTools for component debugging

### Backend Testing

- Use Firebase Emulators for local development
- Access emulator UI at http://localhost:9101
- Test security rules in emulator before deploying

### Common Issues

- **Metro bundler cache**: Run `npx expo start -c` to clear
- **TypeScript errors**: Check `tsconfig.json` paths
- **Firestore permissions**: Verify rules in emulator

## Feature Development Workflow

1. **Plan Data Model**: Determine Firestore collections/documents needed
2. **Create Security Rules**: Add/update `firestore.rules` for new data
3. **Build UI Components**: Create reusable components in `components/ui/`
4. **Create Pages**: Add screens in `app/` directory (Expo Router)
5. **Add Business Logic**: Implement in components or custom hooks
6. **Test Locally**: Use emulators and Expo Go
7. **Handle Edge Cases**: Document edge cases with comments when needed

## Important Considerations

- **Offline Support**: Consider Firestore offline persistence for better UX
- **Optimistic Updates**: Update UI before Firestore confirmation
- **Error Handling**: Always handle Firebase errors gracefully
- **Loading States**: Show loading indicators for async operations
- **Input Validation**: Validate on client and enforce with Firestore rules
- **Date Handling**: Use Firebase Timestamps for consistency
- **Currency**: Store amounts as numbers (cents) to avoid floating point issues
