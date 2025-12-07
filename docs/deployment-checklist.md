# Deployment Checklist

## Issues Fixed

### 1. ✅ Google Analytics Tracking
**Problem**: Real-time users showed, but aggregate metrics (Total users, New users, Views) were all 0.

**Root Cause**: GA4 was configured with `send_page_view: false`, preventing automatic pageview tracking.

**Fix Applied**:
- Re-enabled automatic pageviews in `src/composables/useAnalytics.js`
- Fixed initialization order (gtag setup before script loading)

**Verification**:
- ✅ Analytics requests confirmed: `POST https://www.google-analytics.com/g/collect` (204 status)
- ✅ Measurement ID: `G-Q54F1BV32E`
- ✅ Session tracking working
- ⏳ Aggregate metrics: **Wait 24-48 hours for data to process**

### 2. ✅ GitHub Pages Routing (404 Errors)
**Problem**: Direct navigation to routes like `/showcase` returned 404, preventing users from accessing pages.

**Root Cause**: GitHub Pages serves static files. Vue Router uses HTML5 history mode, but routes don't have corresponding HTML files.

**Fix Applied**:
- Created `public/404.html` to intercept 404 errors
- Added redirect handler in `src/router/index.js`
- Uses sessionStorage to preserve the intended route

**How It Works**:
1. User navigates to `https://graphjs.guinetik.com/showcase`
2. GitHub Pages returns 404 (no showcase.html exists)
3. `404.html` loads, stores `/showcase` in sessionStorage
4. Redirects to `/` (root)
5. Vue app loads, router checks sessionStorage
6. Router navigates to `/showcase` using Vue Router

## Deployment Steps

### 1. Build the Application
```bash
cd graph-js-demos
npm run build
```

### 2. Deploy to GitHub Pages
You have several options:

#### Option A: Manual Deployment
```bash
# Assuming you're using a gh-pages branch
cd dist
git init
git add -A
git commit -m 'Deploy with routing and analytics fixes'
git push -f git@github.com:guinetik/graph-js.git master:gh-pages
```

#### Option B: Using GitHub Actions
If you have GitHub Actions set up, just push to master:
```bash
git add .
git commit -m "Fix: Enable GA4 pageviews and GitHub Pages routing"
git push origin master
```

#### Option C: Using npm gh-pages package
```bash
npm install --save-dev gh-pages
npx gh-pages -d dist
```

### 3. Verify Deployment

#### Routing Verification
Test these URLs directly (not by clicking links):
- ✅ https://graphjs.guinetik.com/
- ✅ https://graphjs.guinetik.com/showcase
- ✅ https://graphjs.guinetik.com/explorer
- ✅ https://graphjs.guinetik.com/degrees
- ✅ https://graphjs.guinetik.com/family
- ✅ https://graphjs.guinetik.com/docs

**Expected**: All should load correctly (no 404 errors)

#### Analytics Verification (Immediate)
1. Open https://graphjs.guinetik.com/
2. Open DevTools → Network tab
3. Filter for: `collect` or `google-analytics`
4. Navigate between pages
5. **Expected**: See POST requests to `www.google-analytics.com/g/collect` with 204 status

#### Analytics Verification (Real-time)
1. Open Google Analytics
2. Go to **Reports → Realtime**
3. Open your site in another browser/tab
4. **Expected**: 
   - Active users count increases
   - See page_view events
   - See pages being tracked

#### Analytics Verification (Aggregate - 24-48 hours)
1. Wait 24-48 hours after deployment
2. Open Google Analytics
3. Go to **Reports → Home**
4. **Expected**: 
   - Total users > 0
   - New users > 0
   - Views > 0
   - User engagement metrics populated

## Important Notes

### Why Aggregate Metrics Still Show 0
**This is NORMAL** immediately after deployment because:

1. **Data Processing Time**: GA4 needs 24-48 hours to process and aggregate data
2. **Real-time vs Historical**: 
   - Real-time data (active users): Shows immediately ✅
   - Aggregate data (total users, views): Takes time to process ⏳

### What's Working Right Now
Your analytics IS working! Evidence:
- ✅ 4 active users showing in real-time
- ✅ Network requests to GA4 succeeding (204 status)
- ✅ Session data being tracked (`sid`, `seg`, etc.)
- ✅ Page paths being sent (`dp=%2F`)

### Expected Timeline
- **Immediately**: Real-time users, events visible in GA4 Realtime reports
- **30 minutes - 2 hours**: Some engagement metrics start showing
- **24 hours**: Most aggregate metrics available
- **48 hours**: Full historical data populated

## Troubleshooting

### If Routing Still Shows 404
1. Verify `404.html` is in the deployed dist folder
2. Check GitHub Pages settings: Should be serving from `gh-pages` branch (or `main` with `/dist`)
3. Clear browser cache and try again
4. Check browser console for errors

### If Analytics Still Not Working After 48 Hours
1. **Check GA4 Real-time Reports**:
   - Go to Reports → Realtime → Event count by Event name
   - Look for `page_view` events
   - If events show in real-time but not in aggregate, it's a GA4 configuration issue

2. **Check Data Stream**:
   - In GA4, go to Admin → Data Streams
   - Select your stream
   - Ensure "Enhanced measurement" is ON
   - Verify Measurement ID matches: `G-Q54F1BV32E`

3. **Check Data Filters**:
   - In GA4, go to Admin → Data Settings → Data Filters
   - Ensure no filters are excluding your traffic

4. **Check Date Range**:
   - In GA4 reports, ensure date range includes today
   - Some reports default to "Last 7 days" which might not include recent data

## Files Modified

### Core Fixes
- ✅ `src/composables/useAnalytics.js` - Re-enabled automatic pageviews
- ✅ `src/router/index.js` - Added 404 redirect handler
- ✅ `public/404.html` - Created (new file)

### Documentation
- ✅ `docs/analytics-setup.md` - Comprehensive analytics guide
- ✅ `docs/deployment-checklist.md` - This file

## Next Steps

1. **Deploy Now**: Build and deploy with the fixes
2. **Test Routing**: Verify all routes work without 404s
3. **Monitor Real-time**: Check GA4 Realtime reports immediately
4. **Wait Patiently**: Give GA4 24-48 hours to populate aggregate metrics
5. **Check Back**: Return tomorrow/day after to see full metrics

## Support

If after following all steps and waiting 48 hours you still see issues:
1. Export real-time event data from GA4
2. Check browser console for JavaScript errors
3. Verify all network requests are succeeding (no CORS errors)
4. Consider reaching out to GA4 support if data stream configuration seems incorrect

