# Frontend UI/UX Enhancement Specification

## Document Overview

**Version:** 1.0
**Date:** 2024
**Status:** Draft - Research Phase Complete
**Author:** Development Team

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [Research Findings](#research-findings)
4. [Design Principles](#design-principles)
5. [Proposed Enhancements](#proposed-enhancements)
6. [Component Specifications](#component-specifications)
7. [Layout & Spacing System](#layout--spacing-system)
8. [Animation & Interaction Guidelines](#animation--interaction-guidelines)
9. [Color & Typography Enhancements](#color--typography-enhancements)
10. [Implementation Plan](#implementation-plan)
11. [References & Inspiration](#references--inspiration)

---

## Executive Summary

### Objective
Transform the Finance Learning Platform frontend from a blocky, card-heavy interface into a fluid, modern, and engaging user experience that aligns with 2024 design trends while maintaining accessibility and usability.

### Key Goals
- **Reduce Blockiness**: Transform rigid card layouts into flowing, organic designs
- **Enhance Flow**: Create seamless transitions and visual hierarchy
- **Improve Engagement**: Add micro-interactions and smooth animations
- **Maintain Accessibility**: Ensure all enhancements remain WCAG compliant
- **Preserve Brand Identity**: Keep the "Peaceful Garden" aesthetic while modernizing

### Scope
- Dashboard redesign
- Card component enhancements
- Layout system improvements
- Animation and transition system
- Spacing and typography refinements
- Component library expansion

---

## Current State Analysis

### Strengths
- ✅ Consistent color palette (sage, earth, sky, cream tones)
- ✅ Good use of framer-motion for basic animations
- ✅ Responsive grid layouts
- ✅ Clear component structure
- ✅ Accessibility considerations in place

### Pain Points Identified

#### 1. Visual Blockiness
- **Issue**: Cards feel like rigid rectangles stacked vertically
- **Impact**: Interface feels static and uninviting
- **Examples**:
  - Dashboard cards are uniform sizes
  - Module cards in grid feel repetitive
  - No visual flow between sections

#### 2. Limited Visual Hierarchy
- **Issue**: All cards have similar visual weight
- **Impact**: Users struggle to identify primary actions
- **Examples**:
  - Progress cards don't stand out
  - No clear focal points on dashboard

#### 3. Spacing Inconsistencies
- **Issue**: Tight spacing between elements
- **Impact**: Content feels cramped
- **Examples**:
  - Cards have minimal padding
  - Sections lack breathing room
  - Grid gaps are too small

#### 4. Static Interactions
- **Issue**: Limited hover states and micro-interactions
- **Impact**: Interface feels unresponsive
- **Examples**:
  - Cards have basic hover (shadow only)
  - No staggered animations
  - Buttons lack depth feedback

#### 5. Layout Rigidity
- **Issue**: Strict grid layouts everywhere
- **Impact**: No visual interest or flow
- **Examples**:
  - Dashboard uses uniform 4-column grid
  - Modules page is pure 3-column grid
  - No asymmetric or dynamic layouts

---

## Research Findings

### Modern UI Trends (2024)

#### 1. Glassmorphism
- **Definition**: Frosted glass effect with transparency and backdrop blur
- **Usage**: Cards, modals, overlays
- **Benefits**: Creates depth without heavy shadows
- **Examples**: iOS design language, modern dashboards
- **Implementation**: `backdrop-blur-lg`, `bg-white/70`, `border-white/20`

#### 2. Soft Shadows & Depth
- **Definition**: Layered shadows for subtle elevation
- **Usage**: Cards, buttons, floating elements
- **Benefits**: Creates hierarchy without harsh lines
- **Examples**: Material Design 3, modern web apps
- **Implementation**: Multiple shadow layers, varying opacity

#### 3. Dynamic Layouts
- **Definition**: Asymmetric grids, overlapping elements, varied card sizes
- **Usage**: Dashboards, content grids
- **Benefits**: Creates visual interest and guides eye flow
- **Examples**: Bento grid layouts, Pinterest-style masonry
- **Implementation**: CSS Grid with varied spans, absolute positioning

#### 4. Micro-interactions
- **Definition**: Subtle animations on hover, click, scroll
- **Usage**: Buttons, cards, links, form inputs
- **Benefits**: Provides feedback and delight
- **Examples**: Scale on hover, color transitions, ripple effects
- **Implementation**: Framer Motion, CSS transitions

#### 5. Generous Whitespace
- **Definition**: Increased padding and margins
- **Usage**: All components and layouts
- **Benefits**: Reduces cognitive load, improves readability
- **Examples**: Apple design, modern SaaS dashboards
- **Implementation**: Larger padding scale, section spacing

#### 6. Rounded Corners
- **Definition**: Softer, more organic shapes
- **Usage**: Cards, buttons, containers
- **Benefits**: Feels more approachable and modern
- **Examples**: iOS, modern web apps
- **Implementation**: Increased border-radius values

### Educational Platform Patterns

#### Key Insights from Research:
1. **Scroll-Learning UI**: Vertical scroll with card-based content (TikTok-inspired)
2. **Gamification Elements**: Progress bars, badges, streaks prominently displayed
3. **Minimalist Design**: Clean layouts with focus on content
4. **Interactive Elements**: Quizzes, videos embedded in flow
5. **Dark Mode Support**: Essential for accessibility

### Finance Platform Patterns

#### Key Insights from Research:
1. **Dashboard Widgets**: Modular, resizable components
2. **Data Visualization**: Charts and graphs integrated seamlessly
3. **Trust Indicators**: Clear, clean design builds confidence
4. **Quick Actions**: Prominent CTAs for key actions
5. **Status Indicators**: Visual feedback for states (active, pending, etc.)

### Component Library Research

#### Recommended Libraries:
- **shadcn/ui**: Modern component library built on Radix UI + Tailwind
- **Headless UI**: Unstyled, accessible components
- **Radix UI**: Low-level primitives for complex components
- **Framer Motion**: Advanced animations (already in use)

---

## Design Principles

### 1. Flow Over Blocks
- **Principle**: Create visual flow that guides users naturally
- **Implementation**:
  - Overlapping elements
  - Asymmetric layouts
  - Staggered animations
  - Curved dividers instead of straight lines

### 2. Depth Through Layers
- **Principle**: Use shadows, blur, and elevation to create depth
- **Implementation**:
  - Layered shadows (soft, gentle, floating)
  - Glassmorphism effects
  - Z-index hierarchy
  - Gradient overlays

### 3. Breathing Room
- **Principle**: Generous spacing reduces cognitive load
- **Implementation**:
  - Increased padding (p-6 → p-8 for cards)
  - Larger gaps between sections (space-y-6 → space-y-8)
  - Container max-widths for readability
  - More whitespace around important elements

### 4. Subtle Motion
- **Principle**: Animations should enhance, not distract
- **Implementation**:
  - Staggered children animations
  - Smooth transitions (300-400ms)
  - Easing functions (ease-out, cubic-bezier)
  - Reduced motion support

### 5. Organic Shapes
- **Principle**: Softer edges feel more approachable
- **Implementation**:
  - Increased border-radius (1rem → 1.5rem → 2rem)
  - Rounded buttons and inputs
  - Curved dividers
  - Organic iconography

### 6. Visual Hierarchy
- **Principle**: Guide users with size, color, and position
- **Implementation**:
  - Varied card sizes
  - Color accents for importance
  - Typography scale
  - Focal points on dashboard

---

## Proposed Enhancements

### 1. Card Component Redesign

#### Current State
```tsx
<Card className="p-6">
  // Content
</Card>
```

#### Proposed Variants

**A. Glass Card**
- Frosted glass effect
- Subtle border
- Backdrop blur
- Use for: Dashboard widgets, overlays

**B. Elevated Card**
- Higher shadow elevation
- Slight scale on hover
- Use for: Primary actions, featured content

**C. Gradient Card**
- Subtle gradient overlay
- Maintains white base
- Use for: Progress indicators, stats

**D. Interactive Card**
- Enhanced hover states
- Scale transform
- Border glow effect
- Use for: Clickable modules, navigation

#### Implementation Specs
```tsx
interface CardProps {
  variant?: 'default' | 'glass' | 'elevated' | 'gradient' | 'interactive';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  delay?: number; // For staggered animations
  className?: string;
}
```

### 2. Dashboard Layout Improvements

#### Current Layout
- Uniform 4-column grid for stats
- 2-column grid for main content
- Static spacing

#### Proposed Layout
- **Asymmetric Grid**: Mix of 1-column, 2-column, and 3-column spans
- **Featured Widget**: Large hero card for primary action
- **Staggered Stats**: Varying sizes for visual interest
- **Overlapping Elements**: Subtle overlap between sections
- **Dynamic Spacing**: Varying gaps based on content importance

#### Layout Structure
```
┌─────────────────────────────────────────┐
│  Welcome Header (Full Width)            │
├─────────────────────────────────────────┤
│  Today's Focus (Full Width)             │
├─────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐            │
│  │   Mood   │  │Mindfulness│            │
│  └──────────┘  └──────────┘            │
├─────────────────────────────────────────┤
│  ┌───┐ ┌───┐ ┌──────┐ ┌───┐          │
│  │ P │ │ M │ │  J   │ │ S │          │
│  └───┘ └───┘ └──────┘ └───┘          │
│  (Stats - Varied Sizes)                │
├─────────────────────────────────────────┤
│  ┌──────────────┐ ┌──────────────┐    │
│  │   Journal    │ │   Progress   │    │
│  └──────────────┘ └──────────────┘    │
└─────────────────────────────────────────┘
```

### 3. Module Cards Enhancement

#### Current State
- Uniform 3-column grid
- Same card size for all modules
- Basic hover effect

#### Proposed Improvements
- **Featured Module**: Larger card for current/next module
- **Progress Visualization**: Visual progress rings/charts
- **Status Indicators**: Color-coded borders for status
- **Hover Effects**:
  - Scale transform (1.02)
  - Shadow elevation increase
  - Border color transition
  - Subtle lift animation

### 4. Spacing System Overhaul

#### Current Spacing Scale
- Cards: `p-6` (1.5rem)
- Sections: `space-y-6` (1.5rem)
- Grid gaps: `gap-4` (1rem)

#### Proposed Spacing Scale
- **Cards**:
  - Small: `p-4` (1rem)
  - Medium: `p-6` (1.5rem) - Default
  - Large: `p-8` (2rem) - Featured cards
  - Extra Large: `p-10` (2.5rem) - Hero sections

- **Sections**:
  - Tight: `space-y-4` (1rem)
  - Normal: `space-y-6` (1.5rem) - Default
  - Loose: `space-y-8` (2rem) - Major sections
  - Extra Loose: `space-y-10` (2.5rem) - Page-level

- **Grid Gaps**:
  - Tight: `gap-4` (1rem)
  - Normal: `gap-6` (1.5rem) - Default
  - Loose: `gap-8` (2rem) - Dashboard
  - Extra Loose: `gap-10` (2.5rem) - Hero sections

### 5. Animation System

#### Stagger Animations
- **Dashboard Stats**: 0.05s delay between each
- **Module Cards**: 0.03s delay between each
- **List Items**: 0.02s delay between each

#### Transition Timing
- **Fast**: 200ms - Hover states, micro-interactions
- **Normal**: 300ms - Card hovers, button clicks
- **Slow**: 400ms - Page transitions, modal opens
- **Very Slow**: 600ms - Complex animations

#### Easing Functions
- **Ease Out**: `cubic-bezier(0.4, 0, 0.2, 1)` - Default
- **Ease In Out**: `cubic-bezier(0.4, 0, 0.2, 1)` - Smooth
- **Spring**: `cubic-bezier(0.34, 1.56, 0.64, 1)` - Bouncy (sparingly)

#### Animation Types
1. **Fade In**: Opacity 0 → 1
2. **Slide Up**: Translate Y +20px → 0
3. **Scale**: Scale 0.95 → 1
4. **Slide In**: Translate X ±20px → 0
5. **Rotate**: Rotate -5deg → 0 (sparingly)

---

## Component Specifications

### Enhanced Card Component

#### Props Interface
```typescript
interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'glass' | 'elevated' | 'gradient' | 'interactive';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  onClick?: () => void;
  delay?: number;
  className?: string;
  animated?: boolean; // Enable entrance animation
}
```

#### Variant Styles

**Default**
- Background: `bg-white`
- Border: `border border-sage-100`
- Shadow: `shadow-soft`
- Radius: `rounded-extra` (1.5rem)
- Hover: Shadow increase, border color change

**Glass**
- Background: `bg-white/70 backdrop-blur-lg`
- Border: `border border-white/20`
- Shadow: `shadow-gentle`
- Radius: `rounded-extra`
- Hover: Background opacity increase, shadow increase

**Elevated**
- Background: `bg-white`
- Border: `border border-sage-100`
- Shadow: `shadow-floating`
- Radius: `rounded-extra`
- Hover: Scale transform (1.02), shadow increase

**Gradient**
- Background: `bg-gradient-to-br from-white via-sage-50/30 to-white`
- Border: `border border-sage-100/50`
- Shadow: `shadow-soft`
- Radius: `rounded-extra`
- Hover: Gradient intensity increase

**Interactive**
- Background: `bg-white`
- Border: `border-2 border-sage-200`
- Shadow: `shadow-gentle`
- Radius: `rounded-extra`
- Hover: Scale (1.02), shadow-floating, border-sage-400
- Active: Scale (0.98)

### Button Enhancements

#### Current State
- Basic hover color change
- Simple transitions

#### Proposed Improvements
- **Ripple Effect**: On click (optional)
- **Scale Transform**: 1.0 → 1.02 on hover, 0.98 on active
- **Shadow Elevation**: Increase on hover
- **Icon Animation**: Rotate or translate icons on hover
- **Loading States**: Spinner with smooth transition

### Progress Bar Enhancements

#### Current State
- Basic linear progress bar
- Simple color transitions

#### Proposed Improvements
- **Animated Fill**: Smooth width transition with easing
- **Gradient Fill**: Gradient colors for visual interest
- **Pulse Effect**: Subtle pulse on active progress
- **Milestone Markers**: Visual markers at key percentages
- **Circular Variant**: For dashboard stats

### Badge Enhancements

#### Current State
- Basic colored badges
- Simple variants

#### Proposed Improvements
- **Pulse Animation**: For active/important badges
- **Icon Integration**: Icons within badges
- **Gradient Variants**: Gradient backgrounds
- **Size Variants**: More size options

---

## Layout & Spacing System

### Container System

#### Max Widths
- **Narrow**: `max-w-4xl` - Content pages
- **Medium**: `max-w-6xl` - Dashboard (default)
- **Wide**: `max-w-7xl` - Full-width dashboards
- **Full**: No max-width - Hero sections

#### Padding System
- **Page Padding**: `p-6` (1.5rem) - Default
- **Section Padding**: `py-8` (2rem) - Major sections
- **Card Padding**: See Card Component specs

### Grid System Enhancements

#### Dashboard Grid
```css
/* Asymmetric grid for visual interest */
grid-template-columns: repeat(12, 1fr);
grid-auto-rows: minmax(200px, auto);
gap: 1.5rem;
```

#### Module Grid
```css
/* Responsive with varied spans */
grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
gap: 1.5rem;
```

### Spacing Utilities

#### Vertical Spacing
- `space-y-4` - Tight (forms, lists)
- `space-y-6` - Normal (default)
- `space-y-8` - Loose (sections)
- `space-y-10` - Extra loose (page-level)

#### Horizontal Spacing
- `gap-4` - Tight grids
- `gap-6` - Normal grids (default)
- `gap-8` - Loose grids
- `gap-10` - Extra loose grids

---

## Animation & Interaction Guidelines

### Entrance Animations

#### Page Load Sequence
1. **Header**: Fade in + slide down (0ms delay)
2. **Hero Section**: Fade in + scale (100ms delay)
3. **Primary Cards**: Fade in + slide up (200ms delay)
4. **Secondary Cards**: Fade in + slide up (300ms delay, staggered)
5. **Tertiary Elements**: Fade in (400ms delay, staggered)

#### Stagger Patterns
- **Dashboard Stats**: 0.05s increments
- **Module Cards**: 0.03s increments
- **List Items**: 0.02s increments
- **Form Fields**: 0.04s increments

### Hover Interactions

#### Card Hover
- **Scale**: `scale-[1.02]` (2% increase)
- **Shadow**: Elevation increase
- **Border**: Color transition
- **Duration**: 300ms
- **Easing**: `ease-out`

#### Button Hover
- **Scale**: `scale-[1.02]`
- **Shadow**: Elevation increase
- **Background**: Color shift
- **Duration**: 200ms
- **Easing**: `ease-out`

#### Link Hover
- **Color**: Transition to accent color
- **Underline**: Slide in animation (optional)
- **Duration**: 200ms

### Click Interactions

#### Button Click
- **Scale**: `scale-[0.98]` (active state)
- **Duration**: 100ms
- **Easing**: `ease-in`

#### Card Click
- **Scale**: `scale-[0.99]`
- **Duration**: 150ms
- **Easing**: `ease-in-out`

### Scroll Animations

#### Scroll Reveal
- Trigger: Element enters viewport
- Animation: Fade in + slide up
- Duration: 400ms
- Easing: `ease-out`
- Threshold: 0.1 (10% visible)

### Loading States

#### Skeleton Loaders
- Shimmer animation
- Match content shape
- Subtle pulse effect
- Duration: 2s infinite

#### Spinner
- Smooth rotation
- Fade in/out
- Size variants
- Color matches theme

---

## Color & Typography Enhancements

### Color System Refinements

#### Current Palette (Maintained)
- Sage: Primary actions, success states
- Earth: Text, backgrounds
- Sky: Information, links
- Cream: Backgrounds, subtle accents
- Moss: Secondary actions

#### New Accent Colors
- **Success**: Green gradient (`from-green-400 to-green-600`)
- **Warning**: Amber gradient (`from-amber-400 to-amber-600`)
- **Error**: Red gradient (`from-red-400 to-red-600`)
- **Info**: Blue gradient (`from-blue-400 to-blue-600`)

#### Gradient Overlays
- **Subtle**: `from-white/50 to-transparent`
- **Medium**: `from-white/70 to-white/30`
- **Strong**: `from-sage-100/50 to-transparent`

### Typography Enhancements

#### Font Scale Refinements
- **Display**: `text-5xl` (3rem) - Hero headings
- **H1**: `text-4xl` (2.25rem) - Page titles
- **H2**: `text-3xl` (1.875rem) - Section titles
- **H3**: `text-2xl` (1.5rem) - Card titles
- **H4**: `text-xl` (1.25rem) - Subsection titles
- **Body Large**: `text-lg` (1.125rem) - Important text
- **Body**: `text-base` (1rem) - Default
- **Body Small**: `text-sm` (0.875rem) - Secondary text
- **Caption**: `text-xs` (0.75rem) - Labels, metadata

#### Font Weight Scale
- **Light**: `font-light` (300) - Large display text
- **Normal**: `font-normal` (400) - Body text
- **Medium**: `font-medium` (500) - Emphasis
- **Semibold**: `font-semibold` (600) - Headings
- **Bold**: `font-bold` (700) - Strong emphasis

#### Line Height Refinements
- **Tight**: `leading-tight` (1.25) - Headings
- **Normal**: `leading-normal` (1.5) - Body
- **Relaxed**: `leading-relaxed` (1.75) - Long-form content

---

## Implementation Plan

### Phase 1: Foundation (Week 1)

#### Tasks
1. **Enhance Card Component**
   - Add variant system
   - Implement glassmorphism
   - Add padding variants
   - Create hover states
   - Add animation support

2. **Update Spacing System**
   - Extend Tailwind config
   - Add new spacing utilities
   - Update component defaults

3. **Animation Infrastructure**
   - Set up Framer Motion utilities
   - Create animation presets
   - Add stagger helpers
   - Implement reduced motion support

#### Deliverables
- Enhanced Card component with all variants
- Updated spacing system
- Animation utility functions
- Component documentation

### Phase 2: Dashboard Redesign (Week 2)

#### Tasks
1. **Dashboard Layout**
   - Implement asymmetric grid
   - Add featured widget
   - Vary card sizes
   - Add overlapping elements

2. **Component Updates**
   - Enhance progress cards
   - Update stat cards
   - Improve quick actions
   - Add micro-interactions

3. **Animation Integration**
   - Add entrance animations
   - Implement stagger effects
   - Add hover interactions
   - Test performance

#### Deliverables
- Redesigned dashboard
- Enhanced components
- Smooth animations
- Performance optimizations

### Phase 3: Module Pages (Week 3)

#### Tasks
1. **Module Cards**
   - Add featured module variant
   - Enhance hover states
   - Add progress visualization
   - Implement status indicators

2. **Layout Improvements**
   - Update grid system
   - Add spacing refinements
   - Improve visual hierarchy
   - Add transitions

3. **Module View Page**
   - Enhance content layout
   - Add smooth scrolling
   - Improve section transitions
   - Add progress indicators

#### Deliverables
- Enhanced module cards
- Improved module pages
- Better navigation flow
- Visual progress indicators

### Phase 4: Polish & Optimization (Week 4)

#### Tasks
1. **Component Library**
   - Update all components
   - Add new variants
   - Improve consistency
   - Document usage

2. **Performance**
   - Optimize animations
   - Reduce re-renders
   - Lazy load components
   - Test on various devices

3. **Accessibility**
   - Test with screen readers
   - Verify keyboard navigation
   - Check color contrast
   - Test reduced motion

4. **Testing**
   - User testing sessions
   - Gather feedback
   - Iterate on issues
   - Final refinements

#### Deliverables
- Complete component library
- Performance optimizations
- Accessibility improvements
- User testing results

---

## References & Inspiration

### Design Systems
- **Material Design 3**: https://m3.material.io/
- **Apple Human Interface Guidelines**: https://developer.apple.com/design/
- **Fluent Design System**: https://www.microsoft.com/design/fluent/

### Component Libraries
- **shadcn/ui**: https://ui.shadcn.com/
- **Headless UI**: https://headlessui.com/
- **Radix UI**: https://www.radix-ui.com/

### Design Inspiration
- **Dribbble**: https://dribbble.com/search/modern-ui-designs
- **Behance**: https://www.behance.net/
- **Awwwards**: https://www.awwwards.com/

### Educational Platforms
- **E-Learning Figma Dashboard**: https://designshack.net/resource/e-learning-figma-dashboard-ui-template/
- **EduAll LMS Template**: https://templatelelo.com/item/eduall-lms-tutors-education-online-course-ui-figma-template/

### Finance Platforms
- **Finance Dashboard Templates**: Various fintech UI designs
- **Modern Fintech App UI**: https://figma-templates.com/templates/modern-fintech-app-ui-ux-design-showcase-in-figma

### Articles & Guides
- **UI Design Best Practices**: https://www.toptal.com/designers/web/ui-design-best-practices
- **Modern Web Design Trends**: https://www.smashingmagazine.com/
- **Animation Best Practices**: https://web.dev/animations/

---

## Success Metrics

### User Experience
- **Engagement**: Increase time on dashboard by 20%
- **Completion**: Improve module completion rate by 15%
- **Satisfaction**: User satisfaction score > 4.5/5

### Performance
- **Load Time**: Maintain < 2s initial load
- **Animation**: 60fps on all animations
- **Accessibility**: WCAG 2.1 AA compliance

### Technical
- **Code Quality**: Maintain TypeScript strict mode
- **Bundle Size**: Keep increase < 10%
- **Browser Support**: Support last 2 versions of major browsers

---

## Appendix

### A. Component Checklist

#### Core Components
- [ ] Card (enhanced)
- [ ] Button (enhanced)
- [ ] Badge (enhanced)
- [ ] ProgressBar (enhanced)
- [ ] Input (enhanced)
- [ ] Modal (new)
- [ ] Tooltip (new)
- [ ] Dropdown (new)

#### Layout Components
- [ ] Container (enhanced)
- [ ] Grid (enhanced)
- [ ] Stack (new)
- [ ] Divider (enhanced)

#### Animation Utilities
- [ ] useStagger hook
- [ ] Animation presets
- [ ] Transition utilities
- [ ] Scroll reveal hook

### B. Tailwind Config Updates

```javascript
// Additional spacing
spacing: {
  '18': '4.5rem',
  '88': '22rem',
  '128': '32rem',
},

// Additional border radius
borderRadius: {
  'xl': '1.5rem',
  '2xl': '2rem',
  '3xl': '3rem',
},

// Additional shadows
boxShadow: {
  'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  'glow': '0 0 20px rgba(90, 146, 90, 0.3)',
},

// Additional animations
animation: {
  'stagger': 'stagger 0.5s ease-out',
  'glow': 'glow 2s ease-in-out infinite',
},
```

### C. Framer Motion Presets

```typescript
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
};
```

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024 | Dev Team | Initial specification document |

---

**End of Specification Document**

