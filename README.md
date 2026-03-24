# ZKWeb - ZKTeco ADMS Server

A Laravel 10 + React (Inertia) application designed to receive and monitor attendance logs from ZKTeco devices using the ADMS protocol.

## 🚀 How to Run

Since PHP is in a custom location, I have created two easy-to-use batch files:

### 1. Start Laravel Server
Double-click **`run_laravel.bat`** or run:
```powershell
C:\Users\User\Downloads\php\php.exe artisan serve --host=0.0.0.0
```

### 2. Start Frontend (React)
Double-click **`run_vite.bat`** or run:
```powershell
npm run dev
```

### 3. Setup Database
- Ensure **XAMPP MySQL** is running.
- The project automatically uses the `laravel` database (created during setup).

## 📡 Connecting Your Device
To connect your ZKTeco F22:
1. Go to **Comm.** -> **ADMS** / **Cloud Server**.
2. **Server Address**: Your PC's Local IP or Domain.
3. **Server Port**: `80` (Standard HTTP).
4. **Communication Protocol**: PUSH / ADMS.

Visit [http://127.0.0.1:8000](http://127.0.0.1:8000) to view the Attendance Monitor.
