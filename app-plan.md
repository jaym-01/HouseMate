# Household Management App - Development Plan

## Project Overview

A household management app for splitting rent, bills, and shopping responsibilities with automatic cost balancing and rotation management.

## Tech Stack

- **Frontend**: Expo (React Native)
- **Backend**: Firebase (Local Development)
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Storage**: Firebase Storage (if needed for receipts/profiles)

---

## Development Phases

### Phase 1: Foundation & Authentication ⬜

**Goal**: Set up core infrastructure and user management

#### Tasks:

- [ ] **1.1** Configure Firebase initialization and environment variables
- [ ] **1.2** Implement Firebase Auth integration
  - [ ] Email/password authentication
  - [ ] Password reset functionality
  - [ ] Email verification
- [ ] **1.3** Create user registration flow
  - [ ] Input validation (email, password strength)
  - [ ] Error handling and user feedback
- [ ] **1.4** Create login flow
  - [ ] Remember me functionality
  - [ ] Secure token management
- [ ] **1.5** Build user profile management
  - [ ] View profile
  - [ ] Edit basic details (name, email, phone)
  - [ ] Profile picture upload (optional)
- [ ] **1.6** Implement authentication state persistence
- [ ] **1.7** Create protected route navigation

**Security Considerations**:

- Implement proper password validation (min 8 chars, complexity)
- Use Firebase Auth security rules
- Sanitize all user inputs
- Implement rate limiting for auth attempts

---

### Phase 2: Household & User Management ⬜

**Goal**: Create household structure with admin controls

#### Tasks:

- [ ] **2.1** Design Firestore data model (see Data Schema section)
- [ ] **2.2** Implement household creation
  - [ ] Admin automatically assigned on creation
  - [ ] Generate unique household codes
- [ ] **2.3** Build household joining mechanism
  - [ ] Join by code/invite link
  - [ ] Approval system (admin approves new members)
- [ ] **2.4** Create household member list view
  - [ ] Display all members with roles
  - [ ] Show admin badge
- [ ] **2.5** Implement admin controls
  - [ ] Transfer admin role
  - [ ] Remove members
  - [ ] Edit household details
- [ ] **2.6** Add member management for non-admins
  - [ ] View-only access to member list
- [ ] **2.7** Implement leave household functionality

**Security Considerations**:

- Implement Firestore security rules for household access
- Only admin can modify household settings
- Validate household codes server-side
- Prevent unauthorized member removal

---

### Phase 3: Rent & Bill Splitting ⬜

**Goal**: Enable automatic splitting of recurring costs

#### Tasks:

- [ ] **3.1** Create rent/bill entry interface (admin only)
  - [ ] Bill name, amount, due date
  - [ ] Bill category (rent, utilities, internet, etc.)
- [ ] **3.2** Implement custom split allocation
  - [ ] Equal split option
  - [ ] Custom percentages per person
  - [ ] Custom fixed amounts per person
  - [ ] Validation (splits must equal 100%)
- [ ] **3.3** Build bill overview dashboard
  - [ ] Current bills and amounts owed
  - [ ] Per-person breakdown
- [ ] **3.4** Create bill history view
  - [ ] Past bills with payment status
  - [ ] Filter by date/category
- [ ] **3.5** Implement bill editing (admin only)
- [ ] **3.6** Add bill deletion with confirmation (admin only)
- [ ] **3.7** Create notification system for upcoming bills

**Security Considerations**:

- Only admin can create/edit/delete bills
- Validate all numerical inputs
- Prevent negative amounts
- Audit log for bill changes

---

### Phase 4: Shopping List & Rota System ⬜

**Goal**: Collaborative shopping with automatic rotation

#### Tasks:

- [ ] **4.1** Create shopping list interface
  - [ ] Add items (any member)
  - [ ] Item name, estimated cost
  - [ ] Category/tags
- [ ] **4.2** Implement item editing and deletion
  - [ ] Edit by any member
  - [ ] Delete with confirmation
- [ ] **4.3** Build shopping rota system
  - [ ] Assign rota order (admin sets initial order)
  - [ ] Display current person's turn per item
  - [ ] Visual indicator of whose turn it is
- [ ] **4.4** Implement rota rotation logic
  - [ ] Auto-rotate after purchase
  - [ ] Manual rotation override (admin)
- [ ] **4.5** Create purchase marking system
  - [ ] Mark item as purchased
  - [ ] Enter actual cost
  - [ ] Add receipt photo (optional)
  - [ ] Log who purchased and when
- [ ] **4.6** Build purchase history view
  - [ ] Filter by item, person, date
  - [ ] Running totals per person

**Security Considerations**:

