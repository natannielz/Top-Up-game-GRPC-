@echo off
echo Starting MongoDB...

REM Create DB directory if it doesn't exist
if not exist "C:\data\db" (
    echo Creating database directory C:\data\db...
    mkdir "C:\data\db"
)

REM Check if MongoDB is already running
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo MongoDB is already running!
    exit /b 0
)

REM Try to start MongoDB with default path
echo Attempting to start MongoDB...

REM Check Local Portable Version (Priority)
if exist "%~dp0tools\mongodb-win32-x86_64-windows-7.0.12\bin\mongod.exe" (
    echo Found local MongoDB!
    start "MongoDB" "%~dp0tools\mongodb-win32-x86_64-windows-7.0.12\bin\mongod.exe" --dbpath="C:\data\db" --bind_ip 127.0.0.1
    echo MongoDB started successfully!
    exit /b 0
)

REM Check if mongod is in PATH
where mongod >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    start "MongoDB" mongod --dbpath="C:\data\db"
    echo MongoDB started successfully!
    exit /b 0
)

REM Try common installation paths
if exist "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" (
    start "MongoDB" "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath="C:\data\db"
    echo MongoDB started successfully!
    exit /b 0
)

if exist "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" (
    start "MongoDB" "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath="C:\data\db"
    echo MongoDB started successfully!
    exit /b 0
)

if exist "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" (
    start "MongoDB" "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" --dbpath="C:\data\db"
    echo MongoDB started successfully!
    exit /b 0
)

echo ERROR: MongoDB not found. Please install MongoDB or add it to your PATH.
exit /b 1
