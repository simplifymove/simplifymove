# SimplifyMove Backend - Deployment Guide

Complete guide to deploy SimplifyMove backend to production

---

## 🚀 Quick Deploy Options

### Option 1: Railway (Recommended - Easiest)

**Step 1:** Create Railway Account
```bash
# Visit https://railway.app and sign up
```

**Step 2:** Install Railway CLI
```bash
npm install -g @railway/cli
railway login
```

**Step 3:** Initialize Project
```bash
cd backend
railway init
```

**Step 4:** Set Environment Variables
```bash
railway variables set MONGODB_URI="your_mongodb_uri"
railway variables set JWT_SECRET="your_secret_key"
railway variables set NODE_ENV="production"
# Add all other .env variables
```

**Step 5:** Deploy
```bash
railway up
```

**Your API will be live at:** `https://your-app.railway.app`

---

### Option 2: Render

**Step 1:** Push Code to GitHub

**Step 2:** Visit https://render.com and connect your repository

**Step 3:** Configure Service
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Environment:** Node

**Step 4:** Add Environment Variables (from .env.example)

**Step 5:** Deploy

---

### Option 3: AWS EC2 (Advanced)

**Prerequisites:**
- AWS Account
- EC2 Instance (Ubuntu 22.04 LTS)
- Domain name (optional)

**Step 1:** Connect to EC2
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

**Step 2:** Install Node.js & MongoDB
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Step 3:** Clone and Setup Project
```bash
# Clone repository
git clone https://github.com/your-repo/simplifymove-backend.git
cd simplifymove-backend

# Install dependencies
npm install

# Create .env file
nano .env
# Paste your environment variables
```

**Step 4:** Install PM2 (Process Manager)
```bash
sudo npm install -g pm2

# Start application
pm2 start server.js --name simplifymove

# Save PM2 configuration
pm2 save
pm2 startup
```

**Step 5:** Setup Nginx Reverse Proxy
```bash
sudo apt install -y nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/simplifymove
```

Paste this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/simplifymove /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**Step 6:** Setup SSL with Let's Encrypt
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

### Option 4: DigitalOcean

**Step 1:** Create Droplet
- Choose Ubuntu 22.04 LTS
- Select plan (minimum: 2GB RAM)
- Add SSH key

**Step 2:** Follow same steps as AWS EC2

---

### Option 5: Heroku

**Step 1:** Install Heroku CLI
```bash
npm install -g heroku
heroku login
```

**Step 2:** Create Heroku App
```bash
cd backend
heroku create simplifymove-api
```

**Step 3:** Add MongoDB Add-on
```bash
heroku addons:create mongolab:sandbox
```

**Step 4:** Set Environment Variables
```bash
heroku config:set JWT_SECRET="your_secret"
heroku config:set NODE_ENV="production"
# Set all other variables
```

**Step 5:** Create Procfile
```bash
echo "web: node server.js" > Procfile
```

**Step 6:** Deploy
```bash
git push heroku main
```

---

## 📦 Database Setup

### MongoDB Atlas (Recommended)

**Step 1:** Create Account at https://www.mongodb.com/cloud/atlas

**Step 2:** Create Cluster
- Choose FREE tier (M0)
- Select region closest to your server
- Create cluster

**Step 3:** Setup Database User
- Database Access → Add New User
- Choose password authentication
- Save username and password

**Step 4:** Whitelist IP
- Network Access → Add IP Address
- For production: Add your server IP
- For development: Add 0.0.0.0/0 (all IPs)

**Step 5:** Get Connection String
```
mongodb+srv://username:password@cluster.mongodb.net/simplifymove?retryWrites=true&w=majority
```

**Step 6:** Update .env
```env
MONGODB_URI_PROD=your_connection_string
```

---

## 🔐 Security Checklist

### Pre-Deployment

