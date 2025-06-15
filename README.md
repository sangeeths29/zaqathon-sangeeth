# Smart Order Intake

A modern, AI-powered system for extracting, validating, and structuring purchase orders from unstructured emails. Built for Zaqathon.

---

## Features

- **Extracts** SKUs, quantities, and delivery requirements from messy/unstructured emails.
- **Validates** requests against a product catalog (SKU existence, MOQ, inventory).
- **Outputs** structured JSON with validated SKUs, quantities, customer notes, and delivery preferences.
- **Flags issues** and proposes solutions (e.g., SKU doesn't exist, MOQ not met, suggest alternatives).
- **User-friendly UI** for pasting or uploading emails, reviewing parsed orders, and downloading results.

---

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript

---

## Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/sangeeths29/zaqathon-sangeeth.git
cd zaqathon-sangeeth
```

### 2. Install dependencies

#### Backend
```sh
cd backend
npm install
```

#### Frontend
```sh
cd ../frontend
npm install
```

### 3. Run the app

#### Backend
```sh
npm run dev
```

#### Frontend (in a new terminal)
```sh
npm run dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:4000](http://localhost:4000)

---

## Usage

1. **Paste** or **upload** an email in the UI.
2. Click **Parse Email**.
3. Review the structured order, issues, and suggestions.
4. Download the result as JSON.

---

## Project Structure

```
zaqathon-sangeeth/
  backend/    # Node.js/Express API
  frontend/   # Next.js/Tailwind frontend
```

---

## Judging Notes

- The system is robust and works with any email input.
- All sample/test files are removed from the repo, but you can add your own for testing.
- The UI is responsive and works on all modern browsers.

---

## License

MIT