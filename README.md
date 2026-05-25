# TourEase — Sri Lanka Tourism Management System

A full-stack web application for managing tourism in Sri Lanka.

## Project Structure

```
TourEase/
├── frontend/          # React + Vite frontend
│   ├── components/    # Reusable UI components
│   ├── pages/         # Page components
│   ├── types/         # TypeScript type definitions
│   ├── App.tsx        # Root application component
│   ├── index.tsx      # Entry point
│   ├── index.html     # HTML template
│   ├── vite.config.ts # Vite configuration
│   ├── tsconfig.json  # TypeScript configuration
│   └── package.json   # Frontend dependencies
│
├── backend/           # Node.js + Express API
│   └── src/
│       ├── config/        # Database configuration
│       ├── controllers/   # Route handlers
│       ├── middleware/     # Auth & error middleware
│       ├── models/        # Mongoose schemas
│       ├── routes/        # API route definitions
│       ├── types/         # TypeScript interfaces
│       ├── server.ts      # Server entry point
│       └── seed.ts        # Database seed script
│
└── README.md          # This file
```

## Getting Started

### Backend

```bash
cd backend
npm install
npm run seed    # Populate database with initial data
npm run dev     # Start dev server on port 5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev     # Start dev server on port 3000
```

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB (Mongoose) |
| Auth | JWT, bcryptjs |
