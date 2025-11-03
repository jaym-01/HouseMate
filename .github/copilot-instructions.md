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

### Core Principles

**⚠️ SECURITY FIRST: Protecting user data is the highest priority. Every decision should consider security implications.**

When designing and implementing features, always prioritize:

1. **Data Security**: User information must be protected at all costs
2. **Privacy**: Only collect and access data that is necessary
3. **Authentication & Authorization**: Verify permissions before every operation
4. **Input Validation**: Never trust client input
5. **Secure Communication**: Use HTTPS, secure Firebase rules, and encrypted storage

### Architecture & Design Principles

Follow **SOLID principles** for maintainable, scalable code:

- **Single Responsibility Principle (SRP)**: Each module/class/function should have one clear purpose

  - Services handle Firebase operations
  - Hooks manage state and side effects
  - Components focus on UI rendering
  - Utils provide pure helper functions

- **Open/Closed Principle (OCP)**: Code should be open for extension, closed for modification

  - Use composition over inheritance
  - Design flexible interfaces
  - Abstract common patterns

- **Liskov Substitution Principle (LSP)**: Subtypes must be substitutable for their base types

  - Maintain consistent interfaces
  - Honor contracts in implementations

- **Interface Segregation Principle (ISP)**: Keep interfaces focused and specific

  - Create small, focused TypeScript interfaces
  - Don't force components to depend on unused props

- **Dependency Inversion Principle (DIP)**: Depend on abstractions, not concretions
  - Use dependency injection where appropriate
  - Abstract external dependencies (Firebase, etc.)

### Layered Architecture

Maintain clear separation of concerns across layers:

```
┌─────────────────────────────────────┐
│  UI Layer (Components)              │  ← Pure presentation, no business logic
├─────────────────────────────────────┤
│  State Management (Hooks)           │  ← Local state, side effects
├─────────────────────────────────────┤
│  Business Logic (Services/Hooks)    │  ← Application rules, calculations
├─────────────────────────────────────┤
│  Data Access (Firebase Services)    │  ← CRUD operations, authentication
├─────────────────────────────────────┤
│  External Services (Firebase)       │  ← Third-party integrations
└─────────────────────────────────────┘
```

**Layer Guidelines**:

- **UI Components**: Should receive data via props, emit events via callbacks. No direct Firebase calls.
- **Custom Hooks**: Manage component state, call services, handle side effects
- **Services**: Encapsulate all Firebase operations, handle errors, validate data
- **Types**: Shared interfaces and types in separate files
- **Utils**: Pure functions with no side effects

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

**🔒 Security is paramount. User data protection is non-negotiable.**

- Always use Firestore security rules (in `backend/firestore.rules`)
- Validate user permissions before operations
- Admin-only operations must check `adminId`
- Never trust client-side data - validate server-side
- Use Firebase Auth tokens for authentication
- Implement proper error handling that doesn't leak sensitive information
- Log security-relevant events for audit trails
- Regularly review and update security rules

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

**Always start with security and architecture in mind.**

1. **Plan Data Model**: Determine Firestore collections/documents needed

   - Consider data privacy and access patterns
   - Design for security by default

2. **Design Security Rules**: Add/update `firestore.rules` BEFORE implementing features

   - Who can read this data?
   - Who can write/update/delete?
   - What validation is needed?

3. **Design Architecture**: Plan the implementation across layers

   - What services are needed?
   - What hooks will manage state?
   - How will components receive data?
   - Apply SOLID principles

4. **Implement Services**: Create Firebase interaction layer

   - Encapsulate all data access
   - Handle errors gracefully
   - Validate inputs and outputs
   - Add TypeScript types

5. **Build Business Logic**: Create hooks for state and side effects

   - Keep components thin
   - Make logic testable
   - Handle loading and error states

6. **Build UI Components**: Create reusable components in `components/ui/`

   - Pure presentation logic
   - Receive data via props
   - Emit events via callbacks

7. **Create Pages**: Add screens in `app/` directory (Expo Router)

   - Compose components and hooks
   - Handle navigation
   - Manage page-level state

8. **Test Locally**: Use emulators and Expo Go

   - Test happy paths
   - Test error scenarios
   - Test security rules
   - Test edge cases

