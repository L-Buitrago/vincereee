

# Premium Design Agency Website

## Design System
- **Background**: Deep Forest Green (#003D31) for hero/dark sections
- **Accent**: Electric Yellow (#F0FF3D) for buttons, hovers, CTAs
- **Light sections**: Off-white (#F2F2F2) for alternating sections
- **Typography**: Playfair Display (serif) for large editorial headings, Inter (sans-serif) for body/UI
- **Spacing**: Generous whitespace, bento-grid layout, large border-radius on all containers

## Navigation
- Fixed floating "Menu" button (top-right corner) with yellow accent
- Full-screen overlay menu with glassmorphism blur effect
- Large navigation links with color-change hover effects
- Smooth open/close animation

## Sections

### Hero
- Full-viewport dark green background
- Giant centered serif title: "Syncing fast-moving brands"
- Scroll-reveal animation (fade-in + slide-up on load)
- Subtle subtitle in sans-serif below

### Projects Grid
- Bento-grid layout with large rounded cards
- High-quality placeholder images (architecture/minimalist from Unsplash)
- Project name overlay on hover with smooth transition
- Alternating card sizes for visual interest

### Vision/About
- Off-white background section
- Centered editorial typography
- Clean, magazine-like layout with large serif quotes

### Footer
- Minimalist dark green footer
- Social links row
- Electric yellow "Contact" CTA button
- Minimal copyright text

## Interactivity
- Smooth scroll behavior (CSS `scroll-behavior: smooth`)
- Intersection Observer-based scroll reveal animations (fade-in + slide-up as elements enter viewport)
- Custom React hook for scroll-triggered animations
- Hover effects: scale on cards, color transitions on links
- No page flash (dark background maintained across routes)

## Technical Approach
- Single-page layout on Index with all sections
- Custom CSS variables for the new color palette
- Google Fonts: Playfair Display + Inter
- Reusable `ScrollReveal` wrapper component
- Responsive: mobile-first with bento grid adapting from 1 to 2-3 columns

