@echo off
echo ========================================================
echo   Pushing Foodly to GitHub (Pranjal6311/foodly)
echo ========================================================
cd /d "%~dp0"
git branch -M main
git push -u origin main --force
if %errorlevel% neq 0 (
    echo.
    echo ----------------------------------------------------
    echo If authentication failed, you can provide your GitHub
    echo Personal Access Token (PAT) with repo scope:
    echo.
    set /p GITHUB_TOKEN="Enter your GitHub Token (or press Enter to exit): "
    if not "%GITHUB_TOKEN%"=="" (
        git push https://%GITHUB_TOKEN%@github.com/Pranjal6311/foodly.git main --force
    )
    echo ----------------------------------------------------
)
pause
