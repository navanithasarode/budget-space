# Budget Space

A universal budget and expense management platform for real-life situations.

## Features
- Universal Budget Spaces: trips, healthcare, birthdays, household, college, shopping, vehicles, projects, personal and custom.
- Dashboard with total budget, spending, remaining amount and recent activity.
- Adaptive Budget Space details.
- Add/delete expenses with live budget calculations.
- Categories and basic analytics.
- JWT authentication with bcryptjs password hashing.
- Ownership/authorization checks.
- Optional healthcare insurance/claim fields.
- Mock/demo mode so the UI works without MongoDB.
- Responsive UI.
- Git-ready `.gitignore`.

## Tech stack
Frontend: React + Vite + JavaScript + CSS  
Backend: Node.js + Express  
Database: MongoDB + Mongoose  
Authentication: JWT + bcryptjs

## Project structure
```text
budget-space/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   └── package.json
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
├── .gitignore
└── README.md
```

## Run the frontend demo
```bash
cd frontend
npm install
npm run dev
```
Open the Vite URL, normally `http://localhost:5173`.

The application starts in **Demo Mode**, so you can explore it without MongoDB.

## Run the backend
1. Install MongoDB locally or create a MongoDB Atlas database.
2. Create `backend/.env` from the example below.

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/budget_space
JWT_SECRET=replace_this_with_a_long_random_secret
CLIENT_URL=http://localhost:5173
```

Then:
```bash
cd backend
npm install
npm run dev
```

## Connect frontend to backend
Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

Restart Vite. Register/login will then use the backend.

## API
Auth:
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`

Budgets:
- `GET /api/v1/budgets`
- `POST /api/v1/budgets`
- `GET /api/v1/budgets/:id`
- `PUT /api/v1/budgets/:id`
- `DELETE /api/v1/budgets/:id`

Expenses:
- `GET /api/v1/budgets/:budgetId/expenses`
- `POST /api/v1/budgets/:budgetId/expenses`
- `PUT /api/v1/expenses/:id`
- `DELETE /api/v1/expenses/:id`

## Security
- Passwords are hashed.
- JWT is verified server-side.
- Budget ownership is checked server-side.
- Password hashes are never returned.
- Secrets belong in environment variables.
- Monetary amounts are represented in the smallest currency unit in the database (`amountMinor`).

## GitHub
```bash
git init
git add .
git commit -m "Initial Budget Space app"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

For a feature:
```bash
git checkout -b feature/analytics
git add .
git commit -m "Add analytics"
git push -u origin feature/analytics
```
