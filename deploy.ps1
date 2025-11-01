# Fair++ Deployment Script
# This script helps automate the deployment process

param(
    [Parameter(Mandatory=$false)]
    [string]$Step = "all"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fair++ Deployment Helper" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

function Install-CLIs {
    Write-Host "Installing required CLIs..." -ForegroundColor Yellow
    
    # Install Railway CLI
    Write-Host "Installing Railway CLI..." -ForegroundColor Green
    npm install -g railway
    
    # Install Vercel CLI
    Write-Host "Installing Vercel CLI..." -ForegroundColor Green
    npm install -g vercel
    
    Write-Host "CLIs installed successfully!" -ForegroundColor Green
    Write-Host ""
}

function Setup-Railway {
    Write-Host "Setting up Railway MySQL Database..." -ForegroundColor Yellow
    Write-Host ""
    
    Write-Host "1. Logging in to Railway..." -ForegroundColor Cyan
    railway login
    
    Write-Host ""
    Write-Host "2. Initializing Railway project..." -ForegroundColor Cyan
    Set-Location backend
    railway init
    
    Write-Host ""
    Write-Host "3. Adding MySQL plugin..." -ForegroundColor Cyan
    Write-Host "   Select MySQL from the list when prompted" -ForegroundColor Yellow
    railway add
    
    Write-Host ""
    Write-Host "4. Getting database credentials..." -ForegroundColor Cyan
    railway variables
    
    Write-Host ""
    Write-Host "IMPORTANT: Copy the database credentials above!" -ForegroundColor Red
    Write-Host "You'll need them for the Render deployment" -ForegroundColor Yellow
    Write-Host ""
    
    Read-Host "Press Enter to continue..."
    Set-Location ..
}

function Deploy-Backend {
    Write-Host "Preparing backend for Render deployment..." -ForegroundColor Yellow
    Write-Host ""
    
    Set-Location backend
    
    Write-Host "Committing backend changes..." -ForegroundColor Cyan
    git add .
    git commit -m "Add production config and Render deployment"
    git push origin main
    
    Write-Host ""
    Write-Host "Backend code pushed to Git!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Go to https://render.com/dashboard" -ForegroundColor Cyan
    Write-Host "2. Click 'New +' -> 'Web Service'" -ForegroundColor Cyan
    Write-Host "3. Connect your Git repository" -ForegroundColor Cyan
    Write-Host "4. Use these settings:" -ForegroundColor Cyan
    Write-Host "   - Build Command: ./mvnw clean package -DskipTests" -ForegroundColor White
    Write-Host "   - Start Command: java -Dspring.profiles.active=prod -jar target/backend-0.0.1-SNAPSHOT.jar" -ForegroundColor White
    Write-Host "5. Add environment variables from Railway (see DEPLOYMENT_GUIDE.md)" -ForegroundColor Cyan
    Write-Host ""
    
    Read-Host "Press Enter when backend is deployed on Render..."
    
    Write-Host "Enter your Render backend URL (e.g., https://fairshare-backend.onrender.com):" -ForegroundColor Yellow
    $backendUrl = Read-Host
    
    # Save to file for later use
    Set-Content -Path "..\backend-url.txt" -Value $backendUrl
    
    Write-Host "Backend URL saved!" -ForegroundColor Green
    Set-Location ..
}

function Deploy-Frontend {
    Write-Host "Deploying frontend to Vercel..." -ForegroundColor Yellow
    Write-Host ""
    
    Set-Location frontend
    
    # Update .env.production with backend URL
    if (Test-Path "..\backend-url.txt") {
        $backendUrl = Get-Content "..\backend-url.txt"
        Set-Content -Path ".env.production" -Value "NEXT_PUBLIC_API_URL=$backendUrl/api"
        Write-Host "Updated .env.production with backend URL" -ForegroundColor Green
    }
    
    Write-Host "Committing frontend changes..." -ForegroundColor Cyan
    git add .
    git commit -m "Add production config for Vercel"
    git push origin main
    
    Write-Host ""
    Write-Host "Logging in to Vercel..." -ForegroundColor Cyan
    vercel login
    
    Write-Host ""
    Write-Host "Deploying to Vercel..." -ForegroundColor Cyan
    vercel --prod
    
    Write-Host ""
    Write-Host "Frontend deployed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "IMPORTANT: Don't forget to:" -ForegroundColor Yellow
    Write-Host "1. Add NEXT_PUBLIC_API_URL env var in Vercel dashboard" -ForegroundColor Cyan
    Write-Host "2. Update FRONTEND_URL in Render backend settings" -ForegroundColor Cyan
    Write-Host ""
    
    Set-Location ..
}

function Show-Summary {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Deployment Configuration Summary" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "Railway (MySQL):" -ForegroundColor Green
    Write-Host "  - Run 'railway variables' to see credentials" -ForegroundColor White
    Write-Host ""
    
    Write-Host "Render (Backend):" -ForegroundColor Green
    Write-Host "  Environment Variables Needed:" -ForegroundColor Yellow
    Write-Host "  - DATABASE_URL" -ForegroundColor White
    Write-Host "  - DB_USERNAME" -ForegroundColor White
    Write-Host "  - DB_PASSWORD" -ForegroundColor White
    Write-Host "  - FRONTEND_URL" -ForegroundColor White
    Write-Host "  - JWT_SECRET" -ForegroundColor White
    Write-Host "  - SPRING_PROFILES_ACTIVE=prod" -ForegroundColor White
    Write-Host ""
    
    Write-Host "Vercel (Frontend):" -ForegroundColor Green
    Write-Host "  Environment Variable Needed:" -ForegroundColor Yellow
    Write-Host "  - NEXT_PUBLIC_API_URL" -ForegroundColor White
    Write-Host ""
    
    Write-Host "For detailed instructions, see DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan
    Write-Host ""
}

# Main execution
switch ($Step) {
    "install" {
        Install-CLIs
    }
    "railway" {
        Setup-Railway
    }
    "backend" {
        Deploy-Backend
    }
    "frontend" {
        Deploy-Frontend
    }
    "summary" {
        Show-Summary
    }
    "all" {
        Write-Host "Running full deployment setup..." -ForegroundColor Cyan
        Write-Host ""
        
        Install-CLIs
        Setup-Railway
        Deploy-Backend
        Deploy-Frontend
        Show-Summary
    }
    default {
        Write-Host "Invalid step. Use: install, railway, backend, frontend, summary, or all" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Done! 🎉" -ForegroundColor Green
Write-Host ""
