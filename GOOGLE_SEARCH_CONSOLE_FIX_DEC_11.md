# Google Search Console HTTPS Error Fix
**Date:** December 11, 2024
**Version:** 1.3.3
**Issue:** "HTTPS not evaluated: These pages are not served over HTTPS"

---

## Problem Analysis

### Symptoms
- Google Search Console showing "HTTPS not evaluated" error for all pages
- Error appeared after sitemap submission on December 10, 2024
- No additional details provided by GSC

### Root Cause Discovery

#### Step 1: Verify Site Behavior
```bash
curl -I https://caratcompare.co
# Response: HTTP/2 307
# location: https://www.caratcompare.co/

curl -I https://www.caratcompare.co
# Response: HTTP/2 200
```

**Finding:** Site redirects from non-www to www (307 redirect)

#### Step 2: Check Sitemap URLs
```bash
curl https://www.caratcompare.co/sitemap.xml | head -20
```

**Finding:** Sitemap URLs used `https://caratcompare.co` (without www)

#### Step 3: Check Canonical Tags
```bash
curl -s https://www.caratcompare.co/round | grep canonical
```

**Finding:** Canonical tags also used `https://caratcompare.co` (without www)

### Root Cause Summary
- **Canonical Domain:** `www.caratcompare.co` (what Vercel serves)
- **Sitemap URLs:** `caratcompare.co` (missing www)
- **Canonical Tags:** `caratcompare.co` (missing www)
- **Result:** 307 redirect between sitemap URL and canonical URL

This mismatch causes Google to flag "HTTPS not evaluated" because:
1. Google crawls sitemap URL: `https://caratcompare.co/round`
2. Gets 307 redirect to: `https://www.caratcompare.co/round`
3. Finds canonical tag pointing to: `https://caratcompare.co/round`
4. Detects inconsistency and flags as potential HTTPS issue

---

## Solution Implementation

### Files Modified

#### 1. `app/sitemap.xml/route.ts`
**Change:** Updated SITE_URL constant
```typescript
// Before
const SITE_URL = 'https://caratcompare.co';

// After
const SITE_URL = 'https://www.caratcompare.co';
```

#### 2. `app/layout.tsx`
**Change:** Updated metadataBase
```typescript
// Before
metadataBase: new URL('https://caratcompare.co'),

// After
metadataBase: new URL('https://www.caratcompare.co'),
```

#### 3. `app/[shape]/page.tsx`
**Change:** Updated canonical and OG URLs in generateMetadata
```typescript
// Before
url: `https://caratcompare.co/${shape}`,
canonical: `https://caratcompare.co/${shape}`,

// After
url: `https://www.caratcompare.co/${shape}`,
canonical: `https://www.caratcompare.co/${shape}`,
```

#### 4. `app/compare/[slug]/page.tsx`
**Change:** Updated canonical and OG URLs in generateMetadata
```typescript
// Before
url: `https://caratcompare.co/compare/${params.slug}`,
canonical: `https://caratcompare.co/compare/${params.slug}`,

// After
url: `https://www.caratcompare.co/compare/${params.slug}`,
canonical: `https://www.caratcompare.co/compare/${params.slug}`,
```

#### 5. `app/carat/[carat]/page.tsx`
**Change:** Updated canonical and OG URLs in generateMetadata
```typescript
// Before
url: `https://caratcompare.co/carat/${params.carat}`,
canonical: `https://caratcompare.co/carat/${params.carat}`,

// After
url: `https://www.caratcompare.co/carat/${params.carat}`,
canonical: `https://www.caratcompare.co/carat/${params.carat}`,
```

#### 6. `app/robots.ts`
**Change:** Updated sitemap URL reference
```typescript
// Before
sitemap: 'https://caratcompare.co/sitemap.xml',

