#  Leave & Productivity Analyzer

A premium full-stack web application built with **Next.js 16.x**, **Tailwind CSS 4.x**, and **Prisma/MongoDB** to analyze employee attendance, leave usage, and productivity directly from Excel data.

##  Features

- **Intuitive Dashboard**: Real-time analytics with a high-fidelity glassmorphic UI.
- **Excel Upload**: Seamlessly process `.xlsx` files with automatic data validation and normalization.
- **Auto-Calculations**:
  - Daily worked hours based on in-time and out-time.
  - Leave detection (Missing attendance on working days).
  - Productivity metrics (Actual vs. Expected).
- **Business Logic Integration**:
  - **Mon-Fri**: 8.5 hours (10:00 AM - 6:30 PM)
  - **Saturday**: 4.0 hours (10:00 AM - 2:00 PM) - Half Day
  - **Sunday**: Weekend / Off Day
  - **Leave Cap**: 2 allowed leaves per month calculation.
- **Relational Data**: Track multiple employees across different months and years.

##  Technology Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS 4.x
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: MongoDB (Atlas)
- **Excel Processing**: `xlsx` library

##  Getting Started

### Prerequisites

- Node.js 18.x or later
- MongoDB connection string (Atlas recommended)

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd leave-productivity-analyzer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="mongodb+srv://<username>:<password>@cluster0.mongodb.net/attendance_db?retryWrites=true&w=majority"
   ```

4. Push the schema to MongoDB:
   ```bash
   npx prisma db push
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

##  Sample Excel Format

The application expects an Excel file (`.xlsx`) with the following columns:

| Employee Name | Date | In-Time | Out-Time |

*Note: Missing In-Time/Out-Time values are automatically treated as Leave days.*


