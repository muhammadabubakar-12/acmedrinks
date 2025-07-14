# AcmeDrinks

A modern, full-stack web application for managing and selling drinks online.  
Includes a customer-facing storefront, admin dashboard, real-time chat, order management, analytics, and more.

---

## Features

- Product catalog and details
- Cart and checkout
- User authentication (NextAuth.js)
- Order management (customer & admin)
- Product reviews
- Real-time chat (customer & admin)
- Admin dashboard with analytics
- Image uploads (ImageKit)
- Stripe payments integration
- PostgreSQL/Neon database

---

## Tech Stack

- **Next.js (App Router)** — React framework for SSR/SSG and routing
- **React** — UI library
- **Tailwind CSS** — Utility-first CSS framework
- **Prisma ORM** — Type-safe database ORM
- **NextAuth.js** — Authentication
- **Pusher** — Real-time chat and notifications
- **ImageKit** — Image hosting and CDN
- **Stripe** — Payment processing
- **Neon / PostgreSQL** — Cloud-native/PostgreSQL database
- **TypeScript** — Type safety

---

acmedrinks/
├── app/ # Next.js app directory (pages, API routes, layouts)
│ ├── admin/ # Admin dashboard, analytics, orders, products, chat, etc.
│ ├── api/ # API routes (auth, products, orders, chat, etc.)
│ ├── auth/ # Sign in/up pages
│ ├── chat/ # Customer chat page
│ ├── checkout/ # Checkout page
│ ├── dashboard/ # User dashboard
│ ├── product/ # Product listing and detail pages
│ └── globals.css # Global styles
├── components/ # Reusable React components (UI, admin, chat, etc.)
├── hooks/ # Custom React hooks
├── lib/ # Utility libraries (auth, db, imagekit, pusher, etc.)
├── prisma/ # Prisma schema
├── public/ # Static assets (images, logos)
├── scripts/ # Utility scripts (seeding, client generation)
├── styles/ # Additional styles
├── types/ # TypeScript type definitions
├── .gitignore
├── package.json
└── README.md

---

## Setup & Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/muhammadabubakar-12/acmedrinks.git
   cd acmedrinks
   ```

2. **Install dependencies:**

   ```sh
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables:**

   - Copy `.env.example` to `.env` and fill in the required values (database, NextAuth, Pusher, ImageKit, etc.).

4. **Set up the database:**

   ```sh
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Seed the database (optional):**

   ```sh
   npm run seed
   ```

6. **Run the development server:**

   ```sh
   npm run dev
   ```

---

## Environment Variables

You will need to set up environment variables for:

- **Database** (e.g., `DATABASE_URL`)
- **NextAuth** (e.g., `NEXTAUTH_URL`, `NEXTAUTH_SECRET`)
- **Pusher** (for real-time chat)
- **ImageKit** (for image uploads)
- **Stripe** (if using for payments)

See `.env.example` for all required variables.

---

## Scripts

- `npm run dev` — Start the development server
- `npm run build` — Build for production
- `npm run start` — Start the production server
- `npm run seed` — Seed the database
- `npx prisma studio` — Open Prisma Studio (DB GUI)

---

## Usage

- Visit `/` for the storefront.
- Visit `/admin` for the admin dashboard (admin login required).
- Visit `/dashboard` for user dashboard.
- Use the chat feature for real-time support.

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](LICENSE)  
© Muhammad Abubakar

---
