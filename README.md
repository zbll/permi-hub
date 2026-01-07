# Enterprise-level Permission Management System

## Project Introduction

This is an enterprise-level permission management system based on Monorepo architecture, providing comprehensive user management, role management, permission control, and system logging functionalities. The system adopts a front-end and back-end separation architecture, with the front-end using a modern React technology stack and the back-end using an efficient Deno + Hono framework. It supports internationalization, responsive design, and comprehensive form validation.

## Technology Stack

### Front-end Technology Stack
- **Framework**: React 19
- **Routing**: React Router 7
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Form Management**: TanStack React Form
- **State Management**: Zustand
- **Data Request**: TanStack React Query + Axios
- **Table**: TanStack React Table
- **Type System**: TypeScript
- **Internationalization**: i18next
- **UI Components**: Radix UI + Custom Component Library
- **Validation**: Zod

### Back-end Technology Stack
- **Runtime**: Deno
- **Framework**: Hono
- **ORM**: TypeORM
- **Database**: MySQL
- **Caching**: Redis
- **Email Service**: Nodemailer
- **Logging**: Custom Logging System

### Development Tools
- **Package Management**: pnpm
- **Monorepo Management**: Lerna
- **Code Specification**: ESLint + Prettier
- **Type Checking**: TypeScript

## Project Structure

```
monorepo-demo/
├── applications/
│   ├── client/          # Front-end application
│   │   ├── app/         # Application code
│   │   │   ├── api/     # API service layer
│   │   │   ├── components/  # Components
│   │   │   ├── hooks/   # Custom Hooks
│   │   │   ├── lib/     # Utility library
│   │   │   ├── locale/  # Internationalization configuration
│   │   │   ├── routes/  # Routing configuration
│   │   │   └── stores/  # State management
│   │   ├── public/      # Static resources
│   │   └── ...          # Configuration files
│   └── server/          # Back-end application
│       ├── logs/        # Log files
│       ├── src/         # Application code
│       │   ├── connect/ # Database connection
│       │   ├── controllers/  # Controllers
│       │   ├── locale/  # Internationalization configuration
│       │   ├── redis/   # Redis connection
│       │   ├── services/     # Service layer
│       │   └── utils/   # Utility library
│       └── ...          # Configuration files
├── packages/            # Shared packages
│   ├── console/         # Console tools
│   ├── encryption/      # Encryption utilities
│   ├── hooks/           # Shared Hooks
│   ├── middlewares/     # Middlewares
│   └── types/           # TypeScript type definitions
├── LICENSE              # ISC License
└── ...                  # Root directory configuration files
```

## Main Features

### User Management
- User registration and login
- Personal information modification
- User list management (CRUD operations)
- Role assignment

### Role Management
- Role creation, editing, and deletion
- Permission assignment
- Role list management

### Permission Management
- Permission grouping
- Assigning permissions to roles
- Permission list viewing

### Log Management
- System operation log recording
- Log list viewing
- Log details viewing

### Internationalization
- Support for Chinese and English switching
- Dynamic language loading

## Installation and Running

### Prerequisites
- Node.js >= 20.x
- pnpm >= 10.x
- Deno >= 1.45.x
- MySQL >= 8.x
- Redis >= 6.x

### Installing Dependencies

```bash
# Install all dependencies (including root directory and all sub-packages)
pnpm install
```

### Configuring Environment Variables

#### Front-end Configuration
Copy `applications/client/.env.example` to `applications/client/.env` and configure the corresponding environment variables.

#### Back-end Configuration
Copy `applications/server/.env.example` to `applications/server/.env` and configure the corresponding environment variables.

### Running the Project

#### Development Mode

```bash
# Start the front-end development server
cd applications/client
pnpm dev

# Start the back-end development server
cd applications/server
pnpm dev
```

#### Production Mode

```bash
# Build the front-end project
cd applications/client
pnpm build

# Start the front-end production server
pnpm start

# Build the back-end project
cd applications/server
pnpm build

# Start the back-end production server
pnpm start
```

## Code Specifications

### Front-end Code Specifications
- Write all code in TypeScript
- Follow ESLint and Prettier configurations
- Use functional components and Hooks for components
- Use TanStack React Form for forms
- Use TanStack React Query for data requests

### Back-end Code Specifications
- Write all code in TypeScript
- Follow ESLint and Prettier configurations
- Use RESTful style for API routes
- Use TypeORM for database operations
- Separate service layer and controllers

## Contribution Guidelines

1. Clone the project to your local machine
2. Create a feature branch
3. Write code
4. Run tests
5. Commit code
6. Create a Pull Request

## License

This project is open source under the [ISC License](LICENSE).

## Contact Information

If you have any questions or suggestions, please contact us through the following methods:

- Email: admin@example.com
- GitHub: https://github.com/example/monorepo-demo