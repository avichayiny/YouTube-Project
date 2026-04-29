# 🎬 Full-Stack Video Platform

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

A cross-platform video-sharing application inspired by YouTube. This project encompasses a modern Web application, a native Android mobile client, and a robust backend API, demonstrating end-to-end full-stack development capabilities and team collaboration.

## 🏗️ Tech Stack & Architecture

* **Web Client:** A modern frontend interface built with **React**.
* **Mobile Client (Android):** Developed in **Java** using Android Studio. The app implements the **MVVM** architecture, utilizing **Room** for local database storage and **Retrofit** for seamless REST API network requests.
* **Backend API:** Constructed with **Node.js** and Express, following the **MVC** architecture. It serves as a central RESTful API communicating with a **MongoDB** database.
* **Recommendation Microservice:** A basic multithreaded **C++** server integrated to compute and provide video recommendations.
* **Workflow & DevOps:** Version control managed via **Git**, with agile project tracking and task management using **Jira**.

## ⭐ Key Features

* Cross-platform synchronization (users can interact seamlessly across Web and Mobile).
* Video browsing, uploading, and user interactions (likes, comments).
* Local data persistence on mobile devices for smoother performance.
* Secure user authentication and data management.

## 📸 Sneak Peek

<p align="center">
  <img src="./wiki-pages/demo.gif" width="750" alt="Application Screenshot">
</p>

## 📁 Repository Structure

* `/web-client` - React source code, components, and styling.
* `/Android-client` - Android Studio project (MVVM, Room, Retrofit).
* `/server-side` - Node.js Express application (MVC structure).
* `/UpdateServer.cpp` - Multithreaded C++ server.
* `/wiki-pages` - Documentation, screenshots, and visual assets.

## 🛠️ Getting Started

### Prerequisites
* Node.js
* MongoDB
* Android Studio (for running the mobile client)

### Running the Project

1. **Start the Database & Node Server:**
   ```bash
   cd server-side
   npm install
   npm start
2. **Start the Recommendation Engine:**
   ```bash
   g++ -pthread UpdateServer.cpp -o UpdateServer
   ./UpdateServer
3. **Run the Web Client:** 
  cd web-client
  npm install
  npm start
4. **Run the Mobile Client:**
   * Open Android Studio.
   * Select `Open an existing project` and navigate to the `/Android-client` folder.
   * Wait for Gradle to sync.
   * Click the **Run** button to launch the app on an emulator or a physical device.
