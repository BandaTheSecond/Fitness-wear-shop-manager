# Deployment Guide for Fitness Wear Shop Manager

This guide will help you deploy the Fitness Wear Shop Manager application using Vercel for the frontend and Render for the backend.

## Prerequisites

1. GitHub repository with your code
2. Vercel account
3. Render account
4. No external database required (uses SQLite)

## Frontend Deployment (Vercel)

### 1. Deploy to Vercel

1. Go to [Vercel](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Set the **Root Directory** to `client`
5. Configure the following settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 2. Environment Variables in Vercel

In your Vercel project settings, add the following environment variable:

```
VITE_API_URL=https://your-backend-app-name.onrender.com/api
```

Replace `your-backend-app-name` with your actual Render backend URL.

### 3. Deploy

Click "Deploy" and wait for the deployment to complete. Vercel will provide you with a URL like `https://your-app-name.vercel.app`.

## Backend Deployment (Render)

### 1. Deploy the Backend

1. In Render dashboard, click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `fitness-wear-shop-backend`
   - **Root Directory**: `server/backend`
   - **Environment**: `Python 3`
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn app:app`
   - **Plan**: Choose based on your needs (Free tier available)

### 2. Environment Variables in Render

Add the following environment variables in your Render backend service:

```
FLASK_ENV=production
SECRET_KEY=your-super-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
FRONTEND_URL=https://your-frontend.vercel.app
```

**Important Notes:**
- Replace `FRONTEND_URL` with your actual Vercel frontend URL
- Generate strong, unique secret keys for `SECRET_KEY` and `JWT_SECRET_KEY`
- No database URL needed - the app uses SQLite

### 3. Deploy

Click "Create Web Service" and wait for the deployment to complete.

## Post-Deployment Configuration

### 1. Update Frontend Environment Variables

After your backend is deployed, update the `VITE_API_URL` environment variable in Vercel with your actual Render backend URL.

### 2. Test the Deployment

1. Visit your Vercel frontend URL
2. Try to register/login
3. Check that all features work correctly
4. Monitor the Render logs for any errors

## Environment Variables Reference

### Frontend (Vercel)
- `VITE_API_URL`: Your Render backend API URL

### Backend (Render)
- `FLASK_ENV`: Set to `production`
- `SECRET_KEY`: Flask secret key for sessions
- `JWT_SECRET_KEY`: Secret key for JWT tokens
- `FRONTEND_URL`: Your Vercel frontend URL

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure `FRONTEND_URL` is correctly set in your backend environment variables
2. **Database Issues**: The SQLite database will be created automatically during deployment
3. **Build Failures**: Check the build logs in Render for specific error messages
4. **API Not Found**: Ensure your frontend is pointing to the correct backend URL

### Useful Commands

- **View Backend Logs**: In Render dashboard → Your service → Logs
- **View Frontend Logs**: In Vercel dashboard → Your project → Functions tab

## Security Notes

1. Never commit `.env` files to version control
2. Use strong, unique secret keys in production
3. Regularly rotate your JWT secret keys
4. Monitor your application logs for suspicious activity
5. Consider implementing rate limiting for production use

## Scaling

- **Render**: Upgrade to paid plans for better performance and reliability
- **Vercel**: Pro plan offers better performance and analytics
- **Database**: SQLite is suitable for small to medium applications. Consider PostgreSQL for high-traffic applications

## Support

If you encounter issues:
1. Check the logs in both Vercel and Render dashboards
2. Verify all environment variables are correctly set
3. Ensure your database is accessible from Render
4. Check that all dependencies are properly installed
