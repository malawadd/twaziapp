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


Copy the example and fill in your secrets:

```bash
cp .env.example .env
```

Fill in the `.env` file with the required keys, for example:

```env
# Required by OnchainKit for wallet connections
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key

# Local SQLite database path
DATABASE_URL="file:./dev.db"

# Secret used for verifying webhook payloads (optional for now)
API_SECRET=your_api_secret_here

# Used for AES-256 encryption of credentials
ENCRYPTION_KEY=your_32_byte_hex_key

NEXT_PUBLIC_APP_URL=http://localhost:3000

```

Generate the encryption key using:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Key Components

- **Workflow Editor** (`/app/workflow/`): Visual node-based editor for creating workflows
- **Node Components** (`/app/workflow/_components/nodes/`): Individual node types and their implementations
- **Server Actions** (`/actions/`): Backend functionality for workflows, auth, and billing
- **Database** (`/prisma/schema.prisma`): SQLite database with Prisma ORM

## Documentation

- [From Data-Feed to Swap - A Hands-On Guide](https://www.twaziapp.com/blog/2025-06-10-from-datafeed-to-swap)
- [ Architecture Overview](https://www.twaziapp.com/docs/architecture) 


