# Intellisync Solutions Social Media Writer

## Deployment

[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR_NETLIFY_SITE_ID/deploy-status)](https://app.netlify.com/sites/YOUR_NETLIFY_SITE_NAME/deploys)

### Prerequisites

- Node.js (v20.0.0+)
- npm (v9.8.1+)
- Netlify CLI

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run development server:
   ```bash
   npm run dev
   ```

### Deployment

#### Netlify Deployment

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Deploy to Netlify:
   ```bash
   npm run netlify:deploy
   ```

### Environment Variables

- `VITE_APP_NAME`: Application name
- `VITE_APP_DOMAIN`: Application domain
- `VITE_CONTACT_EMAIL`: Contact email
- `VITE_API_BASE_URL`: Base API URL
- `VITE_ENABLE_ANALYTICS`: Enable/disable analytics
- `VITE_ENABLE_ERROR_TRACKING`: Enable/disable error tracking

### Continuous Deployment

This project is configured for automatic deployments on Netlify when pushing to the main branch.

### Troubleshooting

- Ensure Node.js and npm versions match the specified requirements
- Clear Netlify build cache if experiencing persistent issues
- Check Netlify deployment logs for specific error messages

## License

Proprietary - Intellisync Solutions
