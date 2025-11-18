# IT Service Desk & Asset Management Portal

A comprehensive IT Service Desk and Asset Management portal built with Next.js 14+, TypeScript, and Prisma. Perfect for demonstrations, live coding sessions, and as a foundation for enterprise IT service management systems.

## Running the CLI in CI/CD Flows

Make sure you've added your `CURSOR_API_KEY` as a `Repository secret` in Github. Then the CLI workflows in `.github/workflows` will work as is.

## Tech Stack

- **Frontend**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: SQLite (for demo simplicity)
- **ORM**: Prisma
- **Authentication**: Fake auth with hardcoded credentials
- **State Management**: Server components + React hooks
- **Containerization**: Docker Compose

## Demo Credentials

- **End User**: `user@company.com` / `password123`
- **Admin**: `admin@company.com` / `admin123`

## Quick Start

### Prerequisites
- Node.js 18+ 
- Docker and Docker Compose
- npm or yarn

### 1. Clone and Install Dependencies
```bash
git clone <repository-url>
cd it-service-desk
npm install
```

### 2. Setup Database
```bash
npm run db:generate
npm run db:push
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── (auth)/            # Authentication routes
│   │   ├── dashboard/         # Dashboard page
│   │   ├── tickets/           # Ticket management
│   │   ├── assets/            # Asset management
│   │   └── users/             # User management (admin only)
│   ├── components/            # Reusable UI components
│   │   ├── auth/              # Authentication components
│   │   ├── layout/            # Layout components
│   │   └── ui/                # shadcn/ui components
│   ├── contexts/              # React contexts
│   └── lib/                   # Utilities and configurations
├── prisma/                    # Database schema and migrations
├── docker-compose.yml         # Database container
└── README.md                  # This file
```

## Database Schema

The application uses 5 main tables:
- **users**: User accounts with role-based access
- **tickets**: Support tickets with status workflow
- **assets**: Hardware inventory tracking
- **software_licenses**: Software license management
- **categories**: Categorization system

## Development

### Adding New Components
```bash
npx shadcn@latest add <component-name>
```

### Database Changes
1. Update `prisma/schema.prisma`
2. Run `npm run db:push` for development
3. Run `npm run db:migrate` for production

### Authentication
The current system uses fake authentication with hardcoded credentials. In production, this should be replaced with a proper authentication provider like NextAuth.js or Auth0.

## 🚀 Live Demo Improvements

Areas intentionally left simple for live enhancement during demos:

### Easy Wins (5-10 minutes each)
- **Add Search**: Implement search functionality across tickets/assets
- **Table Sorting**: Add clickable column headers for sorting
- **Export Data**: Add CSV export functionality
- **Bulk Actions**: Select multiple items for bulk operations
- **Dashboard Charts**: Add simple charts for statistics visualization

### Medium Complexity (15-20 minutes each)
- **Advanced Filters**: Multi-criteria filtering with date ranges
- **File Attachments**: Add file upload to tickets
- **Email Notifications**: Send updates via email
- **Audit Trail**: Track all changes to tickets and assets
- **API Integration**: Connect with external systems

**Perfect for:** Live coding sessions, technical interviews, architecture discussions, workshops, and as a foundation for real IT service management systems.
