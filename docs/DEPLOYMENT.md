# Deployment Guide

Guide for deploying generated e-learning courses to various platforms.

## Quick Reference

| Platform | Setup Time | Cost | Best For |
|----------|-----------|------|----------|
| GitHub Pages | 5 min | Free | Open source, portfolio courses |
| Netlify | 10 min | Free + Paid | Professional deployments |
| AWS S3 | 15 min | Pay per GB | High traffic courses |
| Local Server | 5 min | Free | Internal/corporate training |
| Vercel | 10 min | Free + Paid | Modern, performant hosting |

## Local Server Deployment

### Option 1: Python HTTP Server

```bash
cd output-sites/my-course
python3 -m http.server 8000
```

Access at: `http://localhost:8000`

### Option 2: Node.js http-server

```bash
npm install -g http-server
cd output-sites/my-course
http-server -p 8000
```

Access at: `http://localhost:8000`

### Option 3: Express.js Server

Create `server.js`:
```javascript
const express = require('express');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'output-sites/my-course')));

app.listen(3000, () => {
  console.log('Serving at http://localhost:3000');
});
```

Run:
```bash
node server.js
```

## GitHub Pages Deployment

### Step 1: Create Repository

```bash
git init
git add .
git commit -m "Initial commit: E-Learning Site Builder POC"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/site-builder.git
git push -u origin main
```

### Step 2: Configure Pages

1. Go to repository Settings
2. Navigate to Pages section
3. Select `main` branch as source
4. Click Save

### Step 3: Access Your Site

```
https://YOUR_USERNAME.github.io/site-builder/output-sites/my-course/
```

## Netlify Deployment

### Method 1: Drag & Drop

1. Visit [netlify.com](https://netlify.com)
2. Sign up (free)
3. Drag `output-sites/my-course` folder onto dashboard
4. Site deployed!

### Method 2: Git Integration

1. Push code to GitHub
2. On Netlify: Connect GitHub repository
3. Build settings:
   - Build command: Leave empty
   - Publish directory: `output-sites/my-course`
4. Click Deploy

### Custom Domain

1. In Netlify dashboard, go to Domain settings
2. Add custom domain
3. Update DNS records (instructions provided by Netlify)

## AWS S3 + CloudFront

### Step 1: Create S3 Bucket

```bash
aws s3 mb s3://my-course-bucket
```

### Step 2: Upload Files

```bash
aws s3 sync output-sites/my-course s3://my-course-bucket
```

### Step 3: Enable Static Hosting

```bash
aws s3 website s3://my-course-bucket \
  --index-document index.html \
  --error-document index.html
```

### Step 4: Create CloudFront Distribution

1. AWS Console > CloudFront
2. Create distribution
3. Origin: S3 bucket
4. Default root object: `index.html`

Access at CloudFront URL provided by AWS.

## Docker Deployment

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy backend and frontend
COPY backend ./backend
COPY frontend ./frontend
COPY output-sites ./output-sites

WORKDIR /app/backend
RUN npm ci --only=production

EXPOSE 5000

CMD ["node", "server.js"]
```

### Build and Run

```bash
docker build -t site-builder .
docker run -p 5000:5000 -v $(pwd)/output-sites:/app/output-sites site-builder
```

## Corporate/Internal Server

### IIS on Windows

1. Install IIS on Windows Server
2. Copy files to `C:\inetpub\wwwroot\courses\my-course`
3. Create application in IIS Manager
4. Set physical path to course folder
5. Access via: `http://server-name/courses/my-course`

### Apache on Linux

```bash
# Copy files
sudo cp -r output-sites/my-course /var/www/html/

# Set permissions
sudo chown -R www-data:www-data /var/www/html/my-course
```

Access via: `http://your-domain/my-course`

### Nginx on Linux

```bash
# Copy files
sudo cp -r output-sites/my-course /usr/share/nginx/html/

# Create config
sudo nano /etc/nginx/sites-available/course

# Add:
# server {
#   listen 80;
#   server_name your-domain.com;
#   root /usr/share/nginx/html/my-course;
#   index index.html;
# }

sudo systemctl restart nginx
```

## SSL/HTTPS Setup

### Let's Encrypt (Free)

```bash
sudo apt-get install certbot python3-certbot-nginx

# For Nginx
sudo certbot --nginx -d your-domain.com

# For Apache
sudo certbot --apache -d your-domain.com
```

### Manual SSL Certificate

1. Purchase certificate from SSL provider
2. Install on your server
3. Configure web server to use certificate
4. Test at: https://your-domain.com

## Performance Optimization

### Enable Gzip Compression

**Nginx:**
```nginx
gzip on;
gzip_types text/plain text/css text/javascript;
```

**Apache:**
```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/css text/javascript
</IfModule>
```

### Enable Caching

**Nginx:**
```nginx
expires 1h;
```

**Apache:**
```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/html "access plus 1 hour"
</IfModule>
```

### Image Optimization

Before uploading, optimize images:

```bash
# Using ImageMagick
convert original.jpg -quality 85 -resize 1200x800 optimized.jpg

# Using ImageOptim (Mac)
# Drag images to ImageOptim app
```

## Monitoring & Analytics

### Google Analytics

Add to generated `index.html`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Server Logs

**Check Nginx logs:**
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

**Check Apache logs:**
```bash
tail -f /var/log/apache2/access.log
tail -f /var/log/apache2/error.log
```

## Security Checklist

Before production deployment:

- [ ] HTTPS/SSL enabled
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] File permissions restricted (644 for files, 755 for directories)
- [ ] Backup strategy in place
- [ ] Error pages configured
- [ ] Sensitive files (.env, .git) not accessible
- [ ] Regular security audits scheduled
- [ ] DDoS protection (CloudFlare, AWS Shield)

