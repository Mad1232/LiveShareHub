# 🚀 Welcome to **LiveShareHub**

**LiveShareHub** is a full-stack collaboration platform that enables **real-time file and code sharing**. I created this project for fun, and to sharpen my skills across **frontend**, **backend**, **databases**, and **CI/CD pipelines**.

> 🔒 All sensitive files like database credentials are hidden via `.gitignore`.

---

#### 🧠 What It Does

This project lets users:
- Collaborate live by sharing code and files in real time
- Experience seamless syncing through **WebSocket connections**
- Work across **frontend**, **backend**, and **database layers** in one integrated system

---

#### ⚙️ **Tech Stack**

##### 🌐 Frontend
- **Angular** (TypeScript)
- **Bootstrap** and custom **CSS**

##### 🔧 Backend
- **ASP.NET Core (C#)**
- **Swagger** for API documentation and testing
- **WebSockets** for real-time shared sessions

##### 🗄️ Database
- **Oracle XE** running inside **Docker**

##### ☁️ Deployment
- Deployed on **localhost**
- Also deployed on **AWS EC2** (now terminated to avoid charges)
- Uses **Jenkins** (via Docker) for **CI/CD**

---

#### 🌿 Branch Structure

```bash
main                    # Contains code for full local deployment
AWS_Deployment_Latest  # AWS deployment code & configuration