- All members can add/edit shopping items (by design)
- Validate cost inputs
- Prevent duplicate simultaneous purchases
- Audit trail for all purchases

---

### Phase 5: Cost Balancing System ⬜

**Goal**: Track out-of-turn purchases and adjust monthly settlements

#### Tasks:

- [ ] **5.1** Design balance calculation algorithm
  - [ ] Track expected vs actual purchases per person
  - [ ] Calculate credit/debit for each member
- [ ] **5.2** Implement real-time balance tracking
  - [ ] Update balances on each purchase
  - [ ] Display running totals
- [ ] **5.3** Create balance dashboard
  - [ ] Show who owes what
  - [ ] Show who is owed
  - [ ] Net position for each member
- [ ] **5.4** Build monthly settlement view
  - [ ] Breakdown of all transactions
  - [ ] Final amounts owed/owed to each person
- [ ] **5.5** Implement rent adjustment logic
  - [ ] Automatically calculate adjusted rent amounts
  - [ ] Show original rent vs adjusted rent
- [ ] **5.6** Create monthly reset functionality (admin only)
  - [ ] Confirmation dialog with summary
  - [ ] Archive previous month's data
  - [ ] Reset all balances to zero
  - [ ] Log settlement date
- [ ] **5.7** Build settlement history
  - [ ] View past month settlements
  - [ ] Export functionality (CSV/PDF)

**Security Considerations**:

- Only admin can trigger monthly reset
- Prevent accidental double resets
- Maintain immutable settlement history
- Validate all calculations server-side

---

### Phase 6: UI/UX & Polish ⬜

**Goal**: Create intuitive, accessible interface

#### Tasks:

- [ ] **6.1** Design consistent component library
  - [ ] Buttons, inputs, cards
  - [ ] Color scheme and typography
- [ ] **6.2** Implement navigation structure
  - [ ] Bottom tab navigation
  - [ ] Stack navigation for details
- [ ] **6.3** Create dashboard/home screen
  - [ ] Summary of key info
  - [ ] Quick actions
- [ ] **6.4** Add loading states and skeletons
- [ ] **6.5** Implement error handling UI
  - [ ] User-friendly error messages
  - [ ] Retry mechanisms
- [ ] **6.6** Add empty states
  - [ ] Helpful messages for empty lists
  - [ ] Call-to-action buttons
- [ ] **6.7** Implement pull-to-refresh
- [ ] **6.8** Add confirmation dialogs for destructive actions
- [ ] **6.9** Optimize for both iOS and Android
- [ ] **6.10** Implement dark mode (optional)

---

### Phase 7: Notifications & Reminders ⬜

**Goal**: Keep users informed of important events

#### Tasks:

- [ ] **7.1** Set up Firebase Cloud Messaging
- [ ] **7.2** Implement push notification permissions
- [ ] **7.3** Create notification triggers
  - [ ] Bill due reminders
  - [ ] Your turn to buy item
  - [ ] New member joined
  - [ ] Monthly settlement completed
- [ ] **7.4** Build in-app notification center
- [ ] **7.5** Add notification preferences
  - [ ] Allow users to customize notifications

---

### Phase 8: Testing & Security Hardening ⬜

**Goal**: Ensure app is secure, stable, and performant

#### Tasks:

- [ ] **8.1** Write Firestore security rules
  - [ ] Test all access patterns
  - [ ] Prevent unauthorized data access
- [ ] **8.2** Implement comprehensive input validation
  - [ ] Client-side validation
  - [ ] Server-side validation (Cloud Functions)
- [ ] **8.3** Add error logging and monitoring
  - [ ] Firebase Crashlytics
  - [ ] Error reporting
- [ ] **8.4** Perform security audit
  - [ ] Check for common vulnerabilities
  - [ ] Test authentication flows
  - [ ] Verify data access permissions
- [ ] **8.5** Write unit tests for critical functions
  - [ ] Balance calculations
  - [ ] Rota rotation logic
  - [ ] Split calculations
- [ ] **8.6** Perform integration testing
  - [ ] Test complete user flows
  - [ ] Test multi-user scenarios
- [ ] **8.7** Conduct user acceptance testing
- [ ] **8.8** Performance optimization
  - [ ] Reduce unnecessary re-renders
  - [ ] Optimize Firestore queries
  - [ ] Image optimization

---

## Data Schema (Firestore)

