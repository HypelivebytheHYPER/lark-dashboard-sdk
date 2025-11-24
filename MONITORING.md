# Monitoring and Observability Guide

## Overview

This guide outlines the monitoring strategy for the Lark Dashboard SDK, including key metrics, dashboards, alerts, and tools.

## Key Metrics to Monitor

### 1. npm Package Metrics

#### Downloads

**Metric:** Monthly and yearly download counts

**Tools:**
- npm API: `npm view @hypelab/lark-dashboard-sdk downloads`
- npm Stats: https://npmjs.org/package/@hypelab/lark-dashboard-sdk
- npm Trends: https://npmtrends.com/@hypelab/lark-dashboard-sdk

**Check Frequency:** Weekly

**Monitoring Script:**
```bash
#!/bin/bash
# Get npm download stats

PACKAGE="@hypelab/lark-dashboard-sdk"

# Last week
echo "Last 7 days:"
curl -s "https://api.npmjs.org/downloads/point/last-week/${PACKAGE}" | jq '.downloads'

# Last month
echo "Last 30 days:"
curl -s "https://api.npmjs.org/downloads/point/last-month/${PACKAGE}" | jq '.downloads'

# Last year
echo "Last year:"
curl -s "https://api.npmjs.org/downloads/point/last-year/${PACKAGE}" | jq '.downloads'

# All time
echo "All time:"
npm view "${PACKAGE}" downloads
```

**Alert Thresholds:**
- CRITICAL: Downloads drop 50%+ from baseline
- WARNING: Downloads drop 20% from baseline
- INFO: Unusual spikes (200%+) might indicate viral adoption or scanning

**Baseline Example:**
- Established: 1,000+ downloads/week
- Growing: 100-1,000 downloads/week
- New: <100 downloads/week

#### Package Quality Score

**Metric:** npm quality score

**Tools:**
- npm Registry API
- npm Web UI: https://npmjs.org/package/@hypelab/lark-dashboard-sdk

**Check Frequency:** Monthly

**Quality Factors:**
- Maintenance: Regular updates and bug fixes
- Documentation: README, API docs, examples
- Test Coverage: Test files and coverage reports
- Dependencies: Minimal, up-to-date dependencies

**Target Score:** >80%

---

### 2. GitHub Repository Metrics

#### Stars and Forks

**Tools:**
- GitHub API: `curl https://api.github.com/repos/hypelab/lark-dashboard-sdk`
- GitHub Web: https://github.com/hypelab/lark-dashboard-sdk

**Check Frequency:** Weekly

**Monitoring Script:**
```bash
#!/bin/bash
# Get GitHub repository metrics

REPO="hypelab/lark-dashboard-sdk"

echo "Repository Metrics for ${REPO}"
echo "==============================="

# Fetch repository data
REPO_DATA=$(curl -s "https://api.github.com/repos/${REPO}")

# Stars
STARS=$(echo $REPO_DATA | jq '.stargazers_count')
echo "Stars: $STARS"

# Forks
FORKS=$(echo $REPO_DATA | jq '.forks_count')
echo "Forks: $FORKS"

# Watchers
WATCHERS=$(echo $REPO_DATA | jq '.watchers_count')
echo "Watchers: $WATCHERS"

# Open Issues
OPEN_ISSUES=$(echo $REPO_DATA | jq '.open_issues_count')
echo "Open Issues: $OPEN_ISSUES"

# Last Push
LAST_PUSH=$(echo $REPO_DATA | jq '.pushed_at')
echo "Last Push: $LAST_PUSH"
```

**Alert Thresholds:**
- CRITICAL: No commits for 30+ days
- WARNING: No commits for 14+ days
- INFO: Star growth tracking

---

#### Issues and Pull Requests

**Metrics:**
- Total open issues
- Average resolution time
- PR review time
- Issue types (bugs, features, questions)

**Check Frequency:** Weekly

**Targets:**
- Respond to issues within 24-48 hours
- Resolve issues within 1-2 weeks
- Review PRs within 2-3 days

---

### 3. Code Quality Metrics

#### Test Coverage

**Metric:** Code coverage percentage

**Tools:**
- Jest: Built-in coverage reporting
- Codecov: https://codecov.io
- Coveralls: https://coveralls.io

