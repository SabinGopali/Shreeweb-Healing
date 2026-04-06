# Lark Email Setup - Quick Reference

## 🚀 Quick Setup (3 Minutes)

### Step 1: Get Your Lark Email Info

You need:
- Your Lark email address (e.g., `you@yourcompany.com`)
- Your Lark email password

### Step 2: Update .env File

Open `backend/.env` and update:

```env
EMAIL_HOST=smtp.feishu.cn
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=your-lark-email@yourcompany.com
EMAIL_PASS=your-lark-password
EMAIL_FROM=your-lark-email@yourcompany.com
```

### Step 3: Restart Backend

```bash
cd backend
npm run dev
```

### Step 4: Test

1. Login to CMS
2. Go to Email Campaigns → Create
3. Send test email to yourself

## 📋 Configuration Options

### Option 1: Standard (Recommended)
```env
EMAIL_HOST=smtp.feishu.cn
EMAIL_PORT=465
EMAIL_SECURE=true
```

### Option 2: Alternative Port
```env
EMAIL_HOST=smtp.feishu.cn
EMAIL_PORT=587
EMAIL_SECURE=false
```

### Option 3: International Lark
```env
EMAIL_HOST=smtp.larksuite.com
EMAIL_PORT=465
EMAIL_SECURE=true
```

## ✅ Checklist

- [ ] Lark email address obtained
- [ ] Email password confirmed
- [ ] .env file updated
- [ ] Backend restarted
- [ ] Test email sent successfully

## 🔧 Common Issues & Quick Fixes

| Issue | Solution |
|-------|----------|
| "Invalid login" | Check email & password are correct |
| "Connection timeout" | Try port 587 with `EMAIL_SECURE=false` |
| "Self-signed certificate" | Use `EMAIL_SECURE=false` |
| Not receiving emails | Check spam folder, verify sender email |

## 📊 Lark Email Limits

- **Free/Standard**: ~500-1,000 emails/day
- **Enterprise**: Custom limits
- Contact Lark support for exact limits

## 🎯 Your Configuration

Fill this out:

```
Lark Email: _______________________
SMTP Host: smtp.feishu.cn
SMTP Port: 465
Password: _______________________
Region: [ ] China [ ] International
```

## 🔗 Quick Links

- **Lark Admin (China)**: https://www.feishu.cn/admin
- **LarkSuite Admin (International)**: https://www.larksuite.com/admin
- **Support**: https://www.feishu.cn/hc/zh-CN

## 💡 Pro Tips

1. Use a dedicated email like `marketing@yourcompany.com`
2. Start with 10-20 test emails
3. Always include unsubscribe link
4. Monitor delivery in Lark admin console
5. Gradually increase sending volume

## 🆘 Still Not Working?

Try these configurations in order:

**Try #1:**
```env
EMAIL_HOST=smtp.feishu.cn
EMAIL_PORT=465
EMAIL_SECURE=true
```

**Try #2:**
```env
EMAIL_HOST=smtp.feishu.cn
EMAIL_PORT=587
EMAIL_SECURE=false
```

**Try #3:**
```env
EMAIL_HOST=smtp.larksuite.com
EMAIL_PORT=465
EMAIL_SECURE=true
```

**Try #4:**
```env
EMAIL_HOST=smtp.larksuite.com
EMAIL_PORT=587
EMAIL_SECURE=false
```

## 📞 Need More Help?

Check the full guide: `LARK_EMAIL_MARKETING_SETUP.md`

---

**Quick Test Command:**

After updating .env, test with:
```bash
# Restart backend
cd backend
npm run dev

# Then go to:
# http://localhost:5173/shreeweb/cms/email-campaigns/create
```
