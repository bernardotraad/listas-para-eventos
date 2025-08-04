# Vercel Deployment Guide

## Overview
This guide will help you deploy your Next.js application to Vercel, which is the recommended platform for Next.js applications.

## Prerequisites
- A GitHub account
- A Vercel account (free at [vercel.com](https://vercel.com))
- Your project pushed to GitHub

## Step-by-Step Deployment

### 1. Prepare Your Repository
Make sure your project is pushed to GitHub with the following structure:
```
listas-para-eventos/
├── frontend/          # Next.js application
├── backend/           # Backend API
├── vercel.json        # Vercel configuration
└── README.md
```

### 2. Connect to Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign up/login
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Select the repository**: `listas-para-eventos`

### 3. Configure Project Settings

When importing, Vercel should automatically detect it's a Next.js project. Configure as follows:

- **Framework Preset**: Next.js (should be auto-detected)
- **Root Directory**: `frontend`
- **Build Command**: `npm run build` (should be auto-detected)
- **Output Directory**: `.next` (should be auto-detected)
- **Install Command**: `npm install` (should be auto-detected)

### 4. Set Environment Variables

In the Vercel project settings, add these environment variables:

```
NEXT_PUBLIC_API_URL=https://listas-eventos-backend.onrender.com/api
```

### 5. Deploy

1. **Click "Deploy"**
2. **Wait for the build to complete** (usually 2-3 minutes)
3. **Your app will be live** at a URL like: `https://your-project.vercel.app`

## Configuration Files

### vercel.json
This file is already configured in your project root:
```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/.next",
  "framework": "nextjs",
  "installCommand": "cd frontend && npm install",
  "devCommand": "cd frontend && npm run dev",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api-proxy"
    }
  ]
}
```

### API Proxy
The application includes a Vercel-compatible API proxy at `/api-proxy` that forwards requests to your backend.

## Benefits of Vercel

✅ **Native Next.js Support**: No plugin conflicts like Netlify
✅ **Automatic Deployments**: Deploys on every Git push
✅ **Global CDN**: Fast loading worldwide
✅ **Serverless Functions**: Built-in support for API routes
✅ **Environment Variables**: Easy configuration
✅ **Custom Domains**: Add your own domain
✅ **Analytics**: Built-in performance monitoring

## Troubleshooting

### Build Errors
- Check that all dependencies are in `package.json`
- Ensure the root directory is set to `frontend`
- Verify environment variables are set correctly

### API Issues
- Make sure your backend is running and accessible
- Check the `NEXT_PUBLIC_API_URL` environment variable
- Verify the API proxy route is working

### Performance
- Vercel automatically optimizes Next.js applications
- Images are automatically optimized
- Static pages are pre-rendered

## Next Steps

1. **Test your deployed application**
2. **Set up a custom domain** (optional)
3. **Configure automatic deployments** from your main branch
4. **Monitor performance** using Vercel Analytics

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)
- **Vercel Support**: Available in the Vercel dashboard 