# Deployment Guide for Fair++ Application

This guide walks you through deploying your Next.js frontend to Vercel, Spring Boot backend to Render, and MySQL database to Railway with automatic configuration.

## Prerequisites

- Git repository pushed to GitHub/GitLab/Bitbucket
- Node.js and npm installed locally
- Railway account (https://railway.app)
- Render account (https://render.com)
- Vercel account (https://vercel.com)

## Step 1: Deploy MySQL Database on Railway

### 1.1 Install Railway CLI
```bash
npm install -g railway
```

### 1.2 Login to Railway
```bash
railway login
```

### 1.3 Create Railway Project
```bash
cd backend
railway init
```
Follow the prompts to create a new project.

### 1.4 Add MySQL Plugin
```bash
railway add
```
Select **MySQL** from the list.

### 1.5 Get Database Credentials
```bash
railway variables
```

Copy these values - you'll need them for Render:
- `MYSQLHOST`
- `MYSQLPORT`
- `MYSQLDATABASE`
- `MYSQLUSER`
- `MYSQLPASSWORD`

Or construct the DATABASE_URL in this format:
```
jdbc:mysql://MYSQLHOST:MYSQLPORT/MYSQLDATABASE
```

## Step 2: Deploy Spring Boot Backend to Render

### 2.1 Push Code to Git
Ensure your backend code (including the new `render.yaml`) is committed and pushed:
```bash
cd backend
git add .
git commit -m "Add production config and Render deployment"
git push origin main
```

### 2.2 Create Render Web Service

1. Go to https://render.com/dashboard
2. Click **New +** → **Web Service**
3. Connect your Git repository
4. Select your repository
5. Configure the service:
   - **Name**: `fairshare-backend`
   - **Environment**: `Java`
   - **Region**: Select nearest region
   - **Branch**: `main`
   - **Build Command**: `./mvnw clean package -DskipTests`
   - **Start Command**: `java -Dspring.profiles.active=prod -jar target/backend-0.0.1-SNAPSHOT.jar`

### 2.3 Set Environment Variables

In the Render dashboard, add these environment variables:

```
DATABASE_URL=jdbc:mysql://MYSQLHOST:MYSQLPORT/MYSQLDATABASE
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password
FRONTEND_URL=https://your-app.vercel.app
JWT_SECRET=your-generated-jwt-secret-here
SPRING_PROFILES_ACTIVE=prod
PORT=8080
```

**Important**: 
- Replace the Railway MySQL values
- You'll update `FRONTEND_URL` after Vercel deployment
- Generate a strong JWT secret: `openssl rand -base64 32`

### 2.4 Enable Auto-Deploy

In Render settings:
1. Go to **Settings** → **Auto-Deploy**
2. Enable **Auto-Deploy** for your main branch
3. Render will automatically deploy on every git push

### 2.5 Note Your Backend URL

After deployment, copy your backend URL:
```
https://fairshare-backend.onrender.com
```

## Step 3: Deploy Next.js Frontend to Vercel

### 3.1 Install Vercel CLI
```bash
npm install -g vercel
```

### 3.2 Push Frontend Code
```bash
cd frontend
git add .
git commit -m "Add production config for Vercel"
git push origin main
```

### 3.3 Deploy to Vercel

Option A: **Using Vercel CLI**
```bash
cd frontend
vercel login
vercel
```

Option B: **Using Vercel Dashboard**
1. Go to https://vercel.com/new
2. Import your Git repository
3. Select the `frontend` directory as root
4. Framework Preset: **Next.js** (auto-detected)
5. Click **Deploy**

### 3.4 Set Environment Variable

In Vercel dashboard:
1. Go to **Settings** → **Environment Variables**
2. Add:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://fairshare-backend.onrender.com/api`
   - **Environments**: Production, Preview, Development (all checked)
3. Click **Save**

### 3.5 Redeploy
After adding environment variables:
1. Go to **Deployments** tab
2. Click **︙** on latest deployment
3. Click **Redeploy**

### 3.6 Enable Auto-Deploy

Vercel automatically enables auto-deploy from Git. Every push to `main` will trigger a new deployment.

### 3.7 Note Your Frontend URL

Copy your Vercel deployment URL:
```
https://your-app.vercel.app
```

## Step 4: Update Backend CORS Configuration

### 4.1 Update Render Environment Variable

Go back to Render dashboard:
1. Navigate to your backend service
2. Go to **Environment** → **Environment Variables**
3. Update `FRONTEND_URL` to your Vercel URL:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
4. Click **Save Changes**

This will trigger an automatic redeployment of your backend.

## Step 5: Verification

### 5.1 Test HTTPS
Both services should be accessible via HTTPS:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://fairshare-backend.onrender.com/api`

### 5.2 Test CORS
Open your frontend and check browser console:
- No CORS errors should appear
- API requests should succeed

### 5.3 Test Database Connection
Check Render logs:
```bash
# In Render dashboard, go to Logs tab
# Look for successful database connection messages
```

### 5.4 Test Auto-Deploy

Make a small change and push:
```bash
# Make any change
git add .
git commit -m "Test auto-deploy"
git push origin main
```

Both Vercel and Render should automatically deploy the changes.

## Environment Variables Summary

### Railway (MySQL)
- Automatically configured via Railway CLI

### Render (Backend)
```
DATABASE_URL=jdbc:mysql://MYSQLHOST:MYSQLPORT/MYSQLDATABASE
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password
FRONTEND_URL=https://your-app.vercel.app
JWT_SECRET=your-generated-jwt-secret
SPRING_PROFILES_ACTIVE=prod
PORT=8080
```

### Vercel (Frontend)
```
NEXT_PUBLIC_API_URL=https://fairshare-backend.onrender.com/api
```

## HTTPS Configuration

✅ **HTTPS is automatically enabled** on all three platforms:
- Railway: All services are HTTPS by default
- Render: Free SSL/TLS certificates via Let's Encrypt
- Vercel: Automatic HTTPS with SSL certificates

## CORS Configuration

✅ **CORS is properly configured**:
- Backend allows requests from your Vercel frontend URL
- Frontend can make authenticated requests to backend
- Credentials are supported for JWT tokens

## Troubleshooting

### Backend not connecting to database
- Verify Railway MySQL is running
- Check DATABASE_URL format in Render
- Review Render logs for connection errors

### CORS errors
- Ensure FRONTEND_URL in Render matches your Vercel URL exactly
- Check that both URLs use HTTPS
- Clear browser cache and cookies

### Build failures
- Check Render/Vercel build logs
- Ensure all dependencies are in package.json/pom.xml
- Verify Java version (17) is correct

### Auto-deploy not working
- Check that Render/Vercel has access to your Git repository
- Verify the branch name matches (usually `main`)
- Check webhook settings in Git provider

## Quick Command Reference

```bash
# Railway
railway login
railway init
railway add  # Select MySQL
railway variables

# Vercel
vercel login
vercel  # Deploy
vercel env add NEXT_PUBLIC_API_URL  # Add env var

# Render
# Use web dashboard - no CLI needed for basic deployment

# Test endpoints
curl https://fairshare-backend.onrender.com/api/auth/health
curl https://your-app.vercel.app
```

## Support

- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Spring Boot Docs: https://spring.io/projects/spring-boot
- Next.js Docs: https://nextjs.org/docs
