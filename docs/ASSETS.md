# Project Assets Guide

## Public Assets (`/client/public`)

All images are optimized and organized for production use.

### Hero Images
- **hero-team.png** - Team collaboration image for landing page
  - Use: Hero section, team introduction
  - Dimensions: High resolution (for web)
  - Purpose: Showcase professional team environment

### Portfolio Examples
- **portfolio-web.png** - Web design portfolio example
  - Use: Portfolio showcase section
  - Purpose: Display web design work samples

- **portfolio-mobile.png** - Mobile app portfolio example
  - Use: Portfolio showcase section
  - Purpose: Display mobile app development samples

- **portfolio-design.png** - Graphic design portfolio example
  - Use: Portfolio showcase section
  - Purpose: Display design system and branding work

### Branding
- **favicon.png** - Website favicon
  - Use: Browser tab, bookmarks
  - Purpose: Brand identity in browser

---

## Image Usage Examples

### In React Components

```typescript
// Use images in components
import { img } from '@/components/your-component';

export function LandingHero() {
  return (
    <div className="hero">
      <img 
        src="/hero-team.png" 
        alt="Professional team collaborating"
        className="hero-image"
      />
    </div>
  );
}
```

### In HTML

```html
<img src="/portfolio-web.png" alt="Web design portfolio example" />
<img src="/portfolio-mobile.png" alt="Mobile app portfolio example" />
<img src="/portfolio-design.png" alt="Graphic design portfolio example" />
```

---

## Asset Organization

```
client/
└── public/
    ├── favicon.png              ← Browser tab icon
    ├── hero-team.png            ← Landing page hero
    ├── portfolio-web.png        ← Portfolio example 1
    ├── portfolio-mobile.png     ← Portfolio example 2
    └── portfolio-design.png     ← Portfolio example 3
```

---

## Best Practices

### Image Loading
- Use responsive images with `srcset` for different screen sizes
- Implement lazy loading for portfolio images
- Add appropriate `alt` text for accessibility

### Optimization
- Images are already optimized for web
- Consider adding WebP format versions for better compression
- Use CSS `background-image` for decorative images

### Performance
- Keep images under 2MB for optimal loading
- Consider CDN for faster delivery in production
- Use image compression tools for further optimization

---

## Future Asset Additions

When adding new assets:
1. Place in `client/public/`
2. Use descriptive kebab-case names
3. Update this guide with usage information
4. Optimize images before adding
5. Ensure appropriate alt text for accessibility
