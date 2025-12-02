export type StackType = 'mern' | 'mean' | 'nextjs' | 'react-supabase' | 'vue-firebase';
export type ModeType = 'beginner' | 'pro';

export interface FolderNode {
  name: string;
  type: 'folder' | 'file';
  children?: FolderNode[];
  description?: string;
}

export interface RoadmapStep {
  step: number;
  title: string;
  description: string;
  commands?: string[];
  tips?: string[];
}

export interface StackTemplate {
  name: string;
  description: string;
  icon: string;
  beginner: {
    structure: FolderNode;
    roadmap: RoadmapStep[];
  };
  pro: {
    structure: FolderNode;
    roadmap: RoadmapStep[];
  };
}

export const stackTemplates: Record<StackType, StackTemplate> = {
  mern: {
    name: 'MERN Stack',
    description: 'MongoDB, Express, React, Node.js',
    icon: '🍃',
    beginner: {
      structure: {
        name: 'my-mern-app',
        type: 'folder',
        children: [
          {
            name: 'client',
            type: 'folder',
            description: 'React frontend',
            children: [
              { name: 'src', type: 'folder', children: [
                { name: 'components', type: 'folder', description: 'Reusable UI components' },
                { name: 'pages', type: 'folder', description: 'Page components' },
                { name: 'App.jsx', type: 'file' },
                { name: 'index.js', type: 'file' },
              ]},
              { name: 'package.json', type: 'file' },
            ]
          },
          {
            name: 'server',
            type: 'folder',
            description: 'Express backend',
            children: [
              { name: 'models', type: 'folder', description: 'MongoDB schemas' },
              { name: 'routes', type: 'folder', description: 'API endpoints' },
              { name: 'server.js', type: 'file' },
            ]
          },
          { name: 'package.json', type: 'file' },
          { name: '.env', type: 'file', description: 'Environment variables' },
        ]
      },
      roadmap: [
        { step: 1, title: 'Initialize Project', description: 'Set up root folder and initialize npm', commands: ['mkdir my-mern-app', 'cd my-mern-app', 'npm init -y'] },
        { step: 2, title: 'Create React Client', description: 'Scaffold React frontend with Vite', commands: ['npm create vite@latest client -- --template react'] },
        { step: 3, title: 'Set Up Express Server', description: 'Create backend with Express', commands: ['mkdir server', 'cd server', 'npm init -y', 'npm i express mongoose cors dotenv'] },
        { step: 4, title: 'Connect MongoDB', description: 'Set up MongoDB Atlas and connect', tips: ['Create free cluster at mongodb.com', 'Add connection string to .env'] },
        { step: 5, title: 'Build API Routes', description: 'Create CRUD endpoints', tips: ['Start with one resource', 'Test with Postman'] },
        { step: 6, title: 'Connect Frontend', description: 'Fetch data from API in React', commands: ['npm i axios'] },
      ]
    },
    pro: {
      structure: {
        name: 'my-mern-app',
        type: 'folder',
        children: [
          {
            name: 'client',
            type: 'folder',
            children: [
              { name: 'src', type: 'folder', children: [
                { name: 'components', type: 'folder', children: [
                  { name: 'ui', type: 'folder', description: 'Shadcn/Radix primitives' },
                  { name: 'features', type: 'folder', description: 'Feature-specific components' },
                ]},
                { name: 'pages', type: 'folder' },
                { name: 'hooks', type: 'folder', description: 'Custom React hooks' },
                { name: 'context', type: 'folder', description: 'React Context providers' },
                { name: 'services', type: 'folder', description: 'API service layer' },
                { name: 'utils', type: 'folder', description: 'Helper functions' },
                { name: 'types', type: 'folder', description: 'TypeScript interfaces' },
              ]},
              { name: 'package.json', type: 'file' },
              { name: 'tsconfig.json', type: 'file' },
            ]
          },
          {
            name: 'server',
            type: 'folder',
            children: [
              { name: 'controllers', type: 'folder', description: 'Business logic handlers' },
              { name: 'models', type: 'folder', description: 'Mongoose schemas + methods' },
              { name: 'routes', type: 'folder', description: 'Express route definitions' },
              { name: 'middleware', type: 'folder', description: 'Auth, validation, error handling' },
              { name: 'services', type: 'folder', description: 'External API integrations' },
              { name: 'utils', type: 'folder', description: 'Helper utilities' },
              { name: 'config', type: 'folder', description: 'DB, env configuration' },
              { name: 'types', type: 'folder', description: 'TypeScript types' },
            ]
          },
          { name: 'docker-compose.yml', type: 'file', description: 'Container orchestration' },
          { name: '.github', type: 'folder', children: [
            { name: 'workflows', type: 'folder', description: 'CI/CD pipelines' },
          ]},
          { name: '.env.example', type: 'file' },
        ]
      },
      roadmap: [
        { step: 1, title: 'Monorepo Setup', description: 'Initialize with proper tooling', commands: ['npm init -y', 'npm i -D concurrently typescript'], tips: ['Use workspaces for shared code'] },
        { step: 2, title: 'TypeScript Configuration', description: 'Set up strict TS for both client/server', tips: ['Enable strict mode', 'Share types between packages'] },
        { step: 3, title: 'Docker Environment', description: 'Containerize for consistent dev/prod', commands: ['docker-compose up -d'], tips: ['Use volumes for hot reload'] },
        { step: 4, title: 'Auth Architecture', description: 'Implement JWT with refresh tokens', tips: ['Store refresh token in httpOnly cookie', 'Access token in memory only'] },
        { step: 5, title: 'API Layer Design', description: 'RESTful or GraphQL with proper validation', commands: ['npm i zod express-validator'], tips: ['Use Zod for runtime validation'] },
        { step: 6, title: 'State Management', description: 'React Query + Context for server/client state', commands: ['npm i @tanstack/react-query'] },
        { step: 7, title: 'Testing Strategy', description: 'Unit, integration, e2e tests', commands: ['npm i -D vitest @testing-library/react cypress'] },
        { step: 8, title: 'CI/CD Pipeline', description: 'GitHub Actions for automated deployment', tips: ['Lint → Test → Build → Deploy'] },
      ]
    }
  },
  mean: {
    name: 'MEAN Stack',
    description: 'MongoDB, Express, Angular, Node.js',
    icon: '🅰️',
    beginner: {
      structure: {
        name: 'my-mean-app',
        type: 'folder',
        children: [
          { name: 'client', type: 'folder', description: 'Angular frontend', children: [
            { name: 'src', type: 'folder', children: [
              { name: 'app', type: 'folder', children: [
                { name: 'components', type: 'folder' },
                { name: 'services', type: 'folder' },
              ]},
            ]},
          ]},
          { name: 'server', type: 'folder', children: [
            { name: 'models', type: 'folder' },
            { name: 'routes', type: 'folder' },
            { name: 'server.js', type: 'file' },
          ]},
        ]
      },
      roadmap: [
        { step: 1, title: 'Angular CLI Setup', description: 'Install Angular and create project', commands: ['npm i -g @angular/cli', 'ng new client'] },
        { step: 2, title: 'Express Backend', description: 'Set up Node/Express server', commands: ['mkdir server', 'npm init -y'] },
        { step: 3, title: 'MongoDB Connection', description: 'Connect to MongoDB Atlas' },
        { step: 4, title: 'Build Services', description: 'Create Angular services for API calls' },
      ]
    },
    pro: {
      structure: {
        name: 'my-mean-app',
        type: 'folder',
        children: [
          { name: 'apps', type: 'folder', children: [
            { name: 'client', type: 'folder' },
            { name: 'server', type: 'folder' },
          ]},
          { name: 'libs', type: 'folder', description: 'Shared libraries', children: [
            { name: 'shared-types', type: 'folder' },
            { name: 'utils', type: 'folder' },
          ]},
          { name: 'nx.json', type: 'file', description: 'Nx monorepo config' },
        ]
      },
      roadmap: [
        { step: 1, title: 'Nx Workspace', description: 'Set up Nx monorepo', commands: ['npx create-nx-workspace@latest'] },
        { step: 2, title: 'Shared Libraries', description: 'Create shared types and utils' },
        { step: 3, title: 'NgRx State', description: 'Implement Redux-style state management' },
        { step: 4, title: 'Testing & CI', description: 'Jest + Cypress with GitHub Actions' },
      ]
    }
  },
  nextjs: {
    name: 'Next.js',
    description: 'React framework with SSR/SSG',
    icon: '▲',
    beginner: {
      structure: {
        name: 'my-next-app',
        type: 'folder',
        children: [
          { name: 'app', type: 'folder', description: 'App Router', children: [
            { name: 'page.tsx', type: 'file' },
            { name: 'layout.tsx', type: 'file' },
            { name: 'api', type: 'folder', description: 'API routes' },
          ]},
          { name: 'components', type: 'folder' },
          { name: 'public', type: 'folder' },
        ]
      },
      roadmap: [
        { step: 1, title: 'Create Next App', description: 'Initialize with App Router', commands: ['npx create-next-app@latest --typescript'] },
        { step: 2, title: 'Build Pages', description: 'Create routes in app directory' },
        { step: 3, title: 'API Routes', description: 'Add backend logic in app/api' },
        { step: 4, title: 'Deploy', description: 'Push to Vercel', commands: ['vercel'] },
      ]
    },
    pro: {
      structure: {
        name: 'my-next-app',
        type: 'folder',
        children: [
          { name: 'app', type: 'folder', children: [
            { name: '(auth)', type: 'folder', description: 'Auth route group' },
            { name: '(dashboard)', type: 'folder', description: 'Protected routes' },
            { name: 'api', type: 'folder' },
          ]},
          { name: 'components', type: 'folder', children: [
            { name: 'ui', type: 'folder' },
            { name: 'forms', type: 'folder' },
          ]},
          { name: 'lib', type: 'folder', children: [
            { name: 'db', type: 'folder', description: 'Prisma/Drizzle' },
            { name: 'auth', type: 'folder', description: 'NextAuth config' },
          ]},
          { name: 'prisma', type: 'folder' },
        ]
      },
      roadmap: [
        { step: 1, title: 'Project Setup', description: 'Next.js + TypeScript + Tailwind', commands: ['npx create-next-app@latest --typescript --tailwind --eslint'] },
        { step: 2, title: 'Database Layer', description: 'Prisma with PostgreSQL', commands: ['npm i prisma @prisma/client', 'npx prisma init'] },
        { step: 3, title: 'Authentication', description: 'NextAuth.js with providers', commands: ['npm i next-auth'] },
        { step: 4, title: 'Server Actions', description: 'Type-safe mutations with Zod' },
        { step: 5, title: 'Caching Strategy', description: 'ISR + on-demand revalidation' },
      ]
    }
  },
  'react-supabase': {
    name: 'React + Supabase',
    description: 'React with Supabase backend',
    icon: '⚡',
    beginner: {
      structure: {
        name: 'my-react-supabase-app',
        type: 'folder',
        children: [
          { name: 'src', type: 'folder', children: [
            { name: 'components', type: 'folder' },
            { name: 'pages', type: 'folder' },
            { name: 'lib', type: 'folder', children: [
              { name: 'supabase.ts', type: 'file', description: 'Supabase client' },
            ]},
          ]},
        ]
      },
      roadmap: [
        { step: 1, title: 'Vite + React', description: 'Create React app', commands: ['npm create vite@latest -- --template react-ts'] },
        { step: 2, title: 'Supabase Setup', description: 'Create project at supabase.com' },
        { step: 3, title: 'Auth Flow', description: 'Implement login/signup with Supabase Auth' },
        { step: 4, title: 'Database', description: 'Create tables and RLS policies' },
      ]
    },
    pro: {
      structure: {
        name: 'my-react-supabase-app',
        type: 'folder',
        children: [
          { name: 'src', type: 'folder', children: [
            { name: 'components', type: 'folder' },
            { name: 'hooks', type: 'folder' },
            { name: 'lib', type: 'folder' },
            { name: 'types', type: 'folder', children: [
              { name: 'database.types.ts', type: 'file', description: 'Generated types' },
            ]},
          ]},
          { name: 'supabase', type: 'folder', children: [
            { name: 'migrations', type: 'folder' },
            { name: 'functions', type: 'folder', description: 'Edge functions' },
          ]},
        ]
      },
      roadmap: [
        { step: 1, title: 'Type Generation', description: 'Generate TypeScript types from schema', commands: ['npx supabase gen types typescript'] },
        { step: 2, title: 'RLS Policies', description: 'Implement row-level security' },
        { step: 3, title: 'Edge Functions', description: 'Serverless functions for custom logic' },
        { step: 4, title: 'Real-time', description: 'Subscribe to database changes' },
      ]
    }
  },
  'vue-firebase': {
    name: 'Vue + Firebase',
    description: 'Vue.js with Firebase backend',
    icon: '🔥',
    beginner: {
      structure: {
        name: 'my-vue-firebase-app',
        type: 'folder',
        children: [
          { name: 'src', type: 'folder', children: [
            { name: 'components', type: 'folder' },
            { name: 'views', type: 'folder' },
            { name: 'firebase', type: 'folder', children: [
              { name: 'config.ts', type: 'file' },
            ]},
          ]},
        ]
      },
      roadmap: [
        { step: 1, title: 'Vue CLI', description: 'Create Vue project', commands: ['npm create vue@latest'] },
        { step: 2, title: 'Firebase Setup', description: 'Create project in Firebase console' },
        { step: 3, title: 'Authentication', description: 'Firebase Auth integration' },
        { step: 4, title: 'Firestore', description: 'Real-time database setup' },
      ]
    },
    pro: {
      structure: {
        name: 'my-vue-firebase-app',
        type: 'folder',
        children: [
          { name: 'src', type: 'folder', children: [
            { name: 'components', type: 'folder' },
            { name: 'composables', type: 'folder', description: 'Vue composables' },
            { name: 'stores', type: 'folder', description: 'Pinia stores' },
          ]},
          { name: 'functions', type: 'folder', description: 'Cloud Functions' },
          { name: 'firestore.rules', type: 'file' },
        ]
      },
      roadmap: [
        { step: 1, title: 'Pinia State', description: 'Set up Pinia for state management' },
        { step: 2, title: 'VueFire', description: 'Real-time bindings with VueFire' },
        { step: 3, title: 'Cloud Functions', description: 'Server-side logic' },
        { step: 4, title: 'Security Rules', description: 'Firestore security rules' },
      ]
    }
  }
};
