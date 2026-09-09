# Synergy Desk

## Employee Management System

Synergy Desk is a web-based Employee Management System designed to manage employees, tasks, attendance, reports, and user authentication from a centralized dashboard.

The project uses a Spring Boot backend, MySQL database, and HTML/CSS/JavaScript frontend.

---

## Features

### 🔐 Authentication & Security

* User registration
* User login
* Password encryption using BCrypt
* JWT-based authentication
* Role-based authorization
* Admin and Employee roles
* Protected backend APIs
* Unauthorized users receive `403 Forbidden`

### 📊 Dashboard

* Total employees
* Active tasks
* Completed tasks
* Attendance overview
* Recent tasks
* Team members
* Quick Actions
* Today's attendance summary

### 👥 Employee Management

* View employees
* Add employees
* Employee information management
* Role-based access control

### 📋 Task Management

* Create tasks
* View tasks
* Edit tasks
* Delete tasks
* Update task status
* Pending status
* In Progress status
* Completed status

### 📅 Attendance Management

* Attendance overview
* Employee attendance management
* Attendance status

### 📈 Reports

* Attendance reports
* Employee report information
* Search/filter functionality
* Admin-only report access

### ⚙️ Settings

* Logged-in user information
* Account information
* Password reset/change functionality
* System information
* Logout functionality

### ⚡ Quick Actions

The dashboard provides quick navigation to:

* Add Employee
* Create Task
* Mark Attendance
* View Reports

---

## Technology Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* Live Server

### Backend

* Java
* Spring Boot
* Spring Security
* JWT Authentication
* Maven

### Database

* MySQL 8

### Development Tools

* Visual Studio Code
* MySQL
* Git
* GitHub

---

## Project Structure

```text
Synergy Desk/
│
├── frontend/
│   ├── index.html
│   ├── dashboard.html
│   ├── employees.html
│   ├── tasks.html
│   ├── attendance.html
│   ├── reports.html
│   ├── settings.html
│   ├── style.css
│   └── script.js
│
├── demo/
│   ├── .mvn/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/
│   │       │       └── example/
│   │       │           └── demo/
│   │       │               ├── config/
│   │       │               ├── controller/
│   │       │               ├── entity/
│   │       │               ├── model/
│   │       │               ├── repository/
│   │       │               ├── security/
│   │       │               └── service/
│   │       │
│   │       └── resources/
│   │           └── application.properties
│   │
│   ├── pom.xml
│   ├── mvnw
│   └── mvnw.cmd
│
└── README.md
```

---

## Backend Configuration

The backend runs on:

```text
http://localhost:8080
```

The frontend runs using Live Server, typically at:

```text
http://127.0.0.1:5500/frontend/
```

---

## Database Configuration

Create a MySQL database named:

```sql
CREATE DATABASE synergy_desk;
```

The backend uses MySQL for storing:

* Users
* Tasks
* Attendance records

Update the database configuration in:

```text
demo/src/main/resources/application.properties
```

Example configuration:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/synergy_desk
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

> Replace `YOUR_MYSQL_PASSWORD` with your local MySQL password.

---

## Requirements

Before running the project, install:

* JDK 21
* MySQL 8
* Visual Studio Code
* A modern web browser

The project currently uses Java 21.

Check Java version:

```cmd
java -version
```

Expected version:

```text
Java 21
```

---

## How to Run the Backend

Open Command Prompt.

Navigate to the backend folder:

```cmd
cd C:\Users\dushy\OneDrive\Desktop\Project\demo
```

Start Spring Boot:

```cmd
mvnw.cmd spring-boot:run
```

The backend should start on:

```text
http://localhost:8080
```

You should see:

```text
Tomcat started on port 8080
Started DemoApplication
```

Keep this Command Prompt window open while using the application.

---

## How to Run the Frontend

Open the project in Visual Studio Code.

Navigate to:

```text
frontend/dashboard.html
```

Right-click `dashboard.html`.

Select:

```text
Open with Live Server
```

The frontend will open in the browser.

Example:

```text
http://127.0.0.1:5500/frontend/dashboard.html
```

---

## Authentication Flow

The application uses JWT authentication.

### Login

The user sends their email and password to:

```text
POST /api/auth/login
```

After successful login, the backend returns a JWT token.

The frontend stores the authentication token in browser local storage.

Protected API requests automatically send:

