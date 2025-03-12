# Node.js Ultimate Boilerplate 🚀

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![Joi](https://img.shields.io/badge/Joi-FFD700?style=for-the-badge&logo=javascript&logoColor=black)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Node-Cron](https://img.shields.io/badge/Node--Cron-43853D?style=for-the-badge&logo=javascript&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)

## 🚀 Introduction
A **highly scalable**, **configurable**, and **production-ready** Node.js boilerplate with best practices, environment management, and robust architecture. Built with Express.js, TypeScript, and MongoDB.

---

## 🎯 Features  

### ✅ **Structured Project Architecture**  
- **Microservice Pattern** – Designed for maintainability, scalability, and modular development.  

### ✅ **Environment Configurations**  
- **Flexible and Powerful** – Supports environment variables for seamless configuration.  
- **JavaScript-Based Configuration** – Allows adding any type of variables or data dynamically.  
- **No Symbol Restrictions** – Unlike traditional `.env` files, there are no limitations on using `#` or other special characters.  
- Ensures a **scalable, secure, and developer-friendly** approach to managing configurations. 🚀  

### ✅ **Logging**  
- Integrated **Winston** & **Morgan** for structured and efficient logging.  

### ✅ **Error Handling**  
- Centralized error-handling middleware for consistent and maintainable error management.  

### ✅ **Security Best Practices**  
- Implements **Helmet**, **CORS**, and **input sanitization** to protect against common vulnerabilities.  

### ✅ **Authentication & Authorization**  
- **JWT-based authentication** for secure API access control.  

### ✅ **Database Integration**  
- Supports **MySQL (Sequelize)** & **PostgreSQL (Sequelize)** for relational database management.  

### ✅ **Dockerized Deployment**  
- Pre-configured **Docker setup** for easy deployment across environments.  

### ✅ **Linting & Code Formatting**  
- Enforced **ESLint, Prettier, and Husky hooks** to maintain clean and consistent code.  

### ✅ **Testing Setup**  
- Configured **Jest & Supertest** for API testing to ensure reliability.  

### ✅ **CI/CD Ready**  
- **GitHub Actions** integrated for automated testing and deployment.  

## 📂 Project Structure

```
NODE-JS-BOILERPLATE
├── .github # GitHub-related workflows and configurations
├── config # Configuration files (MySQL, Redis, etc.)
│ ├── mysql.js
│ ├── redis.js
│ ├── redisChannels.js
├── constants # Global constants and messages
│ ├── catchMessages.js
│ ├── constants.js
│ ├── envVariables.js
│ ├── godAdmin.js
├── controllers # API controllers (handles requests & responses)
├── docs # Documentation files
├── env # Environment configuration files
├── middlewares # Express middlewares
├── models # Database models (Sequelize ORM)
├── objects # Object-specific utilities
├── public # Static files (images, styles, scripts)
├── routers # Express route definitions
├── services # Business logic and service layer
├── templates # Email templates or other template files
├── uploads # File uploads directory
├── utils # Utility/helper functions
├── validations # Request validation schemas
├── views # Server-side rendered views (if applicable)
│ ├── .gitattributes # Git attributes configuration
│ ├── .gitignore # Files and directories to ignore in Git
│ ├── index.js # View engine entry point
│ ├── package-lock.json # Package lock file
│ ├── package.json # Node.js dependencies and scripts
│ ├── README.md # Documentation file for views
│
├── .gitattributes # Git attributes configuration
├── .gitignore # Files and directories to ignore in Git
├── index.js # Application entry point
├── package-lock.json # Package lock file
├── package.json # Node.js dependencies and scripts

```

---

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16+)
- Mysql/PostgreSQL (Optional for database setup)
- Docker (Optional for containerization)

### Clone Repository
```sh
git clone https://github.com/bharatsewani1993/nodejs-boilerplate.git
cd nodejs-boilerplate
```

### Install Dependencies
```sh
npm install
```

## 🌍 Environment Setup  

In the project, navigate to the **`env/`** folder, where you'll find the following configuration files:  

- **`local.js`** – Local development environment  
- **`development.js`** – Development environment  
- **`stage.js`** – Staging environment  
- **`prod.js`** – Production environment  

### 🔹 How to Modify Environment Configurations  
1. **Edit Existing Configs** – Open the corresponding file (`local.js`, `prod.js`, etc.) and update configurations as needed.  
2. **Add a New Environment** –  
   - Create a new file inside the `env/` folder (e.g., `custom.js`).  
   - Update **`index.js`** in the same folder to load the newly created environment.  

### 🚀 Why This Approach?  
✅ Supports **multiple environment configurations simultaneously**.  
✅ Easily switch between different environments without modifying a single `.env` file.  
✅ Enhances **flexibility** and **maintainability** in complex setups.  

## 🚀 Run the Application  

Start the application in **local development mode** with automatic restarts on file changes:  
```sh
npm run local
```

Start the application in **development mode**:  
```sh
npm run dev
```

Start the application in **production mode**:  
```sh
npm run prod
```


## 📜 License
This project is licensed under the **MIT License**.

---

## 🙌 Contributing
Feel free to submit issues and pull requests!

```sh
git checkout -b feature-branch
# Make changes
git commit -m "feat: add new feature"
git push origin feature-branch
```

---

## 🌎 Connect with Me  

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/bharatsewani1993) 
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/bharatsewani1993) 
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/bharatsewani199) 
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/sewani.bharat) 
[![Facebook](https://img.shields.io/badge/Facebook-1877F2?style=for-the-badge&logo=facebook&logoColor=white)](https://facebook.com/bharat.sewani.12)  
[![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/@BharatSewani) 
[![Website](https://img.shields.io/badge/Website-000000?style=for-the-badge&logo=google-chrome&logoColor=white)](https://bharatsewani1993.github.io) 
[![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/918890680093)  

---

⭐ **Star this repo if you found it useful!** ⭐