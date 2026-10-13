# 🎯 Deep Work To-Do App

A focus-oriented task management application designed to eliminate distractions and promote sustained [Deep Work](https://calnewport.com/deep-work-rules-for-focused-success-in-a-distracted-world/) sessions. 

Unlike traditional task managers, this app helps you plan structured focus blocks, capture mid-session distractions without losing focus, and track your total deep work hours over time.

> ⚠️ **Project Status:** *In Active Development* 🚧  
> This project was recently started and is currently a work in progress. Some features listed below may still be under implementation.

---

## ✨ Features

- 📝 **Core Task Management:** Create, view, update, and complete tasks seamlessly.
- ⏱️ **Custom Deep Work Blocks:** Structure and customize focus sessions to fit your workflow.
- 📓 **Distraction Notepad:** A quick-access side-notepad to jot down intrusive thoughts or spontaneous tasks without interrupting your active focus session.
- 📅 **Deep Work Analytics:** A visual calendar showing your accumulated deep work hours across days and weeks.
- 🔐 **User Management:** Secure authentication (Sign Up, Login, Logout) for personalized workspaces.

---

## 🛠️ Tech Stack

- **Backend:** Python / Django
- **Frontend:** HTML5, CSS3, JavaScript
- **Database:** MySQL
- **Authentication:** Session-based / JWT

---

## 🚀 Getting Started

### Prerequisites

* Python 3.13.5
* Git

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Davidgp04/DeepWorkManager](https://github.com/Davidgp04/DeepWorkManager.git)
   cd src
   ```
2. **Set up a virtual environment**
   ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```
3. **Install dependencies**
  ```bash
  pip install -r requirements.txt
```
4. **Run migrations and start the server**
  ```bash
  python manage.py migrate
  python manage.py runserver
```
