# SkyMart ERP - Inventory & Sales Management System Frontend

SkyMart ERP is a comprehensive Enterprise Resource Planning (ERP) web application designed to streamline business operations. The frontend provides a modern, intuitive, and responsive dashboard that empowers users to manage inventory, process sales, and monitor business analytics. 

It features a robust **Role-Based Access Control (RBAC)** system, ensuring that Admins, Managers, and Employees have tailored access to specific modules (Dashboard, Products, Sales) based on their organizational permissions.

## Tech Stack

This project is built using modern web development standards to ensure high performance, maintainability, and an excellent user experience.

- **Framework:** React 19 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn UI (Radix UI primitives)
- **State Management & Data Fetching:** TanStack Query (React Query)
- **Routing:** React Router v7
- **Forms & Validation:** React Hook Form + Zod
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Notifications:** Sonner

## Environment Variables

To run this project locally, you need to configure the required environment variables. Create a `.env` file in the root directory of the frontend project and add the following:

| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `VITE_API_URL` | The base URL for the backend API | `http://localhost:5000/api` |

## Local Setup & Installation

Follow these steps to get the frontend application running on your local machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/skymart-erp-client.git
   cd skymart-erp-client
   ```

2. **Install dependencies:**
   Make sure you have [Node.js](https://nodejs.org/) installed, then run:
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root directory and add the `VITE_API_URL` as shown in the section above.

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the application:**
   Open your browser and navigate to `http://localhost:5173` to access the SkyMart ERP dashboard.

---

## Author
**Md. Ashikuzzaman Moon**  
Full Stack Web Developer


