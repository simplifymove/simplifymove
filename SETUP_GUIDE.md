# SimplifyMove - Setup & Deployment Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18+)
- **npm** or **yarn**
- **MySQL** (v8.0+)
- **Git**

---

## 🚀 Quick Start Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourname/simplifymove.git
cd simplifymove
```

### 2. Setup Frontend Environment

#### Install Dependencies
```bash
npm install
# or
yarn install
```

#### Create Environment File
Copy the example environment file and update with your local values:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

#### Run Development Server
```bash
npm run dev
# or
yarn dev
```
Frontend will be available at: `http://localhost:5173`

---

### 3. Setup Backend Environment

#### Navigate to Backend Folder
```bash
cd src/backend
```

#### Install Dependencies
```bash
npm install
```

#### Create Environment File
```bash
cp .env.example .env
```

Edit `.env` with your database credentials and configuration:
```env
NODE_ENV=development
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your-actual-password
DB_NAME=simplifymove

# JWT Secret - Use a strong random string
JWT_SECRET=your-super-secret-key-change-this

# CORS Configuration
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

#### Setup Database

**Option 1: Using Existing Database**
If you have an existing MySQL database, ensure it has the required tables. Then run:
```bash
npm start
```

**Option 2: Initialize Fresh Database**
```bash
# Create database tables
node init-database.js

# Seed with sample data (optional)
node seed.js
```

#### Start Backend Server
```bash
# Development with nodemon
npm run dev

# Production
npm start
```

Backend API will be available at: `http://localhost:5000`

---

## 📁 Project Structure

```
simplifymove/
├── src/
│   ├── backend/                 # Node.js Express API
│   │   ├── config/              # Database & app configuration
│   │   ├── controllers/         # Business logic
│   │   ├── models/              # Database models
│   │   ├── routes/              # API routes
│   │   ├── middleware/          # Express middleware
│   │   ├── utils/               # Utility functions
│   │   ├── server.js            # Main server file
│   │   └── .env.example         # Environment variables template
│   │
│   ├── components/              # React components
│   ├── App.tsx                  # Main App component
│   ├── main.tsx                 # React entry point
│   └── index.css                # Global styles
│
├── .env.example                 # Root environment template
├── .gitignore                   # Git ignore rules
├── package.json                 # Frontend dependencies
├── vite.config.ts              # Vite configuration
└── README.md                    # Project documentation
```

---

## 🔐 Environment Variables

### Frontend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:5173` |
| `FRONTEND_URL` | Frontend base URL | `http://localhost:5173` |

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Backend server port | `5000` |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_USER` | MySQL user | `root` |
| `DB_PASSWORD` | MySQL password | `password` |
| `DB_NAME` | Database name | `simplifymove` |
| `DB_PORT` | MySQL port | `3306` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `CORS_ORIGIN` | Allowed CORS origins | `http://localhost:5173` |
| `FRONTEND_URL` | Frontend URL for redirects | `http://localhost:5173` |

---

## 🔑 Important Security Notes

⚠️ **NEVER commit `.env` files to the repository!**

- The `.env` file is automatically ignored by `.gitignore`
- Use `.env.example` as a template for environment variables
- Always keep sensitive data (passwords, API keys, secrets) in `.env` files
- Change default JWT_SECRET in production
- Use strong, unique database passwords in production

---

## 🧪 Testing the Setup

### Test Frontend
```bash
npm run dev
# Visit http://localhost:5173
```

### Test Backend API
```bash
cd src/backend
npm start
# Visit http://localhost:5000/health
```

### Test Database Connection
```bash
cd src/backend
node check-db.js
```

---

## 📦 Building for Production

### Frontend Build
```bash
npm run build
# Output: dist/
```

### Backend Deployment
1. Set `NODE_ENV=production`
2. Update all security-sensitive environment variables
3. Run database migrations if needed
4. Deploy to your hosting platform

---

## 🐛 Troubleshooting

### Database Connection Error
- Verify MySQL is running
- Check DB credentials in `.env`
- Ensure database name exists

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process and restart
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors
- Check `CORS_ORIGIN` in `.env`
- Ensure both frontend and backend `.env` files are configured correctly

---

## 📝 Git Workflow

### Before First Push to GitHub
1. ✅ `.env` files are in `.gitignore`
2. ✅ `.env.example` files are committed (as templates)
3. ✅ No sensitive data in code
4. ✅ `node_modules/` is in `.gitignore`

### Push to GitHub
```bash
git add .
git status  # Verify .env is not included
git commit -m "Initial commit"
git push origin main
```

---

## 🤝 Contributing

1. Create a new branch for each feature
2. Keep `.env` files local and never commit them
3. Use `.env.example` to update the template if variables change
4. Test locally before pushing

---

## 📧 Support

For issues or questions, please check:
- Backend: [src/backend/README.md](src/backend/README.md)
- [API Documentation](src/backend/API_DOCUMENTATION.md)

---

## 📄 License

This project is licensed under the MIT License.
