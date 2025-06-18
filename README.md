Twzi 

## Features

- 🔄 Visual Workflow Editor with Node-based Interface
- 🎨 Modern UI with Light/Dark Theme Support
- 💳 Credit-based Execution System
- 🔒 Web3 Wallet Authentication
- 📊 Execution Analytics and Statistics
- 🔑 Secure Credential Management
- ⏱️ Workflow Scheduling with Cron Support

## Project Structure

```
client/
├── actions/           # Server actions for API functionality
│   ├── ai/           # AI-related actions
│   ├── analytics/    # Analytics and statistics
│   ├── auth/         # Authentication
│   ├── billing/      # Credit system
│   ├── credentials/  # Credential management
│   └── workflows/    # Workflow CRUD operations
├── app/              # Next.js app router pages
│   ├── (dashboard)/  # Dashboard routes
│   ├── workflow/     # Workflow editor
│   └── setup/       # New user setup
├── components/       # Reusable React components
├── contexts/         # React contexts
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
├── prisma/          # Database schema and migrations
├── schema/          # Type definitions
└── types/           # TypeScript types
```

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npx prisma generate
npx prisma migrate dev
```

3. Create a `.env` file with required environment variables:
```
DATABASE_URL="file:./dev.db"
NETWORK_ID="base-sepolia"
```

4. Start the development server:
```bash
npm run dev
```

## Key Components

- **Workflow Editor** (`/app/workflow/`): Visual node-based editor for creating workflows
- **Node Components** (`/app/workflow/_components/nodes/`): Individual node types and their implementations
- **Server Actions** (`/actions/`): Backend functionality for workflows, auth, and billing
- **Database** (`/prisma/schema.prisma`): SQLite database with Prisma ORM

## Documentation

- [From Data-Feed to Swap - A Hands-On Guide](https://www.twaziapp.com/blog/2025-06-10-from-datafeed-to-swap)
- [ Architecture Overview](https://www.twaziapp.com/docs/architecture) 


