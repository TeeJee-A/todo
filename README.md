# Full Stack To-Do List App

This is a full-stack To-Do List application built with:

- **Backend**: Laravel + JWT + PostgreSQL
- **Frontend**: Vue 3 + Pinia + TailwindCSS + shadcn-ui + Axios
- **Authentication**: Secure JWT

---

## 📚 Features

### 🔐 Authentication (JWT)

- Register with: full name, email, phone number, address, image, password
- Login returns a valid JWT
- Protected task routes using `Authorization: Bearer <token>`

---

## 🏗 Project Structure

todo/
├── todo-backend/ # Laravel 11 (API + JWT + Pusher)
├── todo-frontend/ # Vue 3 + Pinia + TailwindCSS + Echo
└── README.md

## 🚀 Getting Started

### 🔧 Backend Setup (Laravel + PostgreSQL)

1. Clone and move into the backend directory:

```bash
git clone https://github.com/your-username/todo-fullstack.git
cd todo/todo-backend

**Install dependencies:
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
```

**Update .env with your database and Pusher credentials:**
DB_CONNECTION=pgsql
DB_DATABASE=todo
DB_USERNAME=postgres
DB_PASSWORD=yourpassword

**Run migrations:**

```bash
php artisan migrate
```

**serve the backend API:**

```bash
php artisan serve
```

**_Open a new terminal and go to the frontend directory:_**

```bash
cd ../todo-frontend

**Install dependencies:
pnpm install
```

**Run the frontend app:**
```bash
pnpm dev
```
