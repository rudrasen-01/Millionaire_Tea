# Millionaire Tea - Premium Rewards Platform

A modern, professional-grade rewards platform built with React, featuring stunning UI/UX, smooth animations, and comprehensive functionality for managing tea consumption rewards.

## 🎨 Design System

### Color Palette
- **Vendor Colors**: Warm orange gradients (#FFB347, #FF9933, #F57C00)
- **Tea Colors**: Rich amber tones (#FFB730, #FF9800, #EF6C00)
- **Premium Colors**: Sophisticated browns (#BC8960, #8B5E34, #73502C)
- **Luxury Colors**: Gold accents for premium features
- **Accent Colors**: Complementary coral and peach tones

### Typography
- **Primary**: Inter - Modern, clean sans-serif for body text
- **Display**: Playfair Display - Elegant serif for headings
- **Monospace**: JetBrains Mono - Code and technical content

### Animations
- **Fade In Up**: Smooth entrance animations
- **Slide In**: Left/right slide transitions
- **Scale In**: Pop-in effects for modals
- **Bounce Subtle**: Attention-grabbing micro-interactions
- **Float**: Continuous hover effects
- **Glow Pulse**: Premium highlighting
- **Shimmer**: Loading state animations
- **Gradient Shift**: Dynamic background effects

## ✨ Key Features

### 🎯 Enhanced Pages

#### Landing Page
- Hero section with animated gradient backgrounds
- Interactive stats cards with real-time data
- Modern badge components with glassmorphism
- Features showcase with hover effects
- Step-by-step process explanation
- Testimonials with social proof
- Compelling call-to-action sections

#### Dashboard
- Metric cards with gradient icon containers
- Animated progress tracking
- Interactive action cards with hover effects
- Real-time points and rank updates
- Quick access to key features

#### Wallet
- Premium card styling with gradient overlays
- Modern withdrawal modal with animations
- Enhanced withdrawal requests list
- Status badges with color coding
- Smooth transitions and micro-interactions

#### Rankings
- Premium leaderboard design
- Top 3 winners showcase
- Search and filter functionality
- User movement indicators
- Current user highlighting
- Recent awards display

#### Reviews
- Star rating with motion hover effects
- Modern form styling
- Status badges (approved/pending)
- Enhanced empty states
- Smooth submission animations

### 🎪 Modern Components

#### Toast Notifications
- Multiple types: success, error, warning, info
- Auto-dismiss with progress bar
- Smooth enter/exit animations
- Glassmorphic design
- Positioned at top-right

#### Loading States
- Page loader with rotating coffee icon
- Inline loaders for buttons
- Progress bars (linear and circular)
- Skeleton loaders for content
- Spinner dots for quick actions

#### Empty States
- Icon-based visual feedback
- Clear messaging
- Call-to-action buttons
- Smooth entrance animations

#### Page Transitions
- Fade transitions between pages
- Slide transitions with direction
- Scale transitions for modals
- Stagger animations for lists

#### Scroll to Top
- Auto-show on scroll
- Smooth scroll behavior
- Floating action button
- Premium gradient styling

### 🎨 UI Components

#### Glass Cards
- Standard glass card with backdrop blur
- Premium variant with enhanced effects
- Hover lift animations
- Gradient overlays

#### Buttons
- Primary buttons with gradient backgrounds
- Secondary buttons with outline style
- Hover effects and transitions
- Loading states
- Disabled states with tooltips

#### Form Inputs
- Modern input fields with focus states
- Textarea with auto-resize
- Validation styling
- Error messages
- Placeholder animations

#### Badges
- Status badges (success, warning, error, info)
- Rank badges with icons
- Premium badges with gradients
- Animated badges

## 🚀 Technical Stack

### Core Technologies
- **React 19.2.0**: Latest React features
- **Vite 7.3.1**: Lightning-fast build tool
- **Tailwind CSS 3.4.19**: Utility-first styling
- **Framer Motion 12.34.0**: Advanced animations

### Additional Libraries
- **React Router DOM 6.14.1**: Client-side routing
- **Lucide React 0.563.0**: Beautiful icon library
- **Socket.io Client 4.7.1**: Real-time updates
- **Recharts 3.7.0**: Data visualization

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── animations/
│   │   │   └── PageTransition.jsx
│   │   ├── buttons/
│   │   │   ├── PrimaryButton.jsx
│   │   │   ├── ThemeToggle.jsx
│   │   │   └── ScrollToTop.jsx
│   │   ├── cards/
│   │   │   ├── MetricCard.jsx
│   │   │   ├── HeroCard.jsx
│   │   │   └── EmptyState.jsx
│   │   ├── charts/
│   │   │   └── ProgressChart.jsx
│   │   ├── hero/
│   │   │   ├── Hero.jsx
│   │   │   └── HeroCard.jsx
│   │   ├── loaders/
│   │   │   ├── SkeletonLoader.jsx
│   │   │   └── ProgressIndicator.jsx
│   │   ├── notifications/
│   │   │   └── Toast.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   ├── AppContext.jsx
│   │   └── ThemeContext.jsx
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Wallet.jsx
│   │   ├── Ranking.jsx
│   │   ├── Reviews.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Admin.jsx
│   │   └── User.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── tailwind.config.js
├── vite.config.js
└── package.json
```

## 🎯 Design Patterns

### Glass Morphism
Used throughout for modern, depth-filled UI:
- Card backgrounds with backdrop blur
- Semi-transparent overlays
- Subtle borders and shadows

### Gradient Overlays
Strategic use of gradients:
- Button backgrounds
- Section dividers
- Status indicators
- Premium features

### Micro-interactions
Smooth animations on:
- Button hovers
- Card interactions
- Form inputs
- Status changes

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Flexible layouts with grid/flexbox
- Adaptive typography

## 🔧 Configuration

### Tailwind Config
Custom theme extensions in `tailwind.config.js`:
- Extended color palettes
- Custom font families
- Animation keyframes
- Shadow utilities
- Dark mode support (class-based)

### Vite Config
Optimized build settings:
- React plugin with Fast Refresh
- Path aliases for imports
- Asset optimization
- Code splitting

## 🌟 Best Practices

### Performance
- Lazy loading for routes
- Code splitting
- Optimized images
- Memoized components

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Color contrast compliance

### Code Quality
- ESLint configuration
- Consistent naming conventions
- Component composition
- Props validation

## 📱 Features Overview

### User Features
- ✅ Points tracking and management
- ✅ Withdrawal requests
- ✅ Leaderboard rankings
- ✅ Review submission
- ✅ Real-time updates
- ✅ Profile management

### Admin Features
- ✅ User management
- ✅ Award distribution
- ✅ Withdrawal processing
- ✅ Review moderation
- ✅ Analytics dashboard
- ✅ Configuration settings

## 🎨 UI/UX Enhancements

### Visual Improvements
- Modern color schemes
- Gradient backgrounds
- Glass morphism effects
- Smooth animations
- Consistent spacing
- Premium typography

### Interaction Improvements
- Hover effects
- Loading states
- Empty states
- Error handling
- Success feedback
- Toast notifications

### Layout Improvements
- Responsive grid systems
- Card-based layouts
- Sticky navigation
- Mobile menu
- Breadcrumbs
- Search and filters

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Millionaire_Tea/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- Framer Motion for smooth animations
- Lucide for beautiful icons
- Vite for blazing-fast builds

---

**Made with ❤️ for tea enthusiasts**