- [ ] Change JWT_SECRET to a strong random string
- [ ] Set NODE_ENV=production
- [ ] Configure CORS for your frontend domain only
- [ ] Set secure MongoDB connection string
- [ ] Enable MongoDB authentication
- [ ] Configure rate limiting
- [ ] Set up Cloudinary for file uploads
- [ ] Configure email service (Gmail, SendGrid, etc.)
- [ ] Set up payment gateway credentials (Razorpay)
- [ ] Review and set all environment variables

### Post-Deployment

- [ ] Test all API endpoints
- [ ] Set up SSL/HTTPS
- [ ] Configure firewall rules
- [ ] Set up monitoring (PM2, New Relic, etc.)
- [ ] Configure log rotation
- [ ] Set up automated backups
- [ ] Test error handling
- [ ] Enable DDoS protection
- [ ] Set up health checks
- [ ] Configure auto-scaling (if needed)

---

## 🔄 Environment Variables

Copy from `.env.example` and configure:

```env
# Required
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRES_IN=7d

# Email (Choose one)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Payment
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# File Upload
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend CORS
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

---

## 📊 Monitoring & Logging

### PM2 Monitoring

```bash
# View logs
pm2 logs simplifymove

# Monitor resources
pm2 monit

# View process info
pm2 info simplifymove

# Restart on file changes
pm2 restart simplifymove --watch
```

### Winston Logs

Logs are stored in `/backend/logs/`:
- `error-YYYY-MM-DD.log` - Error logs
- `combined-YYYY-MM-DD.log` - All logs
- `http-YYYY-MM-DD.log` - HTTP request logs

---

## 🔧 Maintenance

### Update Application

```bash
# Pull latest code
git pull origin main

# Install dependencies
npm install

# Restart PM2
pm2 restart simplifymove

# Or with Railway
railway up
```

### Database Backup

```bash
# MongoDB backup
mongodump --uri="your_mongodb_uri" --out=/backup/$(date +%Y%m%d)

# MongoDB restore
mongorestore --uri="your_mongodb_uri" /backup/20250126
```

### Monitor Performance

```bash
# Check CPU and Memory
pm2 monit

# View logs in real-time
pm2 logs --lines 100

# Check error logs
tail -f logs/error-*.log
```

---

## 🚨 Troubleshooting

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### MongoDB Connection Issues
- Check if MongoDB is running: `sudo systemctl status mongod`
- Verify connection string format
- Check firewall rules
- Ensure IP is whitelisted in MongoDB Atlas

### PM2 Not Starting
```bash
# Remove PM2 process
pm2 delete simplifymove

# Start fresh
pm2 start server.js --name simplifymove
pm2 save
```

### High Memory Usage
```bash
# Restart application
pm2 restart simplifymove

# Check memory
pm2 monit

# Clear logs
pm2 flush
```

---

## 📈 Scaling

### Horizontal Scaling (Multiple Instances)

```bash
# Start 4 instances
pm2 start server.js -i 4 --name simplifymove

# Or use cluster mode
pm2 start server.js -i max
```

### Load Balancing

Configure Nginx for load balancing:

```nginx
upstream simplifymove_backend {
    server localhost:5000;
    server localhost:5001;
    server localhost:5002;
    server localhost:5003;
}

server {
    location / {
        proxy_pass http://simplifymove_backend;
    }
}
```

---

## 🔗 Useful Commands

```bash
# Development
npm run dev

# Production
npm start

# View logs
pm2 logs

# Restart server
pm2 restart simplifymove

# Check status
pm2 status

# Monitor
pm2 monit

# Stop server
pm2 stop simplifymove

# Database seed
npm run seed

# Run tests
npm test
```

---

## 📞 Support

For deployment issues:
- Email: devops@simplifymove.com
- Documentation: https://docs.simplifymove.com
- GitHub Issues: https://github.com/simplifymove/backend/issues

---

**Deployment Checklist Complete!** ✅

Your SimplifyMove backend is now ready for production deployment.