```
users/
  {userId}/
    - email: string
    - displayName: string
    - createdAt: timestamp
    - householdId: string (nullable)
    - profilePicture: string (url, optional)

households/
  {householdId}/
    - name: string
    - adminId: string
    - inviteCode: string
    - createdAt: timestamp
    - members: array<string> (userIds)
    - memberDetails: map<userId, {name, joinedAt}>

bills/
  {billId}/
    - householdId: string
    - name: string
    - amount: number
    - category: string
    - dueDate: timestamp
    - splits: map<userId, {amount, percentage}>
    - createdBy: string (userId)
    - createdAt: timestamp
    - updatedAt: timestamp
    - isRecurring: boolean
    - status: string (active/paid/archived)

shoppingItems/
  {itemId}/
    - householdId: string
    - name: string
    - estimatedCost: number
    - category: string
    - rotaOrder: array<string> (userIds)
    - currentTurnIndex: number
    - createdAt: timestamp
    - isActive: boolean

purchases/
  {purchaseId}/
    - householdId: string
    - itemId: string
    - itemName: string
    - purchasedBy: string (userId)
    - expectedBy: string (userId - whose turn it was)
    - actualCost: number
    - purchaseDate: timestamp
    - receiptUrl: string (optional)
    - settlementId: string (nullable)

balances/
  {householdId}/
    - members: map<userId, {
        totalPurchased: number,
        expectedPurchases: number,
        netBalance: number (negative = owes, positive = owed),
        lastUpdated: timestamp
      }>
    - currentPeriodStart: timestamp

settlements/
  {settlementId}/
    - householdId: string
    - periodStart: timestamp
    - periodEnd: timestamp
    - settledBy: string (userId - admin)
    - settledAt: timestamp
    - finalBalances: map<userId, {
        totalPurchased: number,
        expectedPurchases: number,
        netBalance: number,
        adjustedRent: number
      }>
    - totalTransactions: number
```

---

## Security Checklist

### Authentication & Authorization

- [ ] Implement strong password requirements
- [ ] Use Firebase Auth security best practices
- [ ] Implement proper session management
- [ ] Add rate limiting for sensitive operations
- [ ] Verify email addresses

### Data Access Control

- [ ] Write comprehensive Firestore security rules
- [ ] Ensure users can only access their household data
- [ ] Verify admin permissions server-side
- [ ] Prevent privilege escalation
- [ ] Implement proper data validation

### Input Validation

- [ ] Sanitize all user inputs
- [ ] Validate numerical inputs (no negative amounts)
- [ ] Prevent injection attacks
- [ ] Limit file upload sizes and types
- [ ] Validate split percentages sum to 100%

### Data Protection

- [ ] Never expose sensitive data in client code
- [ ] Use HTTPS for all communications (Firebase default)
- [ ] Implement proper error handling (don't leak info)
- [ ] Securely store any API keys
- [ ] Regular security audits

---

## Feature Priority Matrix

**Must Have (MVP)**:

1. User authentication and profiles
2. Household creation and joining
3. Rent/bill splitting with custom splits
4. Shopping list (basic)
5. Balance tracking and monthly reset

**Should Have (V1)**: 6. Shopping rota system 7. Purchase history 8. Balance adjustment for out-of-turn purchases 9. Admin controls for member management

**Nice to Have (V2+)**: 10. Push notifications 11. Receipt photo uploads 12. Settlement history export 13. Dark mode 14. Analytics dashboard

---

## Development Notes

**Current Phase**: Phase 1 - Foundation & Authentication
**Last Updated**: [Date]
**Completed Tasks**: 0/XX

### Progress Tracking

- Total tasks defined: ~100+
- Completed: 0
- In Progress: 0
- Blocked: 0

### Blockers & Issues

- None currently

### Next Steps

1. Begin Phase 1: Configure Firebase and implement authentication
2. Test auth flows thoroughly before moving to Phase 2
3. Set up basic navigation structure

---

## Testing Scenarios to Cover

1. **Multi-user purchase conflicts**: What happens if two people mark the same item as purchased simultaneously?
2. **Admin leaves household**: What happens if the admin leaves? Auto-promote next member?
3. **Balance edge cases**: Test with negative balances, zero balances, equal contributions
4. **Rota with varying member counts**: Test adding/removing members mid-cycle
5. **Settlement during active purchases**: What happens if someone makes a purchase during settlement?
6. **Offline functionality**: Handle offline mode gracefully with proper sync

---

## Future Enhancements (Post-Launch)

- Receipt scanning with OCR
- Integration with payment apps (Venmo, PayPal)
- Recurring bill templates
- Budget tracking and analytics
- Multiple household support per user
- Shared calendar for household events
- Automated bill reminders via SMS/email
- Split payment requests

---

**How to Use This Document**:

1. Check off tasks using `[x]` as you complete them
2. Update "Last Updated" date after each session
3. Add notes in "Development Notes" section
4. Track blockers and dependencies
5. Use this as a reference for LLM to pick up where you left off
