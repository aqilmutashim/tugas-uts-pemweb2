@echo off
title Study Buddy - Web Application
echo ===================================================
echo     STUDY BUDDY - PLATFORM CARI TEMAN BELAJAR
echo ===================================================
echo Membuka aplikasi...

set NODE_EXEC=""

if exist "C:\Users\inkub\AppData\Roaming\Antigravity\bin\agy-node.cmd" (
    set NODE_EXEC="C:\Users\inkub\AppData\Roaming\Antigravity\bin\agy-node.cmd"
) else (
    where node >nul 2>nul
    if %errorlevel% equ 0 (
        set NODE_EXEC=node
    )
)

if not %NODE_EXEC%=="" (
    echo Menjalankan local server di port 3000...
    start http://localhost:3000
    %NODE_EXEC% server.js
) else (
    echo Node.js tidak terdeteksi. Membuka index.html langsung di browser...
    start index.html
)
pause
