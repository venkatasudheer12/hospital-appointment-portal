# CarePoint — Hospital Appointment Management Portal

A React + Vite frontend with a JSON Server REST API for managing doctors, patients, and appointments.

## Requirements
- Node.js (LTS recommended)
- npm

## Run the project

1. Open this folder in VS Code.
2. Install packages:
   ```bash
   npm install
   ```
3. Start the REST API in terminal 1:
   ```bash
   npm run server
   ```
   JSON Server runs at `http://localhost:3000`.
4. Start React in terminal 2:
   ```bash
   npm run dev
   ```
5. Open the local URL shown by Vite (usually `http://localhost:5173`).

Keep both terminals running while using the app.

## API endpoints
- `GET/POST /doctors`
- `GET/POST /patients`
- `GET/POST /appointments`
- Individual records support `GET`, `PUT`, `PATCH`, and `DELETE` by ID.

The initial `db.json` contains sample data. To start with an empty database, replace the arrays with empty arrays:

```json
{
  "doctors": [],
  "patients": [],
  "appointments": []
}
```

## Features
- Dashboard statistics and recent appointments
- Doctor CRUD, specialization search, availability management
- Patient CRUD and patient search
- Appointment creation, editing, cancellation, and deletion
- Appointment filters by date and status
- Validation for unavailable doctors and duplicate active doctor/time slots
- Responsive desktop and mobile layout

## Important note
This is an educational assignment demo. It is not intended for storing real patient or other sensitive medical information. The browser app does not include authentication or production-grade privacy/security controls.