// After
sitemap: 'https://www.caratcompare.co/sitemap.xml',
```

---

## Verification

### Post-Deployment Checks

#### 1. Sitemap URLs
```bash
curl -s https://www.caratcompare.co/sitemap.xml | grep -o '<loc>[^<]*</loc>' | head -5
```
**Result:**
```xml
<loc>https://www.caratcompare.co</loc>
<loc>https://www.caratcompare.co/round</loc>
<loc>https://www.caratcompare.co/princess</loc>
<loc>https://www.caratcompare.co/cushion</loc>
<loc>https://www.caratcompare.co/emerald</loc>
```
✅ **PASS** - All sitemap URLs use www

#### 2. Canonical Tags
```bash
curl -s https://www.caratcompare.co/round | grep canonical
```
**Result:**
```html
<link rel="canonical" href="https://www.caratcompare.co/round">
```
✅ **PASS** - Canonical tag uses www

#### 3. Open Graph URLs
```bash
curl -s https://www.caratcompare.co/round | grep 'og:url'
```
**Result:**
```html
<meta property="og:url" content="https://www.caratcompare.co/round">
```
✅ **PASS** - OG URL uses www

#### 4. No Redirect for Canonical URLs
```bash
curl -I https://www.caratcompare.co/round
```
**Result:**
```
HTTP/2 200
```
✅ **PASS** - No redirect when accessing canonical URL directly

---

## Expected Outcome

### What Should Happen
1. Google re-crawls sitemap after resubmission
2. Finds sitemap URL: `https://www.caratcompare.co/round`
3. Accesses URL directly (no redirect, 200 OK)
4. Finds canonical tag: `https://www.caratcompare.co/round`
5. URLs match exactly → HTTPS properly evaluated
6. Error disappears from Google Search Console

### Timeline
- **Immediate:** Changes deployed to production
- **24-48 hours:** Google re-crawls after sitemap resubmission
- **48-72 hours:** Error should clear from Google Search Console

---

## Action Items for User

### ✅ Completed
- [x] Fix applied to all files
- [x] Changes committed to git
- [x] Deployed to production
- [x] Verified sitemap URLs use www
- [x] Verified canonical tags use www
- [x] Documentation updated

### ⏳ User To-Do (December 12, 2024)
1. **Resubmit Sitemap in Google Search Console**
   - Go to: https://search.google.com/search-console
   - Navigate to: Sitemaps
   - Remove old sitemap if listed (optional)
   - Add new sitemap: `https://www.caratcompare.co/sitemap.xml`
   - Click "Submit"

2. **Request Re-Indexing (Optional but Recommended)**
   - Use URL Inspection tool
   - Test these URLs:
     - `https://www.caratcompare.co/`
     - `https://www.caratcompare.co/round`
     - `https://www.caratcompare.co/compare/1-round-vs-1.5-oval`
   - Click "Request Indexing" for each

3. **Monitor Status**
   - Check Google Search Console in 24-48 hours
   - Verify "HTTPS not evaluated" error is resolved
   - Check that pages are being indexed properly

---

## Technical References

### Best Practices Applied
1. **Canonical URL Consistency**
   - Sitemap URLs must match canonical URLs exactly
   - No redirects between sitemap and canonical
   - All meta tags (canonical, OG) must use same domain

2. **Domain Canonicalization**
   - Choose one: www or non-www
   - Use consistently across all properties
   - Set up appropriate redirects

3. **Google Search Console Requirements**
   - HTTPS required for good page experience
   - Canonical URLs must be accessible without redirects
   - Sitemap must reference canonical URLs only

### Related Google Documentation
- [Canonical URLs Best Practices](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [HTTPS as Ranking Signal](https://developers.google.com/search/blog/2014/08/https-as-ranking-signal)
- [Sitemap Guidelines](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)

---

## Backup Information

### Git Commits
- **First fix:** Commit `5d0d1a0` - Updated sitemap route and layout metadata base
- **Complete fix:** Commit `ab931f3` - Updated all page metadata generators

### Deployment Details
- **Platform:** Vercel
- **Auto-deployment:** Triggered on push to main branch
- **Deployment Time:** ~90 seconds
- **CDN Propagation:** ~2-5 minutes

### Rollback Plan (if needed)
To rollback these changes:
```bash
git revert ab931f3 5d0d1a0
git push origin main
```

---

**Document Created:** December 11, 2024
**Created By:** Claude Sonnet 4.5 via Claude Code
**Last Verified:** December 11, 2024
