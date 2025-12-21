# Dylan's 3D Portfolio

A modern, interactive 3D portfolio built with Next.js, React Three Fiber, and Tailwind CSS.

## Features

- **3D Workspace Environment** - Futuristic digital workspace with holographic displays
- **Floating Project Cards** - Interactive 3D project showcases with hover effects
- **Particle System** - Dynamic neon particles floating through the scene
- **Smooth Animations** - Workspace boot-up sequence and floating animations
- **Responsive Design** - Mobile-friendly fallback for smaller screens
- **Camera Controls** - Interactive orbit controls to explore the scene

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **React Three Fiber** - React renderer for Three.js
- **Drei** - Useful helpers for R3F
- **Framer Motion** - Animation library
- **Tailwind CSS** - Utility-first styling

## Getting Started

The dev server is already running at:
- **Local**: http://localhost:3000
- **Network**: http://192.168.1.102:3000

### Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Customization Guide

### Adding Your Projects

Edit `components/Workspace.tsx` and modify the `projects` array:

```typescript
const projects = [
  {
    title: "Your Project Name",
    description: "Short description",
    position: [-3, 1.5, -2], // X, Y, Z coordinates
    color: "#00f0ff", // Neon color
  },
  // Add more projects...
];
```

### Changing Colors

The neon color palette is defined in `tailwind.config.ts`:

```typescript
neon: {
  blue: "#00f0ff",
  purple: "#b829ff",
  pink: "#ff2e97",
}
```

### Adjusting Camera

Modify camera settings in `components/Scene.tsx`:

```typescript
<Canvas
  camera={{ position: [0, 2, 8], fov: 50 }}
  // Adjust position and field of view
>
```

### Customizing Particles

Edit particle count and behavior in `components/Particles.tsx`:

```typescript
const count = 300; // Number of particles
```

## Project Structure

```
├── app/
│   ├── page.tsx          # Main page with mobile detection
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── Scene.tsx         # 3D Canvas setup
│   ├── Workspace.tsx     # Main 3D workspace
│   ├── ProjectCard.tsx   # Floating project cards
│   ├── Particles.tsx     # Particle system
│   └── MobileFallback.tsx # Mobile UI
└── public/               # Static assets
```

## Next Steps

1. **Add Your Content** - Replace placeholder text with your info
2. **Upload 3D Models** - Add custom .glb/.gltf models to public/models/
3. **Create Project Pages** - Add detailed project pages
4. **Add Interactions** - Make cards clickable to show project details
5. **Optimize Performance** - Add loading strategies for production
6. **Deploy** - Deploy to Vercel, Netlify, or your preferred host

## Performance Tips

- Keep 3D models under 5MB
- Optimize textures to power-of-2 dimensions
- Use `@react-three/drei` helpers for better performance
- Implement lazy loading for heavy components
- Test on target devices regularly

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari (may have limited WebGL support)
- Mobile: Falls back to 2D UI

---

Built with passion and Three.js magic
