# Velvet Pour - Premium Cocktails & Mocktails Website

A stunning, animation-rich website for a premium cocktail bar built with React, GSAP, and Tailwind CSS. Features immersive scroll-based animations, interactive components, and a modern design aesthetic.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Components Guide](#components-guide)
- [Animations](#animations)
- [SEO & Performance](#seo--performance)
- [Deployment](#deployment)
- [Customization Guide](#customization-guide)
- [Browser Support](#browser-support)
- [Contributing](#contributing)
- [License](#license)

## Overview

Velvet Pour is a production-ready website showcasing premium cocktails and mocktails with an emphasis on visual storytelling and smooth, engaging animations. The project demonstrates modern web development practices, including:

- Advanced GSAP scroll-triggered animations
- Responsive design with mobile-first approach
- SEO optimization with structured data
- Performance optimization with code splitting
- Clean, maintainable component architecture

**Live Demo:** [Add your deployment URL here]

## Features

### Design & UX
- **Immersive Hero Section** with video background and character-by-character text animations
- **Scroll-Triggered Animations** throughout the entire page for engaging user experience
- **Interactive Cocktail Slider** with smooth transitions and navigation
- **Responsive Grid Gallery** with staggered reveal animations
- **Parallax Effects** on decorative elements
- **Masked Image Reveal** in the Art section
- **Smooth Scroll Behavior** with GSAP ScrollTrigger

### Technical Features
- **Modern React Architecture** with functional components and hooks
- **GSAP Animation System** with ScrollTrigger and SplitText plugins
- **Tailwind CSS 4** with custom utilities and theme configuration
- **SEO Optimized** with comprehensive meta tags and structured data
- **Performance Optimized** with code splitting and lazy loading
- **Accessibility** with proper ARIA labels and semantic HTML
- **Mobile Responsive** with breakpoint-specific animations

## Tech Stack

### Core
- **React 19.1.0** - UI library
- **Vite 7.0.4** - Build tool and dev server
- **Tailwind CSS 4.1.11** - Utility-first CSS framework

### Animation & Interaction
- **GSAP 3.13.0** - Animation library
- **@gsap/react 2.1.2** - GSAP React integration
- **react-responsive 10.0.1** - Responsive design utilities

### Development
- **ESLint** - Code linting
- **@vitejs/plugin-react** - React support for Vite

## Project Structure

```
mojito-cocktail/
├── public/
│   ├── images/              # All image assets (40+ files)
│   │   ├── logo.png         # Company logo
│   │   ├── hero-*.png       # Hero section images
│   │   ├── cocktail-*.png   # Cocktail section decorations
│   │   ├── drink[1-4].png   # Cocktail product images
│   │   ├── abt[1-5].png     # About section gallery
│   │   ├── profile[1-4].png # Customer profiles
│   │   ├── social icons     # Instagram, Twitter, Facebook
│   │   └── ...              # Other UI elements
│   ├── videos/
│   │   └── output.mp4       # Hero background video
│   └── fonts/
│       └── Modern Negra Demo.ttf
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx       # Navigation bar with scroll effects
│   │   ├── Hero.jsx         # Landing section with video bg
│   │   ├── Cocktails.jsx    # Cocktail/mocktail listings
│   │   ├── About.jsx        # About section with gallery
│   │   ├── Art.jsx          # Interactive feature showcase
│   │   ├── Menu.jsx         # Cocktail slider with recipes
│   │   └── Contact.jsx      # Footer with contact info
│   ├── App.jsx              # Main application component
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles & Tailwind config
│
├── constants/
│   └── index.js             # All app data and configuration
│
├── index.html               # HTML entry with SEO meta tags
├── vite.config.js           # Vite configuration with optimizations
├── package.json             # Dependencies and scripts
├── eslint.config.js         # ESLint configuration
├── tailwind.config.js       # Tailwind configuration (if needed)
└── README.md                # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ (Recommended: Latest LTS version)
- npm 9+ or yarn 1.22+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mojito-cocktail
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   The app will open at `http://localhost:5173`

### Available Scripts

```bash
# Development
npm run dev          # Start dev server with HMR

# Production
npm run build        # Build optimized production bundle
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint to check code quality
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory for environment-specific configuration:

```env
# API URLs (if needed in future)
VITE_API_URL=https://api.yoursite.com

# Analytics (if needed)
VITE_GA_ID=your-google-analytics-id

# Site URL for SEO
VITE_SITE_URL=https://velvetpour.com
```

### Constants Configuration

All site content is centralized in `constants/index.js`:

```javascript
// Update company information
const companyInfo = {
    name: "Your Bar Name",
    tagline: "Your Tagline",
    logo: "/images/logo.png",
};

// Update SEO settings
const seoConfig = {
    title: "Your Site Title",
    description: "Your site description",
    keywords: "your, keywords, here",
    // ... more SEO fields
};

// Update hero content
const heroContent = {
    title: "YOUR TITLE",
    description: "Your description",
    // ... more hero fields
};

// And many more... (see file for complete list)
```

### Customizing Colors

Update Tailwind theme in `src/index.css`:

```css
@theme {
    --color-yellow: #e7d393;        /* Primary accent color */
    --color-white-100: #efefef;     /* Secondary text color */
    /* Add more colors as needed */
}
```

## Components Guide

### Navbar
- Fixed navigation with scroll-triggered background blur
- Responsive mobile/desktop layouts
- Smooth scroll to sections

**Key Props:** None (uses constants)

**Customization:**
```javascript
// In constants/index.js
const navLinks = [
    { id: "cocktails", title: "Cocktails" },
    { id: "about", title: "About Us" },
    // Add/modify links here
];
```

### Hero
- Full-screen landing section
- Background video with scroll control
- Character-by-character title animation
- Parallax leaf decorations

**Key Features:**
- Responsive video playback
- Mobile-optimized animations
- Auto-playing text reveals

### Cocktails
- Two-column layout for cocktails and mocktails
- Parallax animated decorations
- Responsive pricing cards

**Data Structure:**
```javascript
const cocktailLists = [
    {
        name: "Cocktail Name",
        country: "US",
        detail: "750 ml",
        price: "$20"
    },
    // ...
];
```

### About
- Statistics display (rating, customer count)
- 5-image responsive grid
- Word-by-word text animations
- Staggered image reveals

### Art
- Scroll-pinned interactive section
- Masked image with zoom effect
- Feature lists on both sides
- Reveal animations

### Menu
- Interactive cocktail carousel
- 4 featured cocktails with details
- Prev/Next navigation
- Tab-based cocktail selection
- Smooth transition animations

**Data Structure:**
```javascript
const sliderLists = [
    {
        id: 1,
        name: "Cocktail Name",
        image: "/images/drink1.png",
        title: "Feature Title",
        description: "Detailed description...",
    },
    // ...
];
```

### Contact
- Contact information display
- Opening hours schedule
- Social media links
- Animated leaf decorations

## Animations

### GSAP Integration

The project uses GSAP 3 with the following plugins:
- **ScrollTrigger** - Scroll-based animations
- **SplitText** - Text animation utilities

### Animation Examples

**Text Split Animation:**
```javascript
const titleSplit = new SplitText('.title', { type: 'chars, words' });
gsap.from(titleSplit.chars, {
    yPercent: 100,
    duration: 1.8,
    stagger: 0.05,
});
```

**Scroll-Triggered Animation:**
```javascript
gsap.timeline({
    scrollTrigger: {
        trigger: '#section',
        start: 'top center',
        end: 'bottom center',
        scrub: true,
    }
}).to('.element', { y: 200 });
```

**Mobile-Responsive Animations:**
```javascript
const isMobile = useMediaQuery({ maxWidth: 767 });
const startValue = isMobile ? 'top 50%' : 'center 60%';
```

### Performance Tips

1. Use `scrub` for smooth scroll-linked animations
2. Implement `will-change` CSS property for animated elements
3. Use `useGSAP` hook for proper cleanup
4. Add `isMobile` checks for simplified mobile animations

## SEO & Performance

### SEO Features

✅ **Comprehensive Meta Tags**
- Open Graph for social media
- Twitter Cards
- Structured data (JSON-LD)
- Schema.org markup for local business

✅ **Semantic HTML**
- Proper heading hierarchy
- ARIA labels and landmarks
- Alt text for all images

✅ **Structured Data**
```json
{
  "@type": "BarOrPub",
  "name": "Velvet Pour",
  "aggregateRating": {
    "ratingValue": "4.5",
    "ratingCount": "1200"
  }
}
```

### Performance Optimizations

✅ **Code Splitting**
- Vendor chunks for React and GSAP
- Optimized bundle sizes

✅ **Build Optimizations**
- Terser minification
- Console log removal in production
- Tree shaking

✅ **Asset Optimization**
- Video preload strategy
- Image lazy loading (via browser native)
- Font preconnect

### Lighthouse Scores (Target)

- **Performance:** 90+
- **Accessibility:** 95+
- **Best Practices:** 95+
- **SEO:** 100

### Optimization Checklist

Before deploying to production:

- [ ] Compress all images (use tools like ImageOptim, Squoosh)
- [ ] Convert images to WebP format
- [ ] Optimize video file size and format
- [ ] Enable gzip/brotli compression on server
- [ ] Configure CDN for static assets
- [ ] Add cache headers for static files
- [ ] Test on real mobile devices
- [ ] Run Lighthouse audit
- [ ] Test Core Web Vitals

## Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Deployment Platforms

#### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

#### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### GitHub Pages
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts
"deploy": "npm run build && gh-pages -d dist"

# Deploy
npm run deploy
```

#### Custom Server (Apache/Nginx)

1. Build the project: `npm run build`
2. Upload `dist/` contents to your server
3. Configure server for SPA routing:

**Nginx:**
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

**Apache (.htaccess):**
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### Post-Deployment

1. Update `seoConfig.ogImage` to use absolute URL
2. Test all social media previews
3. Submit sitemap to Google Search Console
4. Set up analytics (Google Analytics, Plausible, etc.)
5. Configure error tracking (Sentry, LogRocket, etc.)

## Customization Guide

### Changing Content

All content is in `constants/index.js`. Update any section:

```javascript
// Change hero content
export const heroContent = {
    title: "YOUR BRAND",
    tagline: "Your tagline here",
    // ...
};

// Change cocktail menu
export const cocktailLists = [
    { name: "Your Cocktail", price: "$15", /* ... */ },
    // ...
];
```

### Changing Colors

1. Update Tailwind theme in `src/index.css`:
```css
@theme {
    --color-primary: #your-color;
    --color-secondary: #your-color;
}
```

2. Use in components:
```jsx
<div className="text-primary bg-secondary">
```

### Changing Fonts

1. Add font to `public/fonts/` or use Google Fonts
2. Update `src/index.css`:
```css
@import url("https://fonts.googleapis.com/css2?family=Your+Font");

@theme {
    --font-custom: "Your Font", sans-serif;
}
```

3. Apply in components:
```jsx
<h1 className="font-custom">Title</h1>
```

### Adding New Sections

1. Create component in `src/components/NewSection.jsx`
2. Import in `App.jsx`:
```jsx
import NewSection from './components/NewSection';

function App() {
    return (
        <main>
            {/* ... other components */}
            <NewSection />
        </main>
    );
}
```

3. Add to navigation in `constants/index.js`:
```javascript
const navLinks = [
    // ...
    { id: "new-section", title: "New Section" },
];
```

### Modifying Animations

Example: Change hero title animation speed

```javascript
// src/components/Hero.jsx
gsap.from(heroSplit.chars, {
    yPercent: 100,
    duration: 2.5,  // Change from 1.8 to 2.5
    stagger: 0.08,  // Change from 0.05 to 0.08
});
```

## Browser Support

- **Chrome/Edge:** Latest 2 versions
- **Firefox:** Latest 2 versions
- **Safari:** Latest 2 versions
- **iOS Safari:** iOS 14+
- **Chrome Android:** Latest version

### Polyfills

Not required for modern browsers. For legacy browser support, add polyfills:

```bash
npm install core-js
```

Then import in `main.jsx`:
```javascript
import 'core-js/stable';
```

## Troubleshooting

### Common Issues

**Video not playing:**
- Check video format (MP4 H.264 recommended)
- Ensure `muted` and `playsInline` attributes are set
- Verify video file size (< 5MB recommended)

**Animations not working:**
- Verify GSAP plugins are registered in `App.jsx`
- Check ScrollTrigger start/end values
- Ensure elements have proper selectors

**Build errors:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`
- Check Node.js version (18+ required)

**Images not loading:**
- Verify image paths start with `/` (e.g., `/images/logo.png`)
- Check that images exist in `public/images/`
- Ensure proper file extensions (case-sensitive on Linux)

## Performance Monitoring

Add performance monitoring to track real-world metrics:

```javascript
// src/main.jsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style

- Use functional components with hooks
- Follow ESLint configuration
- Write clear, descriptive variable names
- Comment complex logic
- Keep components small and focused

## Credits

- **GSAP** - Animation library by GreenSock
- **Tailwind CSS** - Utility-first CSS framework
- **React** - UI library by Meta
- **Vite** - Next generation frontend tooling

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Email: akashcodesharma@gmail.com
- Website: [Add your website URL]

---

**Built with ❤️ by Akash Sharma**

*Last Updated: February 2026*
