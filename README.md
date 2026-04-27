# whoFyne

A full-stack social web app for beauty competitions and photo voting. Users can vote on photos in real-time, and authorized uploaders can contribute new photos to the platform.

## 🌟 Features

- **Photo Voting System**: Real-time upvote/downvote functionality with optimistic UI updates
- **User Authentication**: Secure sign-up and login with Supabase Auth
- **Role-Based Access**: Differentiated roles for regular users and photo uploaders
- **Responsive Design**: Modern, mobile-friendly interface with Tailwind CSS
- **Real-Time Updates**: Instant vote count updates across the platform
- **Dark Mode Support**: Professional dark-themed UI for better user experience

## 🛠️ Tech Stack

### Frontend
- **Next.js 16.2.3** - React framework for production
- **React 19** - Latest React with hooks support
- **TypeScript** - Type-safe code development
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **clsx & tailwind-merge** - CSS utility helpers

### Backend & Database
- **Supabase** - PostgreSQL database with real-time API
- **@supabase/supabase-js** - Supabase JavaScript client
- **@supabase/ssr** - Server-side rendering support for Supabase

### Development Tools
- **ESLint** - Code linting and quality
- **PostCSS** - CSS transformation
- **TypeScript** - Static type checking

## 📁 Project Structure

```
whoFyne/
├── app/                    # Next.js App Router
│   ├── actions/           # Server actions
│   │   └── vote.ts        # Vote casting logic
│   ├── auth/              # Authentication
│   │   └── actions.ts     # Login/signup server actions
│   ├── login/             # Authentication UI
│   │   └── page.tsx       # Login/signup page
│   ├── upload/            # Photo upload (uploader only)
│   │   └── page.tsx       # Upload page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── Navbar.tsx         # Navigation bar with auth info
│   └── VoteButton.tsx     # Vote interaction component
├── lib/                   # Utility functions
│   └── utils.ts           # Helper utilities
├── utils/                 # Shared utilities
│   └── supabase/          # Supabase configuration
│       ├── server.ts      # Server-side Supabase client
│       ├── client.ts      # Client-side Supabase client
│       └── proxy.ts       # Proxy utilities
├── public/                # Static assets
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── next.config.ts         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── postcss.config.mjs     # PostCSS configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Uriri-007/whoFyne.git
   cd whoFyne
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🔑 Key Features Explained

### Voting System
The `VoteButton` component implements optimistic UI updates for seamless voting experience:
- Users can upvote (👍) or downvote (👎) photos
- Vote counts update instantly with optimistic state management
- Server-side validation ensures data consistency
- Prevention of duplicate votes and vote switching

### Authentication
- Sign-up with email/password and username
- Login to existing accounts
- Session management with Supabase Auth
- Automatic profile creation on signup
- Role-based access control for uploaders

### Photo Upload
- Restricted to authorized uploaders only
- Profile-based authorization checks
- Secure file upload functionality

## 🌐 Deployment

The application is deployed on **Vercel** and can be accessed at: [https://who-fyne.vercel.app](https://who-fyne.vercel.app)

### Deploy on Vercel

1. Push your code to GitHub
2. Import the repository on Vercel
3. Add environment variables in Vercel dashboard
4. Deploy with one click

For detailed deployment instructions, check [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## 📝 Database Schema

The application uses the following main tables:

- **profiles** - User profile information including username and uploader status
- **photos** - Uploaded photo metadata and details
- **votes** - Vote records with user ID, photo ID, and vote direction

## 🤝 Contributing

Contributions are welcome! Feel free to submit pull requests or open issues for bugs and feature requests.

## 📄 License

This project is open source and available under the MIT License.

---

Built with ❤️ using Next.js and Supabase