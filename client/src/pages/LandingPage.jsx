import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Coffee,
  Star,
  CheckCircle,
  Menu,
  X,
  Heart,
  Award,
  Clock,
  Trophy,
  Users,
  TrendingUp,
  Zap,
  Shield,
  Crown,
  UserPlus,
  ShoppingCart,
  Activity,
  Target,
  Shuffle,
  ArrowRight
} from 'lucide-react';

export function LandingPage({ onGetStarted }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [approvedReviews, setApprovedReviews] = useState([]);
  const [reviewsSummary, setReviewsSummary] = useState({ average: 0, count: 0 });
  const [currentSlide, setCurrentSlide] = useState(0);
  const observerRef = useRef(null);

  const openAuthModal = (mode) => {
    navigate(mode === 'login' ? '/login' : '/register');
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/reviews/approved?limit=6');
        if (!res.ok) return;
        const b = await res.json();
        if (!mounted) return;
        setApprovedReviews(b.reviews || []);
        setReviewsSummary(b.summary || { average: 0, count: 0 });
      } catch (e) {
        console.error('Failed to fetch approved reviews', e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
      observerRef.current.observe(el);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Testimonial Carousel
  const testimonials = approvedReviews.length > 0 ? approvedReviews : [
    {
      name: 'Priya Sharma',
      location: 'Mumbai',
      content: 'This chai reminds me of my grandmother\'s recipe. Absolutely authentic and soul-warming!',
      rating: 5,
      initials: 'PS'
    },
    {
      name: 'Rahul Kumar',
      location: 'Delhi',
      content: 'The masala chai is simply outstanding. Perfect blend of spices that hits all the right notes.',
      rating: 5,
      initials: 'RK'
    },
    {
      name: 'Anita Gupta',
      location: 'Bangalore',
      content: 'Every morning starts with ChaiTime now. Can\'t imagine my day without it!',
      rating: 5,
      initials: 'AG'
    },
    {
      name: 'Vikram Nair',
      location: 'Chennai',
      content: 'The kadak chai is exactly how I like it — strong, aromatic, and full of character!',
      rating: 5,
      initials: 'VN'
    }
  ];

  const totalSlides = testimonials.length;

  const getVisibleSlides = () => {
    if (typeof window === 'undefined') return 3;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  };

  const visibleSlides = getVisibleSlides();
  const maxSlide = Math.max(0, totalSlides - visibleSlides);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev >= maxSlide ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev > 0 ? prev - 1 : maxSlide));
  };

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [maxSlide]);

  return (
    <div className="h-full font-quicksand bg-warmWhite text-darkBrown overflow-auto">
      
      {/* Sticky Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 navbar-glass shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <a href="#hero" className="flex items-center space-x-2">
              <span className="font-baloo text-xl sm:text-2xl font-bold text-caramel">#CHAITIME</span>
            </a>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#how-it-works" className="text-darkBrown hover:text-caramel transition-colors font-medium text-sm">How It Works</a>
              <a href="#features" className="text-darkBrown hover:text-caramel transition-colors font-medium text-sm">Features</a>
              <a href="#testimonials" className="text-darkBrown hover:text-caramel transition-colors font-medium text-sm">Testimonials</a>
              <button 
                onClick={() => openAuthModal('login')} 
                className="text-darkBrown hover:text-caramel transition-colors font-semibold text-sm"
              >
                Login
              </button>
              <button 
                onClick={() => openAuthModal('register')} 
                className="bg-gradient-to-r from-caramel to-darkBrown text-cream px-5 py-2 rounded-full font-semibold text-sm hover:shadow-lg transition-all transform hover:scale-105"
              >
                Register
              </button>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-beige/30 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6 text-darkBrown" /> : <Menu className="w-6 h-6 text-darkBrown" />}
            </button>
          </div>
          
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pb-4">
              <div className="flex flex-col space-y-3">
                <a href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="py-2 px-4 rounded-lg hover:bg-beige/30 transition-colors font-medium">How It Works</a>
                <a href="#features" onClick={() => setIsMenuOpen(false)} className="py-2 px-4 rounded-lg hover:bg-beige/30 transition-colors font-medium">Features</a>
                <a href="#testimonials" onClick={() => setIsMenuOpen(false)} className="py-2 px-4 rounded-lg hover:bg-beige/30 transition-colors font-medium">Testimonials</a>
                <button 
                  onClick={() => { setIsMenuOpen(false); openAuthModal('login'); }} 
                  className="py-2 px-4 rounded-lg hover:bg-beige/30 transition-colors font-medium text-left"
                >
                  Login
                </button>
                <button 
                  onClick={() => { setIsMenuOpen(false); openAuthModal('register'); }} 
                  className="bg-gradient-to-r from-caramel to-darkBrown text-cream px-6 py-3 rounded-full font-semibold text-center shadow-lg"
                >
                  Register
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen bg-gradient-to-br from-cream via-warmWhite to-cream overflow-hidden pt-20">
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 twinkle-animation opacity-40">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#B87333">
            <path d="M12 2L14.09 8.26L21 9.27L16 14.14L17.18 21.02L12 17.77L6.82 21.02L8 14.14L3 9.27L9.91 8.26L12 2Z"/>
          </svg>
        </div>
        <div className="absolute top-40 right-20 twinkle-animation opacity-30" style={{animationDelay: '0.5s'}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#B87333">
            <path d="M12 2L14.09 8.26L21 9.27L16 14.14L17.18 21.02L12 17.77L6.82 21.02L8 14.14L3 9.27L9.91 8.26L12 2Z"/>
          </svg>
        </div>
        <div className="absolute bottom-40 left-20 twinkle-animation opacity-20" style={{animationDelay: '1s'}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#4A2C2A">
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </div>
        <div className="absolute top-60 right-10 bounce-animation opacity-30">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#B87333" strokeWidth="2">
            <path d="M12 3C16.97 3 21 6.58 21 11C21 15.42 16.97 19 12 19C11.17 19 10.37 18.9 9.61 18.72L5 21V16.72C3.18 15.27 2 13.26 2 11C2 6.58 6.03 3 11 3"/>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            
            {/* Hero Text */}
            <div className="flex-1 text-center lg:text-left fade-in-up">
              <p className="text-xs sm:text-sm font-bold text-caramel mb-2 uppercase tracking-wider">Premium Rank-Based Rewards</p>
              <h1 className="font-baloo text-3xl sm:text-4xl lg:text-5xl font-bold text-darkBrown mb-3 leading-tight">
                Turn Every Tea Into <span className="text-caramel">Rewards</span>
              </h1>
              <p className="text-sm sm:text-base text-darkBrown/70 mb-6 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Earn points with every purchase, track your rank in real-time, and win guaranteed milestone rewards. Transparent, automated, and fair!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <button 
                  onClick={() => openAuthModal('register')}
                  className="bg-gradient-to-r from-caramel to-darkBrown text-cream px-6 py-3 rounded-full font-bold text-base shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
                >
                  ☕ Start Earning Now
                </button>
                <a href="#how-it-works" className="border-2 border-caramel/70 text-darkBrown px-6 py-3 rounded-full font-semibold text-base hover:bg-caramel hover:text-cream transition-all text-center">
                  How It Works
                </a>
              </div>
            </div>
            
            {/* Chai Cup Illustration */}
            <div className="flex-1 relative flex justify-center items-center">
              {/* Speech Bubble */}
              <div className="absolute -top-4 sm:top-0 left-1/2 transform -translate-x-1/2 lg:left-auto lg:right-0 lg:translate-x-0 wobble-animation z-10">
                <div className="bg-gradient-to-br from-beige to-cream border-2 border-caramel rounded-3xl px-6 py-4 shadow-xl relative">
                  <p className="font-baloo text-xl sm:text-2xl text-darkBrown font-bold whitespace-nowrap">Ek aur milega? ☕</p>
                  {/* Speech bubble tail */}
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                    <svg width="24" height="16" viewBox="0 0 24 16" fill="#D8B08C">
                      <path d="M12 16L0 0H24L12 16Z"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Chai Cup SVG */}
              <div className="float-animation mt-16 sm:mt-20">
                <svg viewBox="0 0 300 350" className="w-64 h-72 sm:w-80 sm:h-96" fill="none">
                  {/* Steam lines */}
                  <g className="steam-container">
                    <path className="steam-line" d="M120 80 Q130 60 120 40" stroke="#B87333" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6"/>
                    <path className="steam-line" d="M150 75 Q160 50 150 30" stroke="#B87333" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6"/>
                    <path className="steam-line" d="M180 80 Q170 55 180 35" stroke="#B87333" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6"/>
                  </g>
                  
                  {/* Cup body */}
                  <ellipse cx="150" cy="100" rx="80" ry="15" fill="#D8B08C"/>
                  <path d="M70 100 L85 280 Q150 300 215 280 L230 100" fill="#F5E6D3" stroke="#B87333" strokeWidth="4"/>
                  
                  {/* Chai liquid */}
                  <ellipse cx="150" cy="105" rx="70" ry="12" fill="#B87333"/>
                  <ellipse cx="150" cy="105" rx="50" ry="8" fill="#8B5A2B" opacity="0.5"/>
                  
                  {/* Cup decoration - doodle pattern */}
                  <path d="M90 140 Q100 150 110 140 Q120 130 130 140 Q140 150 150 140 Q160 130 170 140 Q180 150 190 140 Q200 130 210 140" stroke="#B87333" strokeWidth="2" fill="none" strokeDasharray="5,5"/>
                  <path d="M95 180 Q105 190 115 180 Q125 170 135 180 Q145 190 155 180 Q165 170 175 180 Q185 190 195 180 Q205 170 205 180" stroke="#D8B08C" strokeWidth="2" fill="none"/>
                  
                  {/* Heart decoration */}
                  <path d="M145 220 C140 215 130 215 130 225 C130 235 145 245 150 250 C155 245 170 235 170 225 C170 215 160 215 155 220 L150 225 L145 220" fill="#B87333"/>
                  
                  {/* Handle */}
                  <path d="M230 130 Q280 150 280 200 Q280 250 230 260" stroke="#B87333" strokeWidth="8" fill="none" strokeLinecap="round"/>
                  
                  {/* Saucer */}
                  <ellipse cx="150" cy="290" rx="100" ry="20" fill="#D8B08C"/>
                  <ellipse cx="150" cy="290" rx="80" ry="15" fill="#F5E6D3"/>
                  <ellipse cx="150" cy="288" rx="60" ry="10" fill="#D8B08C" opacity="0.3"/>
                  
                  {/* Small decorative stars on cup */}
                  <path d="M100 200 L102 205 L107 205 L103 208 L105 213 L100 210 L95 213 L97 208 L93 205 L98 205 Z" fill="#B87333"/>
                  <path d="M200 160 L202 165 L207 165 L203 168 L205 173 L200 170 L195 173 L197 168 L193 165 L198 165 Z" fill="#D8B08C"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave divider */}
        <div className="wave-divider">
          <svg viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none" className="w-full h-16 sm:h-24">
            <path d="M0 120L48 105C96 90 192 60 288 45C384 30 480 30 576 37.5C672 45 768 60 864 67.5C960 75 1056 75 1152 67.5C1248 60 1344 45 1392 37.5L1440 30V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" fill="#FDF8F3"/>
          </svg>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-12 sm:py-16 bg-gradient-to-b from-cream to-warmWhite relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="font-baloo text-3xl sm:text-4xl font-bold text-darkBrown mb-2">How It Works</h2>
            <p className="text-darkBrown/70 text-base max-w-2xl mx-auto">A clear, fair flow that rewards purchases and rotates winners predictably</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'Register & Get Ranked',
                desc: 'Create an account and receive a registration-based rank. Earlier sign-ups get higher priority in the reward queue.',
                icon: UserPlus
              },
              {
                title: 'Buy Tea & Earn Points',
                desc: 'Each tea purchased grants points (1 tea = 10 points). Points accumulate automatically in your dashboard.',
                icon: ShoppingCart
              },
              {
                title: 'Track Progress',
                desc: 'View rank, points, total teas purchased and reward eligibility—all updated in real time.',
                icon: Activity
              },
              {
                title: 'Hit The Milestone',
                desc: 'When platform-wide sales hit the milestone (e.g. 5000 teas), the system evaluates Rank #1 for payout eligibility.',
                icon: Target
              },
              {
                title: 'Guaranteed Payout',
                desc: 'If Rank #1 meets the points threshold at milestone time, they receive the guaranteed reward automatically.',
                icon: Award
              },
              {
                title: 'Rank Rotation',
                desc: 'After payout, the winner moves to the last rank and everyone else advances—ensuring fair, repeatable cycles.',
                icon: Shuffle
              }
            ].map((step, idx) => (
              <div 
                key={idx} 
                className="group bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:border-caramel"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md bg-gradient-to-br from-caramel to-darkBrown mb-4 group-hover:scale-110 transition-transform">
                  {React.createElement(step.icon, { className: 'w-6 h-6 text-cream' })}
                </div>
                <h3 className="font-baloo text-lg font-bold text-darkBrown mb-2">{step.title}</h3>
                <p className="text-sm text-darkBrown/70">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 bg-gradient-to-b from-warmWhite to-cream relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="font-baloo text-3xl sm:text-4xl lg:text-5xl font-bold text-darkBrown mb-2">Why Choose Our Rewards Platform?</h2>
            <p className="text-darkBrown/70 text-lg max-w-2xl mx-auto">Transparent, automated, and fair reward system for every tea lover</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Feature Card 1 - Transparent Rank-Based Rewards */}
            <div className="feature-card bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 rounded-3xl p-6 sm:p-8 text-center shadow-xl hover:shadow-2xl transition-all hover:border-caramel">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-caramel to-darkBrown rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 pulse-animation shadow-md">
                <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-cream" />
              </div>
              <h3 className="font-baloo text-xl sm:text-2xl font-bold text-darkBrown mb-2 sm:mb-3">Transparent Rank-Based Rewards</h3>
              <p className="text-darkBrown/70 text-sm sm:text-base">Your rank is automatically assigned based on registration order. Complete transparency with no manual manipulation.</p>
            </div>
            
            {/* Feature Card 2 - Earn Points with Every Tea */}
            <div className="feature-card bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 rounded-3xl p-6 sm:p-8 text-center shadow-xl hover:shadow-2xl transition-all hover:border-caramel">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-caramel to-darkBrown rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 pulse-animation shadow-md" style={{animationDelay: '0.2s'}}>
                <Coffee className="w-8 h-8 sm:w-10 sm:h-10 text-cream" />
              </div>
              <h3 className="font-baloo text-xl sm:text-2xl font-bold text-darkBrown mb-2 sm:mb-3">Earn Points with Every Tea</h3>
              <p className="text-darkBrown/70 text-sm sm:text-base">Every tea purchase adds reward points. The more you purchase, the more you earn!</p>
            </div>
            
            {/* Feature Card 3 - Performance-Driven Rewards */}
            <div className="feature-card bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 rounded-3xl p-6 sm:p-8 text-center shadow-xl hover:shadow-2xl transition-all hover:border-caramel">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-caramel to-darkBrown rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 pulse-animation shadow-md" style={{animationDelay: '0.4s'}}>
                <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-cream" />
              </div>
              <h3 className="font-baloo text-xl sm:text-2xl font-bold text-darkBrown mb-2 sm:mb-3">Performance-Driven Model</h3>
              <p className="text-darkBrown/70 text-sm sm:text-base">Top-ranked eligible user receives rewards when sales milestone is achieved. Structured and motivating!</p>
            </div>
            
            {/* Feature Card 4 - Dynamic & Automated System */}
            <div className="feature-card bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 rounded-3xl p-6 sm:p-8 text-center shadow-xl hover:shadow-2xl transition-all hover:border-caramel">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-caramel to-darkBrown rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 pulse-animation shadow-md" style={{animationDelay: '0.6s'}}>
                <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-cream" />
              </div>
              <h3 className="font-baloo text-xl sm:text-2xl font-bold text-darkBrown mb-2 sm:mb-3">Dynamic & Automated</h3>
              <p className="text-darkBrown/70 text-sm sm:text-base">Rank reshuffling to reward distribution—everything is fully automated!</p>
            </div>
            
            {/* Feature Card 5 - Secure & Reliable Platform */}
            <div className="feature-card bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 rounded-3xl p-6 sm:p-8 text-center shadow-xl hover:shadow-2xl transition-all hover:border-caramel">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-caramel to-darkBrown rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 pulse-animation shadow-md" style={{animationDelay: '0.8s'}}>
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-cream" />
              </div>
              <h3 className="font-baloo text-xl sm:text-2xl font-bold text-darkBrown mb-2 sm:mb-3">Secure & Reliable</h3>
              <p className="text-darkBrown/70 text-sm sm:text-base">Modern tech stack ensuring secure authentication, real-time updates, and safe reward management.</p>
            </div>
            
            {/* Feature Card 6 - Fair Opportunity */}
            <div className="feature-card bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 rounded-3xl p-6 sm:p-8 text-center shadow-xl hover:shadow-2xl transition-all hover:border-caramel">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-caramel to-darkBrown rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 pulse-animation shadow-md" style={{animationDelay: '1s'}}>
                <Award className="w-8 h-8 sm:w-10 sm:h-10 text-cream" />
              </div>
              <h3 className="font-baloo text-xl sm:text-2xl font-bold text-darkBrown mb-2 sm:mb-3">Fair Opportunity for Everyone</h3>
              <p className="text-darkBrown/70 text-sm sm:text-base">After receiving a reward, winner moves to last rank—giving everyone a fair chance!</p>
            </div>
            
            {/* Feature Card 7 - Real-Time Tracking */}
            <div className="feature-card bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 rounded-3xl p-6 sm:p-8 text-center shadow-xl hover:shadow-2xl transition-all hover:border-caramel">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-caramel to-darkBrown rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 pulse-animation shadow-md" style={{animationDelay: '1.2s'}}>
                <Users className="w-8 h-8 sm:w-10 sm:h-10 text-cream" />
              </div>
              <h3 className="font-baloo text-xl sm:text-2xl font-bold text-darkBrown mb-2 sm:mb-3">Real-Time Tracking</h3>
              <p className="text-darkBrown/70 text-sm sm:text-base">Track your rank, points, teas purchased, and eligibility. <strong className="text-darkBrown">Admin</strong> monitors sales in real-time.</p>
            </div>
            
            {/* Feature Card 8 - Milestone-Based Distribution */}
            <div className="feature-card bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 rounded-3xl p-6 sm:p-8 text-center shadow-xl hover:shadow-2xl transition-all hover:border-caramel">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-caramel to-darkBrown rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 pulse-animation shadow-md" style={{animationDelay: '1.4s'}}>
                <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-cream" />
              </div>
              <h3 className="font-baloo text-xl sm:text-2xl font-bold text-darkBrown mb-2 sm:mb-3">Milestone-Based Distribution</h3>
              <p className="text-darkBrown/70 text-sm sm:text-base">No lucky draws! Rewards automatically distributed to top-ranked user once milestone is achieved.</p>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 opacity-20 hidden lg:block">
          <svg width="100" height="100" viewBox="0 0 100 100" fill="#B87333">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#B87333" strokeWidth="2" strokeDasharray="10,5"/>
          </svg>
        </div>
      </section>

      {/* Wave Divider */}
      <div className="relative">
        <svg viewBox="0 0 1440 100" fill="none" preserveAspectRatio="none" className="w-full h-12 sm:h-20">
          <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 43.3C1200 47 1320 53 1380 56.7L1440 60V100H0V0Z" fill="#F5E6D3"/>
        </svg>
      </div>

      {/* About Section */}
      <section id="about" className="py-12 sm:py-16 bg-gradient-to-br from-warmWhite via-cream to-beige/30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            
            {/* About Image/Illustration */}
            <div className="flex-1">
              <div className="relative">
                {/* Decorative circle */}
                <div className="absolute -top-4 -left-4 w-full h-full bg-gradient-to-br from-caramel/40 to-darkBrown/20 rounded-3xl transform rotate-3"></div>
                
                {/* Main illustration container */}
                <div className="relative bg-gradient-to-br from-cream to-beige/50 rounded-3xl p-8 sm:p-12 shadow-2xl border-2 border-caramel/40">
                  <svg viewBox="0 0 400 300" className="w-full h-auto" fill="none">
                    {/* Background pattern */}
                    <rect width="400" height="300" fill="#FDF8F3" rx="20"/>
                    <circle cx="50" cy="50" r="30" fill="#D8B08C" opacity="0.3"/>
                    <circle cx="350" cy="250" r="40" fill="#B87333" opacity="0.2"/>
                    
                    {/* Tea leaves */}
                    <g transform="translate(280, 50)">
                      <ellipse cx="0" cy="0" rx="25" ry="10" fill="#4A2C2A" transform="rotate(-30)"/>
                      <ellipse cx="20" cy="15" rx="20" ry="8" fill="#B87333" transform="rotate(20)"/>
                      <ellipse cx="-10" cy="25" rx="18" ry="7" fill="#D8B08C" transform="rotate(-10)"/>
                    </g>
                    
                    {/* Spices */}
                    <g transform="translate(60, 200)">
                      {/* Cinnamon stick */}
                      <rect x="0" y="0" width="60" height="12" rx="6" fill="#8B4513" transform="rotate(-15)"/>
                      <rect x="10" y="20" width="50" height="10" rx="5" fill="#A0522D" transform="rotate(10)"/>
                      
                      {/* Star anise */}
                      <g transform="translate(80, 30)">
                        <path d="M0 -20 L5 -5 L20 -5 L8 5 L13 20 L0 10 L-13 20 L-8 5 L-20 -5 L-5 -5 Z" fill="#4A2C2A"/>
                        <circle cx="0" cy="0" r="5" fill="#B87333"/>
                      </g>
                    </g>
                    
                    {/* Central cup illustration */}
                    <g transform="translate(150, 80)">
                      <ellipse cx="50" cy="10" rx="45" ry="10" fill="#D8B08C"/>
                      <path d="M5 10 L15 120 Q50 135 85 120 L95 10" fill="#F5E6D3" stroke="#B87333" strokeWidth="3"/>
                      <ellipse cx="50" cy="15" rx="38" ry="8" fill="#B87333"/>
                      <path d="M95 30 Q130 50 130 80 Q130 110 95 115" stroke="#B87333" strokeWidth="5" fill="none" strokeLinecap="round"/>
                      
                      {/* Heart on cup */}
                      <path d="M45 70 C42 67 35 67 35 73 C35 79 45 85 50 88 C55 85 65 79 65 73 C65 67 58 67 55 70 L50 73 L45 70" fill="#B87333"/>
                    </g>
                    
                    {/* Decorative text */}
                    <text x="200" y="250" fontFamily="'Baloo 2', cursive" fontSize="24" fill="#4A2C2A" textAnchor="middle" fontWeight="bold">Est. 2024</text>
                  </svg>
                </div>
                
                {/* Floating badge */}
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-caramel to-darkBrown text-cream rounded-full px-4 py-2 sm:px-6 sm:py-3 font-baloo font-bold shadow-xl bounce-animation border-2 border-beige/50">
                  100% Natural
                </div>
              </div>
            </div>
            
            {/* About Text */}
            <div className="flex-1">
              <h2 className="font-baloo text-3xl sm:text-4xl lg:text-5xl font-bold text-darkBrown mb-3">Our Story</h2>
              <div className="w-20 h-1 bg-gradient-to-r from-caramel to-beige rounded-full mb-3"></div>
              <p className="text-darkBrown/80 text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed">
                ChaiTime was born from a simple belief — that a perfect cup of chai has the power to bring people together, spark conversations, and create memories that last a lifetime.
              </p>
              <p className="text-darkBrown/80 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
                Our journey started in a small kitchen, experimenting with traditional recipes and premium spices. Today, we're proud to serve thousands of chai lovers who share our passion for authentic, soulful chai.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6">
                <div className="text-center bg-gradient-to-br from-beige/40 to-transparent rounded-2xl p-3 sm:p-4">
                  <div className="font-baloo text-2xl sm:text-3xl lg:text-4xl font-bold text-caramel drop-shadow">50K+</div>
                  <div className="text-darkBrown font-semibold text-sm sm:text-base">Happy Customers</div>
                </div>
                <div className="text-center bg-gradient-to-br from-caramel/20 to-transparent rounded-2xl p-3 sm:p-4">
                  <div className="font-baloo text-2xl sm:text-3xl lg:text-4xl font-bold text-darkBrown drop-shadow">15+</div>
                  <div className="text-darkBrown font-semibold text-sm sm:text-base">Chai Varieties</div>
                </div>
                <div className="text-center bg-gradient-to-br from-beige/40 to-transparent rounded-2xl p-3 sm:p-4">
                  <div className="font-baloo text-2xl sm:text-3xl lg:text-4xl font-bold text-caramel drop-shadow">100%</div>
                  <div className="text-darkBrown font-semibold text-sm sm:text-base">Natural Spices</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wave Divider */}
      <div className="relative">
        <svg viewBox="0 0 1440 100" fill="none" preserveAspectRatio="none" className="w-full h-12 sm:h-20">
          <path d="M0 100L60 90C120 80 240 60 360 53.3C480 47 600 53 720 56.7C840 60 960 60 1080 56.7C1200 53 1320 47 1380 43.3L1440 40V0H0V100Z" fill="#F5E6D3"/>
        </svg>
      </div>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-12 sm:py-16 bg-gradient-to-b from-warmWhite to-cream relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-20 left-10 text-8xl text-caramel">☕</div>
          <div className="absolute bottom-20 right-10 text-8xl text-caramel">☕</div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="font-baloo text-3xl sm:text-4xl lg:text-5xl font-bold text-darkBrown mb-2 drop-shadow-sm">What Our Chai Lovers Say</h2>
            <p className="text-darkBrown/70 text-lg font-semibold max-w-2xl mx-auto">Real stories from real chai enthusiasts</p>
            {reviewsSummary.count > 0 && (
              <div className="mt-4 flex items-center justify-center gap-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(Math.round(reviewsSummary.average || 0))].map((_, i) => (<Star key={i} className="w-4 h-4 fill-current" />))}
                </div>
                <div className="text-sm text-darkBrown/60">{reviewsSummary.average.toFixed(1)} average — {reviewsSummary.count} reviews</div>
              </div>
            )}
          </div>
          
          {/* Testimonial Carousel */}
          <div className="relative">
            <div className="overflow-hidden rounded-3xl">
              <div 
                className="carousel-container"
                style={{
                  transform: `translateX(-${currentSlide * (100 / visibleSlides)}%)`
                }}
              >
                {testimonials.map((testimonial, index) => {
                  const initials = testimonial.initials || 
                    (testimonial.name ? testimonial.name.split(' ').map(n => n[0]).join('') : 'CT');
                  const location = testimonial.location || testimonial.role || '';
                  
                  return (
                    <div key={testimonial._id || index} className="testimonial-card min-w-full sm:min-w-[50%] lg:min-w-[33.333%] p-3 sm:p-4">
                      <div className="bg-gradient-to-br from-cream to-warmWhite border-2 border-caramel/40 rounded-3xl p-6 sm:p-8 h-full shadow-xl hover:shadow-2xl transition-all hover:border-caramel">
                        <div className="flex items-center mb-4 sm:mb-6">
                          <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${
                            index % 3 === 0 ? 'from-caramel to-darkBrown' : 
                            index % 3 === 1 ? 'from-darkBrown to-caramel' : 
                            'from-caramel to-darkBrown'
                          } rounded-full flex items-center justify-center text-cream font-baloo font-bold text-lg sm:text-xl shadow-lg border-2 border-beige/50`}>
                            {initials}
                          </div>
                          <div className="ml-3 sm:ml-4">
                            <h4 className="font-baloo font-bold text-darkBrown text-base sm:text-lg">{testimonial.name}</h4>
                            <p className="text-caramel text-xs sm:text-sm">{location}</p>
                          </div>
                        </div>
                        <div className="flex mb-3 sm:mb-4">
                          <span className="text-caramel text-lg sm:text-xl">
                            {'★'.repeat(testimonial.rating || 5)}
                          </span>
                        </div>
                        <p className="text-darkBrown/80 text-sm sm:text-base italic leading-relaxed">"{testimonial.content || testimonial.comment}"</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Carousel Controls */}
            <div className="flex justify-center mt-6 sm:mt-8 gap-3 sm:gap-4">
              <button 
                onClick={prevSlide}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-caramel to-darkBrown text-cream rounded-full flex items-center justify-center hover:from-darkBrown hover:to-caramel transition-all shadow-xl border-2 border-beige/50 transform hover:scale-110"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <button 
                onClick={nextSlide}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-caramel to-darkBrown text-cream rounded-full flex items-center justify-center hover:from-darkBrown hover:to-caramel transition-all shadow-xl border-2 border-beige/50 transform hover:scale-110"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
            
            {/* Carousel Dots */}
            <div className="flex justify-center mt-4 gap-2">
              {Array.from({ length: Math.min(totalSlides, maxSlide + 1) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all border-2 ${
                    index === currentSlide 
                      ? 'bg-caramel border-darkBrown scale-125 shadow-md' 
                      : 'bg-beige/50 border-caramel/60 hover:bg-beige hover:scale-110'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-darkBrown via-caramel to-darkBrown relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-40 h-40 bg-beige/10 rounded-full float-animation"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-beige/10 rounded-full float-animation" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-beige/10 rounded-full float-animation" style={{animationDelay: '0.5s'}}></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="font-baloo text-3xl sm:text-4xl lg:text-5xl font-bold text-cream mb-3 drop-shadow-lg">Ready for Your Perfect Cup?</h2>
          <p className="text-beige text-lg sm:text-xl font-medium mb-6 max-w-2xl mx-auto">
            Join thousands of chai lovers and experience the warmth of authentic Indian chai with our rewards program.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            <button 
              onClick={() => { onGetStarted?.(); openAuthModal('register'); }}
              className="cta-btn bg-cream text-darkBrown px-8 sm:px-10 py-4 sm:py-5 rounded-full font-baloo font-bold text-lg sm:text-xl shadow-2xl hover:bg-warmWhite hover:shadow-cream/30 transform hover:-translate-y-1 transition-all"
            >
              ☕ Order Your Chai Now
            </button>
            <a href="#features" className="text-cream border-2 border-cream/70 px-8 sm:px-10 py-4 sm:py-5 rounded-full font-baloo font-bold text-lg sm:text-xl hover:bg-cream hover:text-darkBrown transition-all shadow-lg">
              Explore Menu
            </a>
          </div>
          
          {/* Trust badges */}
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 mt-10 sm:mt-12">
            <div className="flex items-center text-beige bg-darkBrown/30 px-4 py-2 rounded-full">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              <span className="text-sm sm:text-base font-semibold">Premium Quality</span>
            </div>
            <div className="flex items-center text-beige bg-darkBrown/30 px-4 py-2 rounded-full">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              <span className="text-sm sm:text-base font-semibold">100% Fresh</span>
            </div>
            <div className="flex items-center text-beige bg-darkBrown/30 px-4 py-2 rounded-full">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              <span className="text-sm sm:text-base font-semibold">Made with Love</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-darkBrown to-darkBrown/90 py-12 sm:py-16 border-t-4 border-caramel">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <h3 className="font-baloo text-2xl sm:text-3xl font-bold text-beige mb-4">#CHAITIME</h3>
              <p className="text-cream/90 text-sm sm:text-base mb-6 max-w-md leading-relaxed">
                Bringing the authentic taste of Indian chai to your doorstep. Every cup is a journey through tradition and warmth.
              </p>
              {/* Social Links */}
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 bg-caramel/30 hover:bg-caramel rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-lg">
                  <svg className="w-5 h-5 text-beige" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-caramel/30 hover:bg-caramel rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-lg">
                  <svg className="w-5 h-5 text-beige" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-caramel/30 hover:bg-caramel rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-lg">
                  <svg className="w-5 h-5 text-beige" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-caramel/30 hover:bg-caramel rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-lg">
                  <svg className="w-5 h-5 text-beige" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="font-baloo text-lg font-bold text-beige mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#hero" className="text-cream/80 hover:text-beige transition-colors text-sm sm:text-base">Home</a></li>
                <li><a href="#features" className="text-cream/80 hover:text-beige transition-colors text-sm sm:text-base">Features</a></li>
                <li><a href="#about" className="text-cream/80 hover:text-beige transition-colors text-sm sm:text-base">About Us</a></li>
                <li><a href="#testimonials" className="text-cream/80 hover:text-beige transition-colors text-sm sm:text-base">Testimonials</a></li>
              </ul>
            </div>
            
            {/* Contact */}
            <div>
              <h4 className="font-baloo text-lg font-bold text-beige mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-center text-cream/80 text-sm sm:text-base">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  India
                </li>
                <li className="flex items-center text-cream/80 text-sm sm:text-base">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  hello@chaitime.com
                </li>
                <li className="flex items-center text-cream/80 text-sm sm:text-base">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  Support Available
                </li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-caramel/30 mt-10 sm:mt-12 pt-6 sm:pt-8 text-center">
            <p className="text-cream/70 text-sm font-medium">© 2024 ChaiTime. Made with ☕ and ❤️ in India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
