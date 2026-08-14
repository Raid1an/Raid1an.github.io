@echo off
chcp 65001 >nul
cd /d "D:\Program Files\My Blog"

echo ========================================
echo        Hexo Blog Quick Deploy
echo ========================================
echo.

REM Temporarily disable SSL verify (proxy TLS issue)
git config --global http.sslVerify false

REM Stage all changes
git add -A

REM Check if there are changes to commit
git diff --cached --quiet
if %errorlevel% equ 0 (
    echo No changes to deploy. Remote is up to date.
    git config --global --unset http.sslVerify
    echo.
    pause
    exit /b 0
)

REM Commit and push
for /f "tokens=*" %%t in ('powershell -Command "Get-Date -Format 'yyyy-MM-dd HH:mm:ss'"') do set TIMESTAMP=%%t
git commit -m "blog update %TIMESTAMP%"
if %errorlevel% neq 0 (
    echo Commit failed.
    git config --global --unset http.sslVerify
    pause
    exit /b 1
)

echo.
echo Pushing to hexo-source...
git push origin hexo-source
if %errorlevel% neq 0 (
    echo.
    echo Push failed. Retrying...
    timeout /t 3 >nul
    git push origin hexo-source
    if %errorlevel% neq 0 (
        echo.
        echo Push failed again. Please check network/proxy.
        git config --global --unset http.sslVerify
        pause
        exit /b 1
    )
)

REM Restore SSL verify
git config --global --unset http.sslVerify

echo.
echo ========================================
echo  Pushed! GitHub Actions will auto-deploy.
echo  Check: https://github.com/Raid1an/Raid1an.github.io/actions
echo  Blog:  https://Raid1an.github.io
echo ========================================
echo.
pause