**Check Frequency:** Per commit (automated)

**Target:** >80% coverage

**Monitoring Script:**
```bash
#!/bin/bash
# Generate coverage report

npm run test -- --coverage

# View coverage
open coverage/index.html  # macOS
# or
xdg-open coverage/index.html  # Linux
```

#### Linting and Type Checking

**Metrics:**
- ESLint violations
- TypeScript type errors
- Code complexity

**Tools:**
- ESLint: `npm run lint`
- TypeScript: `npm run build`

**Check Frequency:** Per commit (automated via CI/CD)

**Target:**
- 0 critical linting errors
- 0 TypeScript errors
- Complexity score < 10 per function

---

### 4. Dependency Health

#### Vulnerability Scanning

**Metric:** Number of known vulnerabilities

**Tools:**
- npm audit: `npm audit`
- Snyk: https://snyk.io
- GitHub Dependabot

**Check Frequency:** Weekly (automated)

**Alert Thresholds:**
- CRITICAL: Any critical vulnerabilities
- HIGH: High-severity vulnerabilities
- MEDIUM: Multiple medium vulnerabilities

**Response Time:**
- Critical: Within 4 hours
- High: Within 24 hours
- Medium: Within 1 week

#### Dependency Updates

**Metrics:**
- Outdated packages
- Update compatibility
- Breaking changes

**Check Frequency:** Weekly

**Monitoring Script:**
```bash
#!/bin/bash
# Check for outdated dependencies

npm outdated

# Check for security issues
npm audit

# Check for major updates
npm outdated --save
```

---

### 5. API Performance Metrics

#### Response Time

**Metric:** Average API response time

**Monitoring:**
```javascript
const client = new LarkDashboardClient({...});

const startTime = Date.now();
const result = await client.createDashboard(config);
const duration = Date.now() - startTime;

console.log(`Request took ${duration}ms`);
```

**Target:** <2000ms for most requests

#### Error Rates

**Metric:** Percentage of failed requests

**Monitoring:**
```javascript
let totalRequests = 0;
let failedRequests = 0;

client.axios.interceptors.response.use(
    response => {
        totalRequests++;
        return response;
    },
    error => {
        totalRequests++;
        failedRequests++;
        return Promise.reject(error);
    }
);

// Error rate = failedRequests / totalRequests
```

**Target:** <1% error rate

---

## Monitoring Tools Setup

### 1. npm Package Monitoring

**Automated Weekly Check:**

Create `.github/workflows/npm-monitoring.yml`:

```yaml
name: npm Package Monitoring

on:
  schedule:
    - cron: '0 9 * * 1'  # Every Monday at 9 AM UTC
  workflow_dispatch:

jobs:
  monitor:
    runs-on: ubuntu-latest
    steps:
      - name: Check npm Downloads
        run: |
          curl -s "https://api.npmjs.org/downloads/point/last-week/@hypelab/lark-dashboard-sdk" | jq '.'

      - name: Check npm Package Info
        run: |
          npm view @hypelab/lark-dashboard-sdk | head -20
```

### 2. GitHub Repository Monitoring

**Automated Issues Report:**

Create `.github/workflows/repo-stats.yml`:

```yaml
name: Repository Statistics

on:
  schedule:
    - cron: '0 10 * * 1'  # Every Monday at 10 AM UTC
  workflow_dispatch:

jobs:
  stats:
    runs-on: ubuntu-latest
    steps:
      - name: Get Repository Stats
        uses: actions/github-script@v6
        with:
          script: |
            const repo = await github.rest.repos.get({
              owner: context.repo.owner,
              repo: context.repo.repo
            });

            console.log('Stars:', repo.data.stargazers_count);
            console.log('Forks:', repo.data.forks_count);
            console.log('Open Issues:', repo.data.open_issues_count);
            console.log('Watchers:', repo.data.watchers_count);

      - name: Check Issue Stats
        uses: actions/github-script@v6
        with:
          script: |
            const issues = await github.rest.issues.listForRepo({
              owner: context.repo.owner,
              repo: context.repo.repo,
              state: 'open'
            });

            const avgAge = issues.data.reduce((sum, issue) => {
              const daysOld = (Date.now() - new Date(issue.created_at)) / (1000 * 60 * 60 * 24);
              return sum + daysOld;
            }, 0) / issues.data.length;

            console.log('Open Issues:', issues.data.length);
            console.log('Average Age (days):', avgAge.toFixed(1));
```