```text
Authorization: Bearer <JWT_TOKEN>
```

---

## User Roles

The application supports two primary roles:

### ADMIN

Admin users can access administrative features such as:

* Employee management
* Reports
* Dashboard
* Tasks
* Attendance
* Settings

### EMPLOYEE

Employees can access permitted employee features.

Administrative APIs such as reports are protected from employee access.

---

## Security

Spring Security is used to protect backend APIs.

The project uses:

* JWT authentication
* BCrypt password hashing
* Stateless authentication
* Role-based authorization
* Protected API endpoints

Examples of protected endpoints include:

```text
/api/users/**
/api/reports/**
/api/tasks/**
/api/attendance/**
/api/dashboard/**
```

Admin-only endpoints include:

```text
/api/users/**
/api/reports/**
```

Unauthenticated authentication endpoints include:

```text
/api/auth/**
```

---

## API Overview

### Authentication

```text
POST /api/auth/login
POST /api/auth/register
POST /api/auth/reset-password
```

### Employees

```text
/api/users/**
```

### Tasks

```text
/api/tasks/**
```

### Attendance

```text
/api/attendance/**
```

### Reports

```text
/api/reports/**
```

### Dashboard

```text
/api/dashboard/**
```

---

## Build the Backend

To create the production JAR file:

```cmd
cd C:\Users\dushy\OneDrive\Desktop\Project\demo
mvnw.cmd clean package -DskipTests
```

A successful build displays:

```text
BUILD SUCCESS
```

The generated JAR is located at:

```text
demo/target/demo-0.0.1-SNAPSHOT.jar
```

---

## Run the Built JAR

After successfully building the project:

```cmd
cd C:\Users\dushy\OneDrive\Desktop\Project\demo
java -jar target\demo-0.0.1-SNAPSHOT.jar
```

The backend will run on:

```text
http://localhost:8080
```

---

## Testing

The following functionality has been tested:

* [x] Backend starts successfully
* [x] MySQL connection works
* [x] User login works
* [x] JWT token generation works
* [x] Admin authorization works
* [x] Employee authorization works
* [x] Dashboard loads
* [x] Employee management works
* [x] Task management works
* [x] Attendance page works
* [x] Reports page works
* [x] Settings page works
* [x] Quick Actions work
* [x] Frontend navigation works
* [x] Maven package build succeeds

---

## Security Test

Administrative report access was tested using an Employee account.

When an Employee attempts to access the protected Reports API, the backend returns:

```text
403 Forbidden
```

An Admin account can successfully access the Reports API.

This confirms that role-based authorization is functioning.

---

## Common Issues

### Port 8080 Already in Use

Check running Java processes:

```cmd
tasklist | findstr java
```

Stop Java processes if necessary:

```cmd
taskkill /F /IM java.exe
```

Then restart the backend:

```cmd
mvnw.cmd spring-boot:run
```

### Maven Clean Fails

If Windows is locking the `target` directory:

```cmd
taskkill /F /IM java.exe
```

Then:

```cmd
rmdir /s /q target
```

Finally:

```cmd
mvnw.cmd clean package -DskipTests
```

### Frontend Does Not Open

Make sure Live Server is running.

Open:

```text
frontend/dashboard.html
```

using:

```text
Right Click → Open with Live Server
```

---

## Backup

A working backup of the project can be created using:

```cmd
cd C:\Users\dushy\OneDrive\Desktop\Project
powershell -Command "Compress-Archive -Path frontend,demo -DestinationPath Synergy-Desk-Final.zip -Force"
```

The backup file will be created as:

```text
Synergy-Desk-Final.zip
```

---

## Future Improvements

Possible future improvements include:

* Email notifications
* Employee profile pictures
* Advanced attendance analytics
* Export reports to PDF/Excel
* Search and pagination improvements
* Dashboard charts
* Forgot-password email verification
* Improved password-change security
* Production deployment
* HTTPS configuration
* Automated unit and integration tests

---

## Author

**Dushyant Kumar**

### Project

**Synergy Desk – Employee Management System**

### Purpose

Academic / MCA Project

---

## License

This project is created for educational and academic purposes.

---

## Project Status

**Status: Completed and Working**

The current version has been successfully built and tested locally with:

```text
Java 21
Spring Boot
Spring Security
JWT
MySQL 8
HTML
CSS
JavaScript
```

Backend build status:

```text
BUILD SUCCESS
