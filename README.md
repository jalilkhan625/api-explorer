# API Explorer

API Explorer is a minimal and responsive web interface designed to help developers easily navigate, explore, and document APIs. Built using Next.js and Tailwind CSS, it emphasizes simplicity, scalability, and accessibility.

## Features

- Lightweight, responsive navigation bar
- Mobile-first design with collapsible menu
- Easy theming with Tailwind CSS
- Custom branding with logo and tagline
- Built-in routing for Home, Docs, and About pages

## Project Structure

api-explorer/
├── public/
│   └── API-logo.png
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── about/
│       └── page.tsx
│   └── docs/
│       └── page.tsx
├── components/
│   └── Navbar.tsx
├── styles/
│   └── globals.css
├── README.md
├── tailwind.config.js
├── postcss.config.js
└── tsconfig.json

## Installation

1. Clone the repository:

   git clone https://github.com/jalilkhan625/api-explorer.git
   cd api-explorer

2. Install dependencies:

   npm install

3. Run the development server:

   npm run dev

4. Open your browser at http://localhost:3000

## Notes

- This project does not include dark mode yet.
- You can customize the logo by replacing public/API-logo.png.

## Author

Developed by https://github.com/jalilkhan625
