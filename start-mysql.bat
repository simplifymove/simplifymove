@echo off
REM Run this as Administrator

echo Starting MySQL80 service...
net start MySQL80

if %errorlevel% neq 0 (
    echo Trying mysql-simplifymove service...
    net start mysql-simplifymove
)

echo.
echo Checking if MySQL is running on port 3306...
netstat -ano | findstr :3306

if %errorlevel% equ 0 (
    echo MySQL is running!
) else (
    echo MySQL failed to start. Try running this batch file as Administrator.
    echo Right-click the file and select "Run as administrator"
)

timeout /t 5
