# ClientPromptsShop - Agent Instructions

## Project Overview
ClientPromptsShop is an e-commerce Angular application for selling website prompts, templates, and design elements. It features a customer-facing storefront with shopping cart functionality and an admin panel for managing products, categories, orders, and site types.

## Tech Stack
- **Framework**: Angular 21.0.6 (standalone components)
- **UI Library**: PrimeNG 21.0.2 with Lara theme
- **Styling**: SCSS with custom CSS variables, Tailwind CSS 4.1.18
- **State Management**: RxJS 7.8.0 with BehaviorSubject and signals
- **HTTP**: Angular HttpClient with proxy configuration
- **Testing**: Jasmine + Karma
- **Build**: Angular CLI 21.0.4
- **TypeScript**: 5.9.2 (strict mode enabled)

## Project Structure
```
src/app/
├── admin/                    # Admin panel (lazy-loaded)
│   ├── admin-layout/        # Admin wrapper component
│   ├── components/          # Admin-specific components
│   └── admin.routes.ts      # Admin routing configuration
├── auth/                    # Route guards
│   └── admin-guard.ts       # Admin access control
├── components/              # Public-facing components
│   ├── auth/               # Authentication UI
│   ├── home/               # Landing page
│   ├── menu/               # Navigation menu
│   ├── main-category/      # Category listing
│   ├── sub-category/       # Product catalog
│   ├── orders/             # User order history
│   └── ...
├── models/                  # TypeScript interfaces/classes
├── services/                # Business logic & API calls
│   ├── authService/
│   ├── userService/
│   ├── productService/
│   ├── cartService/
│   └── ...
├── environments/            # Environment configurations
├── app.config.ts           # Application providers
├── app.routes.ts           # Main routing
└── app.ts                  # Root component
```

## Development Guidelines

### Component Architecture
- **All components are standalone** - import dependencies directly in component decorator
- Use `inject()` function for dependency injection (preferred over constructor injection)
- Use signals and computed signals for reactive state management
- Component naming: PascalCase class names (e.g., `Home`, `AdminDashboard`)
- File naming: kebab-case with component type suffix (e.g., `home.ts`, `home.html`, `home.scss`)

### Coding Standards
- **TypeScript**: Strict mode enabled - all types must be explicit
- **Quotes**: Single quotes for TypeScript, configured in .editorconfig
- **Indentation**: 2 spaces (enforced by .editorconfig)
- **Prettier**: Configured with 100 character line width
- **No implicit returns**: All functions must have explicit return types
- **Experimental decorators**: Enabled for Angular decorators

### Service Patterns
- Services use `providedIn: 'root'` for singleton instances
- API calls use `firstValueFrom()` for promise-based async operations
- State management via BehaviorSubject with `toSignal()` for component consumption
- Base URL pattern: `${environment.apiUrl}/[resource]`
- User authentication stored in localStorage as 'user_data'
- Services organized in dedicated folders: `services/[serviceName]/[service-name].ts`
- Always create both service file and spec file following naming convention

### Routing
- Main routes in `app.routes.ts`
- Admin routes lazy-loaded via `loadChildren`
- Admin routes protected by `adminGuard` (checks email === 'clicksite@gmail.com')
- 404 handled by wildcard route to `PageNotFound` component

### Styling
- Global styles in `src/styles.scss`
- Custom CSS variables defined in `:root` for PrimeNG theme customization
- Primary color: `#8139eb` (purple)
- Component-specific styles in `.scss` files alongside components
- PrimeIcons included globally via angular.json

## Environment Configuration
- **Development**: Uses `environment.development.ts`
  - API URL: `https://localhost:44371/api`
  - Google OAuth client ID configured
- **Production**: Uses `environment.ts`
  - Google client ID left empty for server configuration
- **Proxy**: API calls to `/api` proxied to `https://localhost:44371` (see proxy.conf.json)

## Initial Setup

### First Time Setup
```bash
npm install
```
**CRITICAL**: Always run `npm install` after cloning or when package.json changes. The project will not build without dependencies installed.

## Build & Development Commands

### Start Development Server
```bash
npm start
# or
ng serve
```
- Runs on port 5000 (configured in angular.json)
- Uses proxy configuration automatically
- Hot reload enabled

### Build for Production
```bash
npm run build
# or
ng build
```
- Output: `dist/` directory
- Budget limits: 1MB initial, 8kB per component style

### Run Tests
```bash
npm test
# or
ng test
```

### Watch Mode (Development Build)
```bash
npm run watch
```

## Key Implementation Details

### Admin Access
- Admin check: `userService.isAdmin()` returns true if email is 'clicksite@gmail.com'
- Admin routes: `/admin/*` (dashboard, products, orders, categories, settings)
- Guard prevents unauthorized access and redirects to home

### Authentication Flow
- Login/register via `UserService`
- User data persisted in localStorage
- Current user exposed as signal: `userService.currentUser()`
- Last email saved for convenience

### Cart System
- Cart items managed by `CartService`
- Uses BehaviorSubject for reactive updates
- Sidebar visibility controlled by service
- Cart synced to backend on user login

### API Integration
- All services use HttpClient
- Async operations return Promises via `firstValueFrom()`
- Error handling should be implemented in components
- Backend expects JSON payloads

## Common Pitfalls & Solutions

1. **Missing Dependencies**: Run `npm install` before any build/serve commands - build will fail without node_modules
2. **Import Errors**: Always import standalone components/modules in component decorator, not in separate module files
3. **Signal Updates**: Use `.set()` or `.update()` for writable signals, not direct assignment
4. **Route Guards**: Functional guards (CanActivateFn) are used, not class-based guards
5. **Environment Files**: Development environment is auto-swapped via fileReplacements in angular.json
6. **PrimeNG Components**: Must import both component module AND add to component imports array
7. **Proxy Configuration**: Backend must be running on https://localhost:44371 for API calls to work
8. **Directory Creation**: When creating new services/components in subdirectories, create the directory first using mkdir before creating files

## File Naming Conventions
- Components: `component-name.ts`, `component-name.html`, `component-name.scss`, `component-name.spec.ts`
- Services: `service-name.ts`, `service-name.spec.ts` (in dedicated folders)
- Models: `model-name-model.ts`
- Guards: `guard-name-guard.ts`

## Testing Notes
- Spec files generated alongside components
- Karma test runner configured
- Chrome launcher used for tests
- Coverage reports available

## Assets & Public Files
- Static assets: `public/` directory
- Images: `public/images/` (site screenshots, 404 pages, icons)
- Favicon and icons in `public/` root
- Assets automatically copied to build output
