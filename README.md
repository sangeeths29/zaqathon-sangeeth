# Smart Order Intake System

A system that automatically processes customer emails, extracts purchase requests, validates them against a product catalog, and provides a user interface for order review and approval.

## Features

- Email processing and order extraction
- SKU validation against product catalog
- MOQ (Minimum Order Quantity) validation
- Inventory availability checking
- JSON output with validated order data
- User interface for order review and approval
- Confidence scores for extracted fields
- PDF form filling automation

## Tech Stack

- Frontend: Next.js with TypeScript
- Backend: Node.js with Express
- Database: SQLite (for development)
- Email Processing: Node-mailparser
- PDF Processing: PDFKit
- UI Framework: Tailwind CSS

## Project Structure

```
├── frontend/           # Next.js frontend application
├── backend/           # Node.js backend server
├── shared/           # Shared types and utilities
├── data/            # Sample data and catalogs
└── docs/            # Documentation
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Start the development servers:
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend server
   cd ../frontend
   npm run dev
   ```

4. Open http://localhost:3000 in your browser

## Development

- Backend runs on http://localhost:4000
- Frontend runs on http://localhost:3000
- API documentation available at http://localhost:4000/api-docs

## License

MIT