# Image Implementation Guide

## Quick Implementation Examples

### 1. Hero Section Component

```typescript
// client/src/components/HeroSection.tsx
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center">
      {/* Hero Image Background */}
      <div className="absolute inset-0 -z-10">
        <img 
          src="/hero-team.png" 
          alt="Team collaboration"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-20 text-white relative z-10">
        <h1 className="text-5xl font-bold mb-4">
          Connect With Top Freelancers
        </h1>
        <p className="text-xl mb-8 max-w-2xl">
          Find the perfect professionals for your projects and grow your business
        </p>
        <div className="flex gap-4">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Find Freelancers
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white">
            Post a Job
          </Button>
        </div>
      </div>
    </section>
  );
}
```

### 2. Portfolio Showcase Grid

```typescript
// client/src/components/PortfolioShowcase.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const portfolioItems = [
  {
    id: 1,
    title: 'Web Design',
    description: 'Beautiful, responsive websites that convert',
    image: '/portfolio-web.png',
    skills: ['React', 'TypeScript', 'Tailwind CSS']
  },
  {
    id: 2,
    title: 'Mobile Development',
    description: 'iOS and Android apps that users love',
    image: '/portfolio-mobile.png',
    skills: ['React Native', 'TypeScript', 'Firebase']
  },
  {
    id: 3,
    title: 'Brand Design',
    description: 'Complete branding and design systems',
    image: '/portfolio-design.png',
    skills: ['UI Design', 'Figma', 'Branding']
  }
];

export function PortfolioShowcase() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-4 text-center">
          Featured Projects
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Showcase of work across different categories
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition">
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gray-200">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition"
                />
              </div>

              {/* Content */}
              <CardHeader>
                <CardTitle className="text-xl">{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {item.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### 3. Landing Page with Hero

```typescript
// client/src/pages/landing.tsx
import { HeroSection } from '@/components/HeroSection';
import { PortfolioShowcase } from '@/components/PortfolioShowcase';
import { Features } from '@/components/Features';
import { CTA } from '@/components/CTA';

export default function Landing() {
  return (
    <div className="w-full">
      {/* Hero with team image */}
      <HeroSection />

      {/* Portfolio showcase with example images */}
      <PortfolioShowcase />

      {/* Features section */}
      <Features />

      {/* Call to action */}
      <CTA />
    </div>
  );
}
```

### 4. Team Showcase Section

```typescript
// client/src/components/TeamSection.tsx
export function TeamSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-4 text-center">
          Meet Our Community
        </h2>
        
        {/* Team image */}
        <div className="mt-12 rounded-lg overflow-hidden shadow-xl">
          <img
            src="/hero-team.png"
            alt="Professional team collaboration"
            className="w-full h-auto"
          />
        </div>

        <p className="text-center text-gray-600 mt-8 max-w-3xl mx-auto">
          Join thousands of talented freelancers and businesses already using ProConnectHub
          to build amazing projects together.
        </p>
      </div>
    </section>
  );
}
```

### 5. About Page Implementation

```typescript
// client/src/pages/about.tsx
export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">About ProConnectHub</h1>
          <p className="text-xl max-w-2xl">
            Connecting talented professionals with businesses worldwide
          </p>
        </div>
      </div>

      {/* Team Section with Hero Image */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12">Our Team</h2>
          <div className="rounded-lg overflow-hidden shadow-xl">
            <img
              src="/hero-team.png"
              alt="Our team"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Portfolio Examples */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12">Our Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PortfolioCard
              image="/portfolio-web.png"
              title="Web Design & Development"
            />
            <PortfolioCard
              image="/portfolio-mobile.png"
              title="Mobile App Development"
            />
            <PortfolioCard
              image="/portfolio-design.png"
              title="Brand & Design Systems"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function PortfolioCard({
  image,
  title
}: {
  image: string;
  title: string;
}) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-bold text-lg">{title}</h3>
      </div>
    </div>
  );
}
```

### 6. Image Optimization Best Practice

```typescript
// client/src/components/OptimizedImage.tsx
interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height
}: OptimizedImageProps) {
  return (
    <div className={`relative overflow-hidden bg-gray-200 ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        width={width}
        height={height}
        loading="lazy" // Lazy load for performance
      />
    </div>
  );
}

// Usage
<OptimizedImage
  src="/hero-team.png"
  alt="Team collaboration"
  className="w-full h-96"
/>
```

---

## CSS Styling Examples

### Hero with Image

```css
/* Tailwind CSS */
.hero {
  @apply relative w-full min-h-screen flex items-center;
}

.hero-image {
  @apply w-full h-full object-cover;
}

.hero-overlay {
  @apply absolute inset-0 bg-black/40;
}
```

### Portfolio Grid Responsive

```css
.portfolio-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
}

.portfolio-item {
  @apply bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition;
}

.portfolio-image {
  @apply w-full h-48 object-cover hover:scale-105 transition duration-300;
}
```

---

## Image Loading Optimization

### Lazy Loading
```typescript
<img
  src="/portfolio-web.png"
  alt="Web design"
  loading="lazy" // Lazy load below the fold
/>
```

### Responsive Images
```typescript
<img
  src="/hero-team.png"
  alt="Team"
  srcSet="/hero-team.png 1920w, /hero-team-768.png 768w"
  sizes="(max-width: 768px) 100vw, (max-width: 1920px) 80vw, 1920px"
/>
```

### Next.js Optimization (if upgrading)
```typescript
import Image from 'next/image';

<Image
  src="/hero-team.png"
  alt="Team"
  width={1920}
  height={1080}
  priority // Load above the fold
/>
```

---

## Accessibility Best Practices

✅ **Always use descriptive alt text**
```typescript
// Good
<img src="/hero-team.png" alt="Professional team collaborating in modern office" />

// Avoid
<img src="/hero-team.png" alt="image" />
```

✅ **Provide context in surrounding text**
```typescript
<section>
  <h2>Meet Our Professional Team</h2>
  <img src="/hero-team.png" alt="Team members working together" />
  <p>Join our network of talented professionals...</p>
</section>
```

✅ **Use semantic HTML**
```typescript
<figure>
  <img src="/portfolio-web.png" alt="Web design portfolio example" />
  <figcaption>Award-winning web design projects</figcaption>
</figure>
```

---

## Performance Checklist

- [x] Images optimized for web
- [x] Appropriate file sizes
- [x] Descriptive alt text
- [x] Lazy loading implemented
- [x] Responsive images
- [x] CSS optimization
- [x] Mobile-friendly display

---

## Asset References

For more information:
- 📚 See `docs/ASSETS.md` for complete asset documentation
- 🎨 See `CLEAN_STRUCTURE.md` for file organization
- 📖 See `README.md` for project overview
