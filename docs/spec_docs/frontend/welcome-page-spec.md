# Welcome Landing Page Specification

## Overview

**Purpose**: Create a calming, welcoming landing page that appears immediately after login, making users feel connected, calm, and heard. This page sets the emotional tone for the entire platform experience.

**Priority**: High - Phase 0 (Implement before other enhancements)

## Design Vision

### Emotional Goals
- **Connection**: Make users feel the platform cares about them personally
- **Calm**: Create a peaceful, stress-free entry point
- **Heard**: Give users a voice and acknowledge their feelings
- **Welcome**: Make users feel invited and valued

### Visual Aesthetic
- **Ocean Theme**: Calming, deep blues and teals
- **Minimalist**: Clean, uncluttered interface
- **Warm**: Friendly, approachable typography and messaging
- **Gentle**: Soft animations, no harsh movements

## Component Structure

### Page Layout

```
┌─────────────────────────────────────────┐
│                                         │
│         [Animated Ocean Background]     │
│                                         │
│              ┌─────────────┐           │
│              │             │           │
│              │             │           │
│              │ How are you │           │
│              │   doing?    │           │
│              └─────────────┘           │
│                                         │
│         ┌───────────────────────┐      │
│         │ Type your response... │  →   │
│         └───────────────────────┘      │
│                                         │
│              [Skip] (optional)          │
│                                         │
└─────────────────────────────────────────┘
```

## Technical Specifications

### Ocean Background

#### Option 1: CSS Gradient Animation (Recommended)
```css
background: linear-gradient(
  135deg,
  #0a4d68 0%,
  #088395 25%,
  #05bfdb 50%,
  #00d9ff 75%,
  #00b8d4 100%
);
animation: oceanFlow 15s ease-in-out infinite;
```

#### Option 2: Animated SVG Waves
- Multiple wave layers
- Slow, gentle movement
- Subtle parallax effect
- Performance optimized

#### Option 3: Video Background (If needed)
- Subtle, looping ocean video
- Muted, low opacity
- Optimized for web (WebM, MP4)
- Autoplay, loop, muted

### Color Palette

#### Primary Colors
- **Deep Ocean**: `#0a4d68` (RGB: 10, 77, 104)
- **Ocean Blue**: `#088395` (RGB: 8, 131, 149)
- **Cyan**: `#05bfdb` (RGB: 5, 191, 219)
- **Light Cyan**: `#00d9ff` (RGB: 0, 217, 255)
- **Teal**: `#00b8d4` (RGB: 0, 184, 212)

#### Text Colors
- **Primary Text**: `#ffffff` (White)
- **Secondary Text**: `rgba(255, 255, 255, 0.9)`
- **Placeholder**: `rgba(255, 255, 255, 0.6)`

### Typography

#### Prompt Text
- **Font**: Inter (or system font stack)
- **Size**: `text-4xl` (2.25rem) on desktop, `text-3xl` on mobile
- **Weight**: `font-medium` (500)
- **Color**: White (`#ffffff`)
- **Line Height**: `leading-relaxed` (1.75)
- **Letter Spacing**: Normal

#### Input Text
- **Font**: Inter
- **Size**: `text-lg` (1.125rem)
- **Weight**: `font-normal` (400)
- **Color**: White
- **Placeholder**: `rgba(255, 255, 255, 0.6)`

### Chat Interface Design

#### Prompt Bubble
- **Background**: `rgba(255, 255, 255, 0.15)` with `backdrop-blur-md`
- **Border**: `1px solid rgba(255, 255, 255, 0.2)`
- **Border Radius**: `rounded-2xl` (2rem)
- **Padding**: `p-6` (1.5rem)
- **Max Width**: `max-w-md` (28rem)
- **Shadow**: `shadow-gentle`
- **Animation**: Fade in + slide up (delay 0.5s, duration 0.6s)

#### Input Box
- **Background**: `rgba(255, 255, 255, 0.2)` with `backdrop-blur-lg`
- **Border**: `2px solid rgba(255, 255, 255, 0.3)`
- **Border Radius**: `rounded-2xl` (2rem)
- **Padding**: `px-6 py-4` (1.5rem horizontal, 1rem vertical)
- **Width**: `w-full max-w-md` (matches prompt width)
- **Focus State**:
  - Border: `rgba(255, 255, 255, 0.5)`
  - Background: `rgba(255, 255, 255, 0.25)`
  - Scale: `scale-[1.02]`
  - Glow: `shadow-lg` with white tint
- **Animation**: Fade in + slide up (delay 0.8s, duration 0.6s)

#### Send Button
- **Background**: `rgba(255, 255, 255, 0.25)` with `backdrop-blur-md`
- **Border**: `1px solid rgba(255, 255, 255, 0.3)`
- **Border Radius**: `rounded-full`
- **Size**: `w-12 h-12` (3rem)
- **Icon**: Arrow right or send icon
- **Hover**: Background increase, scale (1.05)
- **Active**: Scale (0.95)

### Animations

#### Page Entrance Sequence
1. **Background** (0ms):
   - Fade in from opacity 0 to 1
   - Duration: 1s
   - Easing: `ease-out`

2. **Prompt Bubble** (500ms delay):
   - Fade in: opacity 0 → 1
   - Slide up: translateY(20px) → 0
   - Duration: 0.6s
   - Easing: `cubic-bezier(0.4, 0, 0.2, 1)`

3. **Input Box** (800ms delay):
   - Fade in: opacity 0 → 1
   - Slide up: translateY(20px) → 0
   - Duration: 0.6s
   - Easing: `cubic-bezier(0.4, 0, 0.2, 1)`

#### Ocean Background Animation
- **Type**: Gradient position shift or wave movement
- **Duration**: 15s (slow, calming)
- **Easing**: `ease-in-out`
- **Loop**: Infinite
- **Direction**: Alternating

#### Input Interactions
- **Focus**:
  - Scale: 1.0 → 1.02
  - Border opacity: 0.3 → 0.5
  - Background opacity: 0.2 → 0.25
  - Duration: 0.2s
- **Typing**: Smooth, no lag
- **Submit**:
  - Button press animation
  - Loading state (optional spinner)
  - Success feedback

#### Page Exit
- **Fade Out**: opacity 1 → 0
- **Duration**: 0.5s
- **Easing**: `ease-in`
- **Transition**: Smooth to dashboard

## User Flow

### First-Time Login Flow
1. User logs in successfully
2. Redirected to `/welcome` page
3. Ocean background fades in
4. Prompt appears: "How are you doing?"
5. Input box appears below
6. User types response
7. User clicks send or presses Enter
8. Response is saved (localStorage or API)
9. Page fades out
10. Redirected to `/dashboard`
11. `has_seen_welcome` flag set to `true`

### Returning User Flow
1. User logs in
2. Check `has_seen_welcome` flag
3. If `true`: Redirect directly to `/dashboard`
4. If `false`: Show welcome page

### Skip Flow (Optional)
1. User sees welcome page
2. User clicks "Skip" link/button
3. `has_seen_welcome` flag set to `true`
4. Redirected to `/dashboard`

## State Management

### Local Storage
```typescript
// After welcome completion
localStorage.setItem('has_seen_welcome', 'true');
localStorage.setItem('welcome_response', userResponse); // Optional
```

### Zustand Store (Optional)
```typescript
interface WelcomeState {
  hasSeenWelcome: boolean;
  welcomeResponse: string | null;
  setHasSeenWelcome: (value: boolean) => void;
  setWelcomeResponse: (response: string) => void;
}
```

## API Integration (Optional)

### Endpoint: `POST /api/welcome/response`

**Request Body:**
```json
{
  "response": "I'm feeling a bit stressed about my finances, but I'm ready to learn."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Thank you for sharing. Let's begin your journey."
}
```

**Error Handling:**
- Network errors: Fall back to localStorage
- Validation errors: Show friendly message
- Server errors: Still proceed to dashboard

## Accessibility

### Screen Reader Support
- **Page Title**: "Welcome - How are you doing?"
- **Prompt**: Announced as heading level 1
- **Input**: Labeled "Your response"
- **Submit Button**: Labeled "Send response"
- **Skip Link**: Labeled "Skip welcome"

### Keyboard Navigation
- **Tab**: Focus input field
- **Enter**: Submit response
- **Escape**: Skip welcome (if skip option exists)
- **Focus Indicators**: Visible, high contrast

### Color Contrast
- **Text on Ocean Background**: White (#ffffff) on darkest blue (#0a4d68)
- **Contrast Ratio**: 12.6:1 (exceeds WCAG AAA)
- **Input Border**: Visible against background
- **Focus Indicators**: High contrast

### Reduced Motion
- **Background Animation**: Disabled or simplified
- **Page Transitions**: Instant or simplified
- **Micro-interactions**: Disabled or minimal
- **Respect**: `prefers-reduced-motion` media query

## Responsive Design

### Mobile (< 640px)
- **Prompt Size**: `text-3xl` (1.875rem)
- **Input Width**: Full width minus padding
- **Padding**: `p-4` (1rem)
- **Background**: Simplified animation for performance

### Tablet (640px - 1024px)
- **Prompt Size**: `text-4xl` (2.25rem)
- **Input Width**: `max-w-md` (28rem)
- **Padding**: `p-6` (1.5rem)
- **Background**: Full animation

### Desktop (> 1024px)
- **Prompt Size**: `text-4xl` or `text-5xl` (2.25rem or 3rem)
- **Input Width**: `max-w-md` (28rem)
- **Padding**: `p-8` (2rem)
- **Background**: Full animation with parallax (optional)

## Performance Considerations

### Optimization
- **Background**: Use CSS animations (GPU accelerated)
- **Images/Videos**: Optimize file sizes
- **Animations**: Use `will-change` appropriately
- **Lazy Load**: Load heavy assets after initial render
- **Target**: 60fps on all animations

### Bundle Size
- **Keep Welcome Page**: < 50KB additional bundle
- **Optimize Assets**: Compress images/videos
- **Code Splitting**: Lazy load welcome page component

## Personalization Options

### Dynamic Prompt
- **With Name**: "How are you doing, [Name]?"
- **Time-Based**: "Good morning! How are you doing?"
- **Contextual**: Based on user's last visit or progress

### Response-Based Actions
- **Sentiment Analysis**: Analyze response sentiment
- **Mood Pre-population**: Use response to pre-fill mood tracker
- **Personalized Dashboard**: Customize dashboard based on response
- **Follow-up**: Reference response in future interactions

## Future Enhancements

### Phase 2 Ideas
- **Multiple Prompts**: Rotate different welcoming prompts
- **Conversation Flow**: Multi-step conversation
- **Visual Feedback**: Show response being "heard" with animation
- **Personalized Messages**: AI-generated responses (future)

### Integration Ideas
- **Mood Integration**: Link to mood tracking
- **Journal Integration**: Use as journal entry starter
- **Dashboard Personalization**: Show response insights
- **Progress Tracking**: Reference response in progress updates

---

## Design Mockup Description

### Visual Layout
- **Full Screen**: Welcome page takes full viewport
- **Centered Content**: Prompt and input centered vertically and horizontally
- **Ocean Background**: Animated gradient or waves covering entire background
- **Glassmorphism**: Semi-transparent elements with backdrop blur
- **Minimal UI**: Only essential elements visible
- **No Navigation**: No sidebar, header, or other UI elements

### Emotional Tone
- **Calming**: Slow, gentle animations
- **Welcoming**: Warm, friendly text
- **Personal**: Uses user's name if available
- **Non-intrusive**: Optional skip, no pressure
- **Supportive**: Acknowledges user's response

---

**Status**: Ready for Implementation
**Priority**: High (Phase 0)
**Estimated Time**: 2 days

