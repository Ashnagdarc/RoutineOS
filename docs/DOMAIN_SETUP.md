# Custom Domain Setup Guide for RoutineOS

This guide will help you set up a custom domain for your RoutineOS application deployed on Vercel or other platforms.

## Prerequisites

- A registered domain name
- Access to your domain's DNS settings
- A deployed RoutineOS application

## Environment Variables for Custom Domains

Add these environment variables to your deployment platform:

```bash
# Custom Domain Configuration
NEXT_PUBLIC_DOMAIN=yourdomain.com
NEXTAUTH_URL=https://yourdomain.com

# Production URLs
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://yourdomain.com/api

# SEO and Analytics (optional)
GOOGLE_SITE_VERIFICATION=your-google-verification-code
YANDEX_VERIFICATION=your-yandex-verification-code
YAHOO_VERIFICATION=your-yahoo-verification-code

# Database URL (keep your existing Neon URL)
DATABASE_URL=your-existing-neon-database-url

# Google OAuth (update redirect URIs in Google Console)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Vercel Deployment Setup

### 1. Add Domain to Vercel

1. Go to your Vercel dashboard
2. Select your RoutineOS project
3. Go to "Settings" → "Domains"
4. Add your custom domain (e.g., `yourdomain.com` and `www.yourdomain.com`)

### 2. DNS Configuration

Add these DNS records to your domain provider:

#### For Root Domain (yourdomain.com)

```
Type: A
Name: @
Value: 76.76.19.61
```

#### For WWW Subdomain (<www.yourdomain.com>)

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### Alternative: CNAME for Root (if supported)

```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

### 3. SSL Certificate

Vercel automatically provisions SSL certificates for your custom domains. This usually takes a few minutes after DNS propagation.

## Google OAuth Configuration

### Update Authorized Redirect URIs

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" → "Credentials"
3. Click on your OAuth 2.0 Client ID
4. Under "Authorized redirect URIs", add:
   - `https://yourdomain.com/api/auth/callback/google`
   - `https://www.yourdomain.com/api/auth/callback/google` (if using www)

### Update Authorized Origins

Under "Authorized JavaScript origins", add:

- `https://yourdomain.com`
- `https://www.yourdomain.com` (if using www)

## DNS Providers Examples

### Cloudflare

```
Type: CNAME
Name: @
Target: cname.vercel-dns.com
Proxy Status: DNS only (gray cloud)

Type: CNAME  
Name: www
Target: cname.vercel-dns.com
Proxy Status: DNS only (gray cloud)
```

### GoDaddy

```
Type: CNAME
Host: @
Points to: cname.vercel-dns.com

Type: CNAME
Host: www
Points to: cname.vercel-dns.com
```

### Namecheap

```
Type: CNAME Record
Host: @
Value: cname.vercel-dns.com

Type: CNAME Record
Host: www
Value: cname.vercel-dns.com
```

## Testing Your Setup

### 1. DNS Propagation

Check DNS propagation using tools like:

- [What's My DNS](https://www.whatsmydns.net/)
- [DNS Checker](https://dnschecker.org/)

### 2. SSL Certificate

Verify SSL is working by visiting:

- `https://yourdomain.com`
- `https://www.yourdomain.com`

### 3. OAuth Flow

Test the authentication by:

1. Going to your custom domain
2. Clicking "Sign in with Google"
3. Completing the OAuth flow
4. Verifying you're redirected back to your domain

## Troubleshooting

### Common Issues

#### DNS Not Propagating

- DNS changes can take up to 48 hours to propagate globally
- Use DNS checking tools to monitor propagation
- Clear your local DNS cache: `sudo dscacheutil -flushcache` (macOS)

#### SSL Certificate Issues

- Verify DNS is pointing correctly to Vercel
- Check Vercel dashboard for SSL status
- SSL certificates are issued automatically after DNS verification

#### OAuth Redirect Errors

- Ensure redirect URIs in Google Console match exactly
- Check that NEXTAUTH_URL environment variable is set correctly
- Verify the domain is accessible and SSL is working

#### 404 or Domain Not Found

- Verify domain is added to Vercel project
- Check DNS records are configured correctly
- Ensure domain registration is active

### Environment Variable Checklist

```bash
# Required for custom domains
✓ NEXT_PUBLIC_DOMAIN=yourdomain.com
✓ NEXTAUTH_URL=https://yourdomain.com
✓ DATABASE_URL=your-neon-database-url
✓ GOOGLE_CLIENT_ID=your-google-client-id
✓ GOOGLE_CLIENT_SECRET=your-google-client-secret
✓ NEXTAUTH_SECRET=your-nextauth-secret

# Optional but recommended
✓ GOOGLE_SITE_VERIFICATION=verification-code
✓ NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Performance Optimization

### 1. CDN Configuration

The RoutineOS app is already optimized for CDN delivery with:

- Static asset optimization
- Image optimization
- Compression enabled
- Proper cache headers

### 2. SEO Configuration

The app automatically configures:

- Canonical URLs based on your domain
- Open Graph meta tags
- Twitter Card meta tags
- Structured data for search engines

## Security Considerations

### 1. HTTPS Only

- All production deployments should use HTTPS
- HTTP requests are automatically redirected to HTTPS
- Secure cookies are enabled for production domains

### 2. Domain Validation

- Only configured domains can access the application
- CORS is configured for your specific domain
- Proper security headers are set

## Support

If you encounter issues with domain setup:

1. Check the [Vercel Documentation](https://vercel.com/docs/concepts/projects/domains)
2. Verify your DNS configuration
3. Test OAuth configuration in Google Console
4. Check environment variables are set correctly

For RoutineOS-specific issues, please refer to the main documentation or open an issue in the GitHub repository.