## Backup & Recovery

### Backup Generated Sites

```bash
# Daily backup to tar archive
tar -czf backup-$(date +%Y%m%d).tar.gz output-sites/

# Copy to external storage
cp backup-*.tar.gz /mnt/backup/
```

### Restore from Backup

```bash
tar -xzf backup-20240101.tar.gz
cp -r output-sites/ /var/www/html/
```

## Troubleshooting Deployment

### 404 Errors

- Verify file permissions (chmod 644 for files)
- Check web server error logs
- Verify index.html exists in root
- Check virtual host configuration

### CORS Errors

- Configure CORS headers in web server
- Ensure origin is whitelisted
- Check backend API CORS settings

### Slow Performance

- Enable gzip compression
- Optimize images
- Enable browser caching
- Use CDN for media files
- Check server resources (CPU, RAM, disk)

### CSS/Images Not Loading

- Verify relative paths
- Check file permissions
- Look for 404 errors in console
- Verify web server is serving static files

## Maintenance

### Regular Updates

```bash
# Monthly
- Check for security updates
- Review server logs
- Test backup restoration
- Monitor analytics

# Quarterly
- Performance audit
- Security audit
- Update content
```

### Health Checks

```bash
# Test site is accessible
curl -I https://your-course-domain.com

# Check performance
curl -o /dev/null -s -w '%{time_total}\n' https://your-course-domain.com

# Monitor uptime
# Use services like UptimeRobot, StatusPage
```

## Cost Estimation

### Annual Hosting Costs

**GitHub Pages**: $0
- Great for portfolios and open source

**Netlify Free Tier**: $0
- Perfect for single course, good performance

**Netlify Pro**: $19/month ($228/year)
- Custom domain, analytics, CDN

**AWS S3 + CloudFront**: ~$1-10/month
- Depends on data transfer
- Scales well with multiple courses

**Dedicated Server**: $30-100+/month
- Full control
- Overkill for most courses

---

**Next Steps**: Choose a platform that matches your needs and follow the deployment guide above.
