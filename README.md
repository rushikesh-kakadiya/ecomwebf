# 🛍️ ecomweb - The Online Shopping WebApp

Welcome to **ecomweb**, a modern, high-performance e-commerce platform designed to deliver a seamless shopping experience. Built with cutting-edge technologies, **ecomweb** ensures a fast, secure, and scalable solution for online businesses.

---

## 🚀 Overview

ecomweb is a fully-fledged e-commerce website tailored for **Adaa, a premium footwear brand**. It offers an intuitive user interface, responsive design, and smooth browsing to enhance customer engagement. Whether you're a small business or a large enterprise, **ecomweb** provides all the essential features to run a successful online store.

---

## ⚙️ Setup Instructions

Follow these steps to set up and run **ecomweb** locally:

### 1️⃣ Clone the Repository
```bash
mkdir ecomwebsite
cd ecomwebsite
git clone https://github.com/rushikesh-kakadiya/ecomwebf.git
git clone https://github.com/rushikesh-kakadiya/ecomweb.git
```

### 2️⃣ Install Dependencies
#### Backend (Node.js + Express + PostgreSQL)
```bash
cd ecomweb
npm install
```

#### Frontend (Vite + TypeScript)
```bash
cd ../ecomwebf
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env` file in both `backend` and `frontend` directories and configure necessary environment variables.
For frontend : VITE_API_ENDPOINT = "backend_url", VITE_STRIPE_KEY = "stripe_publication_key"
For backend : FURL = "frontend_url", "secret_key" = "stripe_secreat_key"

### 4️⃣ Start the Development Servers
#### Backend
```bash
npx sequelize-cli db:create
npx sequelize-cli db:migrate
npm run start
```

#### Frontend
```bash
npm run dev
```

Your e-commerce website should now be running locally! 🎉

---

## 🌍 Live Demo

🔗 **Frontend Hosting:** [https://ecomwebf.netlify.app](#)  
🔗 **Backend Hosting:** [https://ecomweb-2k04.onrender.com](#)  

---

## 🌟 Key Features

✅ **Automated Product Slider** - Enhances the UI with a smooth auto-scrolling product showcase.  
✅ **Responsive & Intuitive UI** - Ensures a seamless experience across all devices.  
✅ **Secure & Scalable Backend** - Powered by **Node.js, Express, and PostgreSQL**.  
✅ **High-Speed Performance** - Built with **Vite and TypeScript** for optimized performance.  
✅ **Product Containers** - Each product is neatly designed in an aesthetic container box.  
✅ **Modern Tech Stack** - Ensures long-term maintainability and scalability.  

---

## 🛠️ Tech Stack

| Technology | Usage |
|------------|-------|
| **Frontend** | Vite + TypeScript |
| **Backend** | Node.js + Express |
| **Database** | PostgreSQL |
| **Styling** | Tailwind CSS |
| **State Management** | React Context API / Redux (if needed) |
| **Authentication** | JWT / OAuth |
| **Deployment** | Docker, Vercel, or Heroku |

---

## 🎯 Contributing

We welcome contributions! Feel free to **fork the repo**, make improvements, and submit a **pull request**.

---

## 📄 License

This project is licensed under the **MIT License**.

---

### ⭐ Show Your Support!
If you like **ecomweb**, give it a ⭐ on GitHub and share it with your friends! 🚀