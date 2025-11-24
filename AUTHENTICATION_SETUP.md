# NPM Authentication Setup Guide

## Quick Start (Recommended for Single Machine)

### Step 1: Get Your NPM Access Token
1. Go to https://www.npmjs.com/settings/~(your-account)/tokens
2. Click "Create New Token" 
3. Select "Automation" (recommended for scripts/CI)
4. Click "Create Token"
5. Copy the generated token (you won't see it again)

### Step 2: Configure NPM Authentication
Run this command with your copied token:
```bash
npm config set //registry.npmjs.org/:_authToken=YOUR_COPIED_TOKEN_HERE
```

### Step 3: Verify Authentication
```bash
npm whoami
```
You should see your NPM username output.

---

## Alternative: Interactive Login (If Preferred)

```bash
npm login
```

When prompted:
- **Username**: Your NPM username
- **Password**: Your NPM password
- **Email**: Your registered email address
- **2FA** (if enabled): Follow the prompt

---

## For CI/CD Automation (GitHub Actions, etc.)

### Using GitHub Secrets:
1. Add your NPM token to GitHub repo secrets as `NPM_TOKEN`
2. In workflow file:
```bash
npm config set //registry.npmjs.org/:_authToken=${NPM_TOKEN}
npm publish --access public
```

---

## Verify It's Working

```bash
# Check current NPM config
npm config get registry
# Should output: https://registry.npmjs.org/

# Check if authenticated
npm whoami
# Should output your username

# Optional: View your profile
npm profile get
```

---

## Security Notes

- Never commit authentication tokens to git
- Use GitHub Secrets for CI/CD
- Access tokens are personal - don't share
- Can revoke tokens anytime at https://www.npmjs.com/settings/~(your-account)/tokens

---

## Now You're Ready!

Run the publication script:
```bash
cd /Users/mdch/lark-dashboard-sdk
./NPM_PUBLISH_COMMANDS.sh
```

