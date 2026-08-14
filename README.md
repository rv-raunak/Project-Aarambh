# 🛒 Project Aarambh

[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://java.com/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-F2F4F9?style=for-the-badge&logo=spring-boot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)

> A comprehensive, full-stack e-commerce web application featuring a robust RESTful API built with Java/Spring Boot and a modern, responsive Single Page Application (SPA) powered by React and Vite.

---

## 📑 Table of Contents
- [Overview](#-overview)
- [Directory & File Structure](#-directory--file-structure)
- [Backend Architecture](#️-backend-architecture-spring-boot)
- [Frontend Architecture](#-frontend-architecture-react--vite)
- [Data Flow](#-end-to-end-data-flow)
- [Local Setup & Developer Guide](#️-local-setup--developer-guide)

---

## 🚀 Overview
**Project Aarambh** is designed to demonstrate a complete, modern web-development lifecycle. It handles everything from server-side data persistence and binary image storage to client-side state management and responsive UI rendering. 

---

## 📁 Directory & File Structure

<details>
<summary><b>Click to expand the full workspace directory tree</b></summary>

```text
Project-Aarambh/
├── project-aarambh-backend/
│   └── project-aarambh/
│       ├── .gitattributes
│       ├── .gitignore
│       ├── HELP.md
│       ├── mvnw                 (Maven wrapper script for Unix)
│       ├── mvnw.cmd             (Maven wrapper script for Windows)
│       ├── pom.xml              (Maven configuration and dependencies)
│       ├── .mvn/                (Maven wrapper configuration folder)
│       └── src/
│           └── main/
│               ├── java/com/springBuster/project_aarambh/
│               │   ├── ProjectAarambhApplication.java   (Main Spring Boot entry point)
│               │   ├── controller/
│               │   │   └── ProductController.java       (REST endpoints API definition)
│               │   ├── model/
│               │   │   └── Product.java                 (Database Entity definition)
│               │   ├── repository/
│               │   │   └── ProductRepo.java             (Spring Data JPA repository interface)
│               │   └── service/
│               │       └── ProductService.java          (Business logic layer)
│               └── resources/
│                   ├── application.properties           (Spring Boot configuration)
│                   ├── data.sql                         (Database seed SQL script)
│                   ├── static/                          (Empty - for static web assets if any)
│                   └── templates/                       (Empty - for server-side view templates)
│
└── project-aarambh-frontend/
    └── frontend/
        ├── .eslintrc.cjs        (ESLint configuration for React/JS)
        ├── .gitignore
        ├── index.html           (Main HTML entry point for the Vite app)
        ├── package-lock.json    (Locked dependency tree)
        ├── package.json         (Node.js dependencies and npm scripts)
        ├── README.md
        ├── vite.config.js       (Vite build and plugin configuration)
        ├── public/
        │   └── vite.svg         (Publicly accessible asset)
        └── src/
            ├── App.css          (Global styling for App)
            ├── App.jsx          (Root React component)
            ├── index.css        (Base global styles)
            ├── main.jsx         (React mounting script)
            ├── axios.jsx        (Axios instance configuration)
            ├── assets/
            │   ├── react.svg
            │   └── unplugged.png
            ├── components/
            │   ├── AddProduct.jsx    (Component: Form to add a new product)
            │   ├── Cart.jsx          (Component: Shopping cart view)
            │   ├── CheckoutPopup.jsx (Component: Checkout confirmation modal)
            │   ├── Home.jsx          (Component: Landing page showing product list)
            │   ├── Navbar.jsx        (Component: Top navigation bar)
            │   ├── Product.jsx       (Component: Detailed view of a single product)
            │   └── UpdateProduct.jsx (Component: Form to edit an existing product)
            └── Context/
                └── Context.jsx       (React Context API for global state management)
```
</details>

---

## ⚙️ Backend Architecture (Spring Boot)

### 🛠️ Technology Stack
* **Language:** Java 21
* **Framework:** Spring Boot (Spring WebMVC, Spring Data JPA)
* **Database:** H2 In-Memory Database (Ideal for rapid development and testing)
* **Utilities:** Lombok (reduces boilerplate), Jackson (JSON Serialization)
* **Build Tool:** Maven

### 🧩 Component Details
The backend strictly follows a layered MVC design pattern:

* **`model/Product.java`**: The core data entity. Maps to the database using `@Entity`. Handles date formatting via `@JsonFormat` and stores image binaries directly using a `byte[]` array annotated with `@Lob`.
* **`controller/ProductController.java`**: Exposes the `/api` RESTful endpoints. Secured with `@CrossOrigin` for Vite compatibility. Handles complete CRUD operations, complex search queries, and multipart file uploads (`@RequestPart`).
* **`service/ProductService.java`**: The business logic layer. Processes multipart image uploads, extracts metadata, and orchestrates repository calls.
* **`repository/ProductRepo.java`**: A `JpaRepository` interface that handles database transactions and includes custom JPQL for keyword-based search functionality across multiple fields.

### 🗄️ Configuration and Seed Data
* **`application.properties`**: Configures the H2 database connection (`jdbc:h2:mem:dbAarambh`), Hibernate DDL auto-updates, and sets a 10MB limit for multipart image uploads.
* **`data.sql`**: Automatically seeds the database on startup with 5 mock products (e.g., iPhone 15, MacBook Air M3) so the UI is populated immediately.

---

## 💻 Frontend Architecture (React + Vite)

### 🎨 Technology Stack
* **Framework:** React 18, bootstrapped with Vite for blazing-fast HMR and building.
* **Routing:** React Router DOM (v6.22)
* **HTTP Client:** Axios (v1.6)
* **Styling/UI:** Bootstrap (v5.3), React Bootstrap, Bootstrap Icons, custom Sass/CSS.

### 🔍 Component Deep Dive
* **State Management (`Context.jsx`)**: Utilizes the React Context API to manage global application states, such as the shopping cart, avoiding deep prop-drilling.
* **API Configuration (`axios.jsx`)**: Standardizes the Axios instance to point to the Spring Boot backend (`http://localhost:8080/api`).
* **UI Components**:
  * `Home.jsx` & `Product.jsx`: Fetches data from the API and dynamically renders product grids. Images are fetched via dynamic URLs mapping directly to the backend's blob storage.
  * `AddProduct.jsx` & `UpdateProduct.jsx`: Handles complex form submissions, packaging JSON data and binary `File` objects into `FormData` for backend consumption.
  * `Cart.jsx` & `CheckoutPopup.jsx`: Manages the user's active shopping session and checkout process.

---

## 🔄 End-to-End Data Flow

1. **Initialization**: The Spring Boot backend starts up, generates the database schema in H2, and runs `data.sql` to populate mock data.
2. **Client Request**: The user loads the Vite application. `Home.jsx` triggers an `axios.get()` call to fetch the catalog.
3. **Data Retrieval**: The `ProductController` routes the request through the service layer to the repository, fetching records and returning a structured JSON response.
4. **Image Rendering**: The React frontend maps over the JSON. For images, it requests standard `<img>` source URLs mapping back to `/api/product/{id}/image`. The backend serves these raw bytes with the appropriate MIME type.
5. **Data Mutation (e.g., Add/Edit)**: The frontend packages text and image files into a `FormData` object, sending a `POST/PUT` request. The backend parses this, converts the image to a byte array, and persists the new entity to the database.

---

## 🛠️ Local Setup & Developer Guide

Follow these steps to run the application locally on your machine.

### Prerequisites
* Java 21 or higher
* Node.js (v18+) and npm
* Maven (Optional: `mvnw` wrapper is included)

### ⚠️ Step 1: Database Configuration
For security, active database credentials are not stored in this repository. 
1. Navigate to `project-aarambh-backend/project-aarambh/src/main/resources/`.
2. Copy `application.properties.example` and rename the copy to `application.properties`.
3. Open `application.properties` and replace the placeholder `YOUR_DATABASE_PASSWORD_HERE` with your actual local credentials. *(Note: If you remain on the H2 in-memory DB, no password changes are strictly necessary).*

### 🖥️ Step 2: Running the Backend
Open a terminal and navigate to the backend directory:
```bash
cd project-aarambh-backend/project-aarambh
```
Run the Spring Boot application using the Maven wrapper:
* **Windows:** `mvnw.cmd spring-boot:run`
* **Mac/Linux:** `./mvnw spring-boot:run`

*The API will be available at `http://localhost:8080`.*

### 📱 Step 3: Running the Frontend
Open a new terminal window and navigate to the frontend directory:
```bash
cd project-aarambh-frontend/frontend
```
Install the necessary Node dependencies:
```bash
npm install
```
Start the Vite development server:
```bash
npm run dev
```
*The frontend will be available at `http://localhost:5173`.*

---

<p align="center">
  <b>Created by Vaibhav Mishra @2026</b><br>
  <sub><i>Licensed under the MIT License. All rights reserved.</i></sub>
</p>