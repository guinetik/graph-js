# Google Analytics Setup & Troubleshooting

## Overview
The graph-js-demos application uses Google Analytics 4 (GA4) to track user interactions and page views.

## Configuration

### Environment Variables
The following environment variable must be set for analytics to work:

- `VITE_GA_MEASUREMENT_ID`: Your Google Analytics 4 Measurement ID (format: `G-XXXXXXXXXX`)

### Development Mode
By default, analytics is **disabled** in development mode to avoid polluting production data. To enable analytics during development:

```bash
VITE_GA_DEBUG=true
```

### Production Deployment
Make sure to set the `VITE_GA_MEASUREMENT_ID` environment variable in your hosting platform:

**Vercel:**
```
Dashboard → Project Settings → Environment Variables → Add Variable
Name: VITE_GA_MEASUREMENT_ID
Value: G-XXXXXXXXXX
```

**Netlify:**
```
Site settings → Build & deploy → Environment → Add Variable
Key: VITE_GA_MEASUREMENT_ID
Value: G-XXXXXXXXXX
```

**GitHub Pages (with Actions):**
```yaml
# In your workflow file
env:
  VITE_GA_MEASUREMENT_ID: ${{ secrets.GA_MEASUREMENT_ID }}
```

## Implementation Details

### Initialization
Analytics is initialized in `main.js` using the `initializeAnalytics()` function. This:
1. Checks if the measurement ID is configured
2. Loads the Google Analytics script asynchronously
3. Configures GA4 with automatic pageview tracking enabled

### Page View Tracking
Page views are tracked automatically in two ways:
1. **Initial page load**: Tracked automatically by GA4 when the script initializes
2. **Route changes**: Tracked via Vue Router's `afterEach` navigation guard

### Event Tracking
Custom events can be tracked using the `useAnalytics()` composable:

```javascript
import { useAnalytics } from '@/composables/useAnalytics';

const { trackEvent, trackNavigation, trackDataAction } = useAnalytics();

// Track a custom event
trackEvent('button_click', { button_name: 'submit' });

// Track navigation events
trackNavigation('mobile_menu_toggle');

// Track data management events
trackDataAction('file_upload', { file_type: 'csv' });
```

## Troubleshooting

### Active Users Show But Aggregate Metrics Are Zero
**Problem**: Real-time users appear in GA4, but historical metrics (Total users, New users, Views) show 0.

**Possible Causes**:

1. **Data Processing Delay** (Most Common)
   - GA4 aggregate metrics can take **24-48 hours** to process and appear in reports
   - Real-time data shows immediately, but historical reports need time to aggregate
   - **Solution**: Wait 24-48 hours and check again

2. **Disabled Automatic Pageviews**
   - Previously caused by `send_page_view: false` in GA4 config
   - **Solution**: Re-enable automatic pageviews (fixed in latest version)

3. **Data Comparison Settings**
   - Some GA4 widgets require comparison periods to display data
   - **Solution**: In GA4, click the comparison toggle and select "Compare to: Previous period"

4. **Data Stream Configuration**
   - Your GA4 property might not have enhanced measurement enabled
   - **Solution**: In GA4, go to Admin → Data Streams → Select your stream → Ensure "Enhanced measurement" is ON

### Analytics Not Working in Production
1. **Check environment variable**: Verify `VITE_GA_MEASUREMENT_ID` is set in your hosting platform
2. **Rebuild and redeploy**: Environment variables are baked into the build, so you must rebuild after adding them
3. **Check browser console**: Look for analytics initialization logs or errors
4. **Verify Measurement ID**: Ensure it's in the correct format: `G-XXXXXXXXXX`
5. **Check network requests**: In DevTools → Network tab, filter for `google-analytics.com` or `collect` to verify requests are being sent

### GitHub Pages Routing (404 Errors)
**Problem**: Direct navigation to routes (like `/showcase`) returns 404, preventing analytics from tracking those pages.

**Cause**: GitHub Pages serves static files. When using Vue Router with HTML5 history mode, routes like `/showcase` don't have corresponding HTML files, causing 404 errors.

**Solution**: The app includes a `404.html` redirect handler that:
1. Intercepts 404 errors from GitHub Pages
2. Stores the attempted path in sessionStorage
3. Redirects to `/` (root)
4. Vue Router then navigates to the stored path

This solution is already implemented in:
- `public/404.html` - Catches 404s and stores the path
- `src/router/index.js` - Restores the path after Vue Router loads

**Verification**: After deploying, test by directly navigating to `https://yourdomain.com/showcase` - it should load correctly instead of showing a 404.

### Analytics Not Working in Development
This is **expected behavior**. Analytics is disabled in development by default. To enable it:

```bash
# Create a .env.local file
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_GA_DEBUG=true
```

Then restart your dev server.

### Duplicate Page Views
If you see duplicate page views in GA4, this is normal and expected when:
- Users rapidly navigate between pages
- Using browser back/forward buttons
- Refreshing pages

GA4 handles this gracefully and will deduplicate events on their end.

## Event Categories

The application tracks the following event categories:

- **Navigation**: Page views, menu toggles, language switches, dark mode
- **Data Management**: File uploads, dataset selection, sample network loading
- **Analysis**: Metric selection, layout changes, community detection
- **Graph Interaction**: Node clicks, dragging, hovering, renderer switching
- **Family Tree**: Adding relatives, saving trees, exporting, undo/redo
- **Showcase**: Adding/removing nodes

See `src/lib/analytics/AnalyticsEvents.js` for the complete list of tracked events.

## Privacy Considerations

- No personally identifiable information (PII) is tracked
- IP addresses are anonymized by default in GA4
- User interactions are tracked at an aggregate level
- Users can block analytics via browser extensions (which we respect)

## Testing Analytics

### In Production
1. Visit your site
2. Open Google Analytics
3. Go to Reports → Realtime
4. You should see your session appear within seconds

### In Development
1. Set `VITE_GA_DEBUG=true` in your `.env.local`
2. Open browser DevTools → Console
3. Look for analytics initialization and event logs
4. Check the Network tab for requests to `google-analytics.com` or `googletagmanager.com`

## Further Reading

- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [Vue Router Navigation Guards](https://router.vuejs.org/guide/advanced/navigation-guards.html)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

