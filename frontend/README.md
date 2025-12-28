# Frontend - Image Gallery Site

## Overview

This is the frontend application for the Image Gallery Site, built as part of a 15-day onboarding course. The frontend provides a responsive, modern interface for browsing and managing images with infinite scroll loading.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: TailwindCSS
- **State Management**: Redux Toolkit
- **Code Quality**: Prettier, ESLint, Husky
- **API Integration**: Swagger auto-generated types
- **Deployment**: Vercel

## Features

### User Interface

- Responsive design (mobile, tablet, desktop)
- Modern and clean UI with TailwindCSS
- Infinite scroll loading for images
- Image CRUD operations

### Developer Experience

- Type-safe API integration with Swagger
- Pre-commit hooks with Husky
- Code formatting with Prettier
- Linting with ESLint

### State Management

- Centralized state with Redux Toolkit
- Efficient data caching and updates

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

## Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env.local
```

Configure the following environment variables in `.env.local`:

```env
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=https://misti-clergylike-brain.ngrok-free.dev

# Optional: Google OAuth Client ID (if using Google authentication)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

3. Generate API types from Swagger:

```bash
npm run generate:api-types
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication routes
│   ├── (gallery)/         # Gallery routes
│   └── layout.tsx         # Root layout
├── components/             # React components
│   ├── ui/                # Reusable UI components
│   ├── gallery/           # Gallery-specific components
│   └── auth/              # Authentication components
├── lib/                    # Utilities and configurations
│   ├── api/               # API client and types (Swagger-generated)
│   └── store/             # Redux store configuration
├── hooks/                  # Custom React hooks
├── styles/                 # Global styles and Tailwind config
└── public/                 # Static assets
```

## Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint

# Format code
npm run format

# Type checking
npm run type-check

# Generate API types from Swagger
npm run generate:api-types
```

### Code Quality Tools

#### Prettier

Code formatting is handled by Prettier. Format your code with:

```bash
npm run format
```

#### ESLint

Linting is configured with ESLint. Check for issues:

```bash
npm run lint
```

#### Husky

Pre-commit hooks are set up with Husky to ensure:

- Code is formatted with Prettier
- Linting passes before commits
- Type checking is performed

## State Management

The application uses Redux Toolkit for state management. The store is organized by feature:

```typescript
// Example store structure
store/
├── slices/
│   ├── authSlice.ts      # Authentication state
│   ├── imageSlice.ts     # Image gallery state
│   └── uiSlice.ts        # UI state (modals, loading, etc.)
└── store.ts              # Store configuration
```

## API Integration

API types are automatically generated from the backend Swagger documentation:

1. Ensure the backend is running with Swagger enabled
2. Run the type generation script:

```bash
npm run generate:api-types
```

This will fetch the Swagger schema and generate TypeScript types for all API endpoints.

## Styling

The project uses TailwindCSS for styling. Configuration is in `tailwind.config.js`.

### Responsive Design

The application is fully responsive with breakpoints:

- Mobile: Default (< 640px)
- Tablet: `sm:` (640px+)
- Desktop: `md:` (768px+)
- Large Desktop: `lg:` (1024px+)

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

The application will automatically deploy on every push to the main branch.

### Environment Variables for Production

Make sure to set these in your Vercel project settings:

- `NEXT_PUBLIC_BACKEND_URL` - Backend API URL (e.g., `https://misti-clergylike-brain.ngrok-free.dev`)
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth Client ID (optional)

## Features Implementation

### Infinite Scroll Loading

Images are loaded progressively using infinite scroll. The implementation:

- Uses Intersection Observer API
- Integrates with Redux for state management
- Handles loading and error states

### Image CRUD Operations

Full CRUD functionality for images:

- **Create**: Upload new images
- **Read**: Browse images with infinite scroll
- **Update**: Edit image metadata
- **Delete**: Remove images

### Authentication

- JWT-based authentication
- Google OAuth integration
- Email verification flow
- Protected routes

## Best Practices

1. **Component Structure**: Keep components small and focused
2. **Type Safety**: Use TypeScript and generated API types
3. **State Management**: Use Redux Toolkit for global state, local state for component-specific data
4. **Code Quality**: Run linting and formatting before committing
5. **Performance**: Optimize images and use Next.js Image component
6. **Accessibility**: Follow WCAG guidelines for accessible components

## Troubleshooting

### API Types Not Generating

- Ensure the backend is running
- Check that Swagger is accessible at the configured URL
- Verify network connectivity

### Build Errors

- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run type-check`

## License

This project is part of an onboarding course.