9. **Security Review**: Before marking complete
   - Review all data access points
   - Verify authentication checks
   - Test unauthorized access attempts
   - Ensure no data leaks in errors

## Development Progress Tracking

### Using app-plan.md for Development Direction

The `app-plan.md` file is the **single source of truth** for development progress and feature implementation. When asked to "continue building the app" or "implement the next feature", always follow this workflow:

#### 1. Check Current Progress

- **ALWAYS** read `app-plan.md` first to understand:
  - Current phase and task status
  - What has been completed (tasks marked with `[x]`)
  - What is in progress or next in line
  - Any noted blockers or issues
  - Testing scenarios to consider

#### 2. Identify Next Task

- Find the next unchecked task `[ ]` in the current phase
- If all tasks in a phase are complete, move to the next phase
- Review the task description and understand its requirements
- Check dependencies (some tasks may require previous tasks to be completed)

#### 3. Implement the Task

- **Security First**: Consider security implications before writing any code
- Follow the Feature Development Workflow (see section above)
- Apply SOLID principles to your design
- Maintain clear separation of concerns across layers
- Break large tasks into smaller sub-tasks if needed
- Adhere to all Coding Standards and guidelines
- Follow the Data Schema defined in app-plan.md

#### 4. Update Progress

After completing a task, **ALWAYS** update `app-plan.md`:

- Mark the completed task with `[x]`
- Update the "Last Updated" date
- Increment "Completed" count in Progress Tracking section
- Add any relevant notes to "Development Notes" section
- Document any blockers or issues encountered
- Update "Next Steps" with upcoming work

#### 5. Test and Verify

Before marking a task complete:

- Test the implementation locally
- Verify it meets the requirements
- Check for edge cases
- Ensure no regressions
- Verify TypeScript types are correct
- Run linting and formatting

### Task Completion Guidelines

When implementing tasks:

- **Complete entire tasks**: Don't partially implement a task unless explicitly blocked
- **Follow order**: Generally complete tasks in order within a phase, but use judgment for dependencies
- **Security first**: Always implement security considerations alongside features
- **Document edge cases**: If you discover edge cases not in the plan, document them
- **Update data schema**: If you need to modify the Firestore structure, update both app-plan.md and the code

### Progress Reporting

When you complete a task, provide a brief summary:

- What was implemented
- Files created or modified
- Any deviations from the plan (with justification)
- What task is next

Example:

```
✅ Completed Task 1.2: Firebase Auth integration
- Created auth service in frontend/services/auth.ts
- Implemented email/password authentication
- Added password reset functionality
- Added email verification

Next: Task 1.3 - Create user registration flow
```

### Handling Blockers

If you encounter a blocker:

1. Document it in app-plan.md under "Blockers & Issues"
2. Explain what's blocking progress
3. Suggest potential solutions or workarounds
4. Move to the next independent task if possible

### Multi-Session Development

The app-plan.md structure allows for seamless continuation across sessions:

- You can stop at any task and resume later
- The next LLM session can read the plan and continue where you left off
- Progress is always tracked and visible
- No context is lost between sessions

## Important Considerations

### Security & Privacy (Highest Priority)

- **🔒 User Data Protection**: Every feature must prioritize keeping user data safe
- **Authentication**: Verify user identity before any data access
- **Authorization**: Check permissions before every operation
- **Input Validation**: Validate on client AND enforce with Firestore rules
- **Sensitive Data**: Never log passwords, tokens, or personal information
- **Error Messages**: Don't expose system details or data in error messages
- **Audit Trails**: Log important security events (auth, data access, admin actions)

### Architecture & Code Quality

- **SOLID Principles**: Apply consistently across the codebase
- **Separation of Concerns**: Keep layers independent and focused
- **Single Responsibility**: Each file/function should have one clear purpose
- **Dependency Injection**: Make dependencies explicit and testable
- **Pure Functions**: Prefer pure functions for business logic
- **Immutability**: Avoid mutating state directly

### User Experience

- **Offline Support**: Consider Firestore offline persistence for better UX
- **Optimistic Updates**: Update UI before Firestore confirmation
- **Error Handling**: Always handle Firebase errors gracefully
- **Loading States**: Show loading indicators for async operations
- **Date Handling**: Use Firebase Timestamps for consistency
- **Currency**: Store amounts as numbers (cents) to avoid floating point issues
