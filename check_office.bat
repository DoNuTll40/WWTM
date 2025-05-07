@echo off
:: ตรวจสอบสิทธิ์ว่ารันเป็น Administrator หรือไม่
net session >nul 2>&1
if %errorlevel% neq 0 (
    powershell -Command "Start-Process '%~0' -Verb RunAs"
    exit /b
)

:: ไปยังโฟลเดอร์ Office16
CD "%SystemDrive%\Program Files\Microsoft Office\Office16" || (
    pause
    exit /b
)

:: แสดงสถานะการใช้งาน
cscript ospp.vbs /dstatus
pause
