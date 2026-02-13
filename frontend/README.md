# Frontend - Task Management UI

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.local.example .env.local
# Edit .env.local with your API URL

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5002/api/v1
```

## Project Structure

```
app/
├── dashboard/       # Protected dashboard page (SSR)
├── login/           # Login page (CSR)
├── register/        # Register page (CSR)
├── globals.css      # Global styles
├── layout.js        # Root layout
└── page.js          # Home page

components/
├── DashboardClient.js  # Dashboard client component
├── TaskForm.js         # Task creation/edit form
└── TaskList.js         # Task list display

context/
└── AuthContext.js      # Authentication context

lib/
└── api.js              # API client functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Key Features

- Next.js 14 App Router
- Hybrid SSR + CSR Rendering
- Context API State Management
- Tailwind CSS Styling
- JWT Authentication
- Protected Routes
- Responsive Design

## Pages

- `/` - Landing page
- `/register` - User registration (CSR)
- `/login` - User login (CSR)
- `/dashboard` - Task management dashboard (SSR + CSR)