### 3. Dependency Monitoring

**Automated Dependency Checks:**

Create `.github/workflows/dependency-check.yml`:

```yaml
name: Dependency Check

on:
  schedule:
    - cron: '0 11 * * 1'  # Every Monday at 11 AM UTC
  workflow_dispatch:
  push:
    paths:
      - 'package.json'
      - 'package-lock.json'

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run npm audit
        run: npm audit

      - name: Check for outdated packages
        run: npm outdated || true
```

---

## Dashboards and Reports

### Weekly Report Template

Create `WEEKLY_METRICS.md`:

```markdown
# Weekly Metrics Report

## Week of November 25, 2025

### npm Package Metrics
- **Downloads (7 days):** X
- **Downloads (30 days):** Y
- **Quality Score:** XX%
- **Latest Version:** 1.0.0

### GitHub Repository
- **Stars:** X
- **Forks:** Y
- **Open Issues:** Z
- **Open PRs:** W
- **Last Commit:** [date]

### Code Quality
- **Test Coverage:** XX%
- **Linting Errors:** X
- **TypeScript Errors:** 0
- **Bundle Size:** XXKb

### Dependencies
- **Outdated Packages:** X
- **Security Vulnerabilities:** X
- **Update Available:** [list]

### Performance
- **API Response Time (avg):** XXms
- **Error Rate:** X%
- **Uptime:** XX.X%

### Issues & PRs
- **New Issues:** X
- **Closed Issues:** Y
- **New PRs:** Z
- **Merged PRs:** W
- **Avg Issue Resolution Time:** X days

### Recommendations
1. ...
2. ...
```

### Monthly Report Template

Create `MONTHLY_METRICS.md`:

```markdown
# Monthly Metrics Report

## November 2025

### Adoption Metrics
- **Total Downloads:** X
- **Unique Users (estimated):** Y
- **Growth Rate:** X%

### Community Engagement
- **GitHub Stars Added:** X
- **GitHub Forks Added:** Y
- **Contributors:** Z
- **PR Reviews (avg):** X days

### Release Activity
- **Releases:** X
- **Commits:** Y
- **Lines Changed:** Z

### Quality Metrics
- **Test Coverage:** XX%
- **Critical Issues:** X
- **High-Priority Bugs:** Y
- **Feature Requests:** Z

### Dependency Health
- **Security Vulnerabilities:** X
- **Outdated Packages:** Y
- **License Compliance:** PASS

### Notable Events
- ...
```

---

## Alert Configuration

### Email Alerts

Setup email notifications for critical events:

```javascript
// Example: Send alert email on critical issue
async function sendAlert(subject, message) {
    // Use nodemailer or similar
    const transporter = nodemailer.createTransport({...});

    await transporter.sendMail({
        from: 'dev@hypelab.com',
        to: 'team@hypelab.com',
        subject: `SDK Alert: ${subject}`,
        text: message
    });
}

// Alert on high error rate
if (errorRate > 0.05) {  // 5%
    await sendAlert('High Error Rate', `Error rate at ${errorRate * 100}%`);
}

// Alert on vulnerability
if (vulnerabilityCount > 0) {
    await sendAlert('Security Vulnerability', `${vulnerabilityCount} vulnerabilities found`);
}
```

### Slack Notifications

Setup Slack webhook for notifications:

```javascript
const axios = require('axios');

async function sendSlackAlert(message) {
    await axios.post(process.env.SLACK_WEBHOOK_URL, {
        text: `SDK Alert: ${message}`
    });
}

// Usage
await sendSlackAlert('New critical vulnerability detected');
```

---

## Monthly Monitoring Checklist

Create `MONITORING_CHECKLIST.md`:

```markdown
# Monthly Monitoring Checklist

## Week 1: Dependency Review
- [ ] Run npm audit
- [ ] Review outdated packages
- [ ] Check for breaking changes
- [ ] Schedule major updates
- [ ] Document new versions

## Week 2: Metrics Analysis
- [ ] Analyze download trends
- [ ] Review GitHub metrics
- [ ] Check code coverage
- [ ] Assess API performance
- [ ] Review error rates

## Week 3: Community Check
- [ ] Review open issues
- [ ] Check PR status
- [ ] Read issue discussions
- [ ] Respond to unanswered questions
- [ ] Thank contributors

## Week 4: Planning
- [ ] Plan feature releases
- [ ] Schedule maintenance
- [ ] Plan documentation updates
- [ ] Identify optimization opportunities
- [ ] Set goals for next month

## Action Items
- [ ] ...
- [ ] ...
```

---

## Performance Monitoring

### Application Performance Monitoring (APM)

```javascript
// Example: Basic performance monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
    }

    async measureOperation(name, fn) {
        const start = performance.now();
        try {
            const result = await fn();
            const duration = performance.now() - start;

            if (!this.metrics[name]) {
                this.metrics[name] = [];
            }

            this.metrics[name].push({
                duration,
                timestamp: new Date(),
                success: true
            });

            return result;
        } catch (error) {
            const duration = performance.now() - start;

            if (!this.metrics[name]) {
                this.metrics[name] = [];
            }

            this.metrics[name].push({
                duration,
                timestamp: new Date(),
                success: false,
                error: error.message
            });

            throw error;
        }
    }

    getMetrics(name) {
        if (!this.metrics[name]) return null;

        const data = this.metrics[name];
        return {
            count: data.length,
            avgDuration: data.reduce((sum, m) => sum + m.duration, 0) / data.length,
            maxDuration: Math.max(...data.map(m => m.duration)),
            minDuration: Math.min(...data.map(m => m.duration)),
            successRate: data.filter(m => m.success).length / data.length
        };
    }
}

// Usage
const monitor = new PerformanceMonitor();

const result = await monitor.measureOperation('createDashboard', async () => {
    return await client.createDashboard(config);
});

console.log(monitor.getMetrics('createDashboard'));
```

---

## Health Dashboard

### Create a Simple Web Dashboard

```typescript
import express from 'express';

const app = express();

// Health endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        version: require('./package.json').version,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: new Date()
    });
});

// Metrics endpoint
app.get('/metrics', (req, res) => {
    res.json({
        downloads: { /* npm stats */ },
        github: { /* repo stats */ },
        tests: { /* coverage */ },
        dependencies: { /* audit results */ }
    });
});

app.listen(3000, () => {
    console.log('Monitoring dashboard at http://localhost:3000');
});
```

---

## Notification Templates

### Critical Issue Notification

```
Subject: CRITICAL: SDK Security Vulnerability

A critical security vulnerability has been discovered in @hypelab/lark-dashboard-sdk:

Vulnerability: [CVE-ID]
Severity: CRITICAL
Affected Versions: [versions]
Fix Available: Yes

Action Required:
1. Review vulnerability details: [URL]
2. Update to version [version]
3. Deploy to production
4. Notify users if applicable

Timeline:
- Discovered: [date]
- Patch Released: [date]
- Update Deadline: [date]

Contact: dev@hypelab.com
```

### Performance Degradation Alert

```
Subject: WARNING: API Performance Degradation

API response times have increased significantly:

Metric: Average Response Time
Previous: XXXms
Current: XXXms
Change: +XX%

Potential Causes:
1. ...
2. ...
3. ...

Recommendations:
1. ...
2. ...

Investigation Required: Yes
Status: INVESTIGATING

Contact: dev@hypelab.com
```

---

## Data Retention Policy

- **Real-time metrics:** Keep for 7 days
- **Daily metrics:** Keep for 90 days
- **Monthly metrics:** Keep for 2 years
- **Critical events:** Keep indefinitely
- **Archived reports:** Keep in cold storage

---

## Tools Recommendations

### Monitoring Tools
1. **Datadog:** Complete APM solution
2. **New Relic:** Application monitoring
3. **Sentry:** Error tracking
4. **Prometheus:** Metrics collection

### Analytics Tools
1. **Mixpanel:** User analytics
2. **Amplitude:** Product analytics
3. **Google Analytics:** Web analytics

### CI/CD Monitoring
1. **GitHub Actions:** Built-in workflow monitoring
2. **CircleCI:** Pipeline insights
3. **Jenkins:** Performance analytics

---

Last Updated: November 25, 2025
