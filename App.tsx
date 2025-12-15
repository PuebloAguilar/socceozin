
import React, { useRef, useState, useEffect } from "react";
// FIX: Cast motion to `any` to bypass TypeScript errors due to a likely configuration issue.
import { motion as untypedMotion, AnimatePresence } from "framer-motion";
import { Spotlight } from "./components/ui/spotlight-new";
import StrategyExecutionPanel from "./components/primeira-dobra/database-with-rest-api";
import DatabaseRestApiMinimal from "./components/primeira-dobra/database-rest-api-minimal";
import StrategySection from "./components/second-fold/StrategySection";
import CtaButton from "./components/primeira-dobra/cta-button";
import ThirdFold from "./components/third-fold/ThirdFold";
import StepByStepSection from "./components/fourth-fold/StepByStepSection";
import FourthFold from "./components/fourth-fold/FourthFold";
import { Header } from "./components/header/Header";
import LoginScreen from "./components/auth/LoginScreen";
import ProblemSolutionSection from "./components/second-fold/ProblemSolutionSection";
import PricingSection from "./components/pricing/PricingSection";
import FaqSection from "./components/faq/FaqSection";
import Footer from "./components/footer/Footer";
import DifferentiatorsSection from "./components/differentiators/DifferentiatorsSection";
import BibliotecaFrameworks from "./components/third-fold/BibliotecaFrameworks";
import AdminDashboard from "./components/admin/AdminDashboard";
import { BlogProvider } from "./context/BlogContext";

const motion = untypedMotion as any;

function App() {
  const strategySectionRef = useRef<HTMLDivElement>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  // Initialize blog state based on current URL to prevent flash of homepage
  const [isBlogOpen, setIsBlogOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return window.location.pathname.startsWith('/blog');
      } catch (e) {
        return false;
      }
    }
    return false;
  });
  const [blogInitialPost, setBlogInitialPost] = useState<any>(null);
  const [blogOptions, setBlogOptions] = useState<{ section?: string, category?: string } | null>(null);

  // Proteção contra cópia de código e inspeção
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F12') e.preventDefault();
      if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) e.preventDefault();
      if (e.ctrlKey && e.key.toUpperCase() === 'U') e.preventDefault();
      if (e.ctrlKey && e.key.toUpperCase() === 'S') e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      try {
        const isBlog = window.location.pathname.startsWith('/blog');
        setIsBlogOpen(isBlog);
        if (!isBlog) {
            setBlogInitialPost(null);
            setBlogOptions(null);
        }
      } catch (e) {
        // Ignore errors in constrained environments
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleOpenBlog = (post: any = null, options: { section?: string, category?: string } | null = null) => {
    if (post) {
      setBlogInitialPost(post);
      setBlogOptions(null);
      // BibliotecaFrameworks handles the URL update for specific posts
    } else {
      setBlogInitialPost(null);
      setBlogOptions(options);
      try {
        window.history.pushState({}, '', '/blog');
      } catch (e) {
        console.warn('Navigation update blocked by environment');
      }
    }
    setIsBlogOpen(true);
    // Scroll to top when opening blog (BibliotecaFrameworks handles scrolling to specific section if needed)
    window.scrollTo(0, 0);
  };

  const handleCloseBlog = () => {
    setIsBlogOpen(false);
    setBlogInitialPost(null);
    setBlogOptions(null);
    try {
        window.history.pushState({}, '', '/');
    } catch (e) {
        console.warn('Navigation update blocked by environment');
    }
    // Scroll to top when returning to home
    window.scrollTo(0, 0);
  };

  const handleAdminLogin = () => {
      setIsLoginOpen(false);
      setIsAdminOpen(true);
  };

  const handleAdminLogout = () => {
      setIsAdminOpen(false);
      try {
        window.history.pushState({}, '', '/');
      } catch (e) {
        console.warn('Navigation update blocked by environment');
      }
  };

  // Variantes de animação para a entrada inicial
  const heroVariants = {
    hidden: { opacity: 0, y: 30 }, // Reduced movement for smoother mobile feel
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.15 + 0.3,
        duration: 0.8, // Slightly faster for mobile responsiveness
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  // WRAP EVERYTHING IN BLOG PROVIDER
  return (
    <BlogProvider>
        {/* RENDER ADMIN DASHBOARD */}
        {isAdminOpen ? (
            <AdminDashboard onLogout={handleAdminLogout} />
        ) : isBlogOpen ? (
            // RENDER BLOG VIEW
            <div 
                onContextMenu={(e) => e.preventDefault()}
                className="w-full bg-black antialiased relative min-h-screen"
            >
                <BibliotecaFrameworks 
                    onBack={handleCloseBlog} 
                    initialPost={blogInitialPost} 
                    initialOptions={blogOptions}
                />
            </div>
        ) : (
            // RENDER LANDING PAGE VIEW
            <div 
                onContextMenu={(e) => e.preventDefault()}
                className="w-full bg-black antialiased relative overflow-x-hidden select-none"
            >
                <style>{`
                    img {
                    -webkit-user-drag: none;
                    -khtml-user-drag: none;
                    -moz-user-drag: none;
                    -o-user-drag: none;
                    user-drag: none;
                    pointer-events: none;
                    }
                    /* Improved tap highlight for mobile */
                    * {
                        -webkit-tap-highlight-color: transparent;
                    }
                `}</style>

                <Header 
                    onLoginClick={() => setIsLoginOpen(true)} 
                    onBlogClick={() => handleOpenBlog()}
                />

                <AnimatePresence>
                    {isLoginOpen && (
                        <LoginScreen 
                            onBack={() => setIsLoginOpen(false)} 
                            onAdminLogin={handleAdminLogin}
                        />
                    )}
                </AnimatePresence>
                
                {/* First Fold */}
                <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center relative pt-24 pb-12 md:py-24">
                    
                    {/* Background Pattern - Optimized opacity for mobile */}
                    <div
                    className="absolute inset-0 z-0 pointer-events-none opacity-50 md:opacity-100"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.04)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
                    }}
                    />

                    {/* Gradient Transition Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 md:h-64 bg-gradient-to-b from-transparent to-black z-0 pointer-events-none" />

                    <Spotlight />
                    <div className="p-4 max-w-7xl mx-auto relative z-10 w-full flex flex-col items-center">
                    
                    <motion.h1 
                        custom={0}
                        initial="hidden"
                        animate="visible"
                        variants={heroVariants}
                        className="text-4xl xs:text-5xl sm:text-6xl md:text-8xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50 px-2"
                    >
                        SOCCEO
                    </motion.h1>
                    
                    <motion.p 
                        custom={1}
                        initial="hidden"
                        animate="visible"
                        variants={heroVariants}
                        className="mt-4 md:mt-6 text-3xl xs:text-4xl sm:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50 tracking-tight leading-tight px-2"
                    >
                        A Nova Era da Estratégia
                    </motion.p>
                    
                    <motion.p 
                        custom={2}
                        initial="hidden"
                        animate="visible"
                        variants={heroVariants}
                        className="mt-6 text-lg xs:text-xl md:text-2xl text-neutral-300 max-w-4xl text-center mx-auto font-medium leading-relaxed px-4"
                    >
                        Utilize IA para desbloquear o potencial máximo do seu negócio por meio de frameworks, metodologias e processos validados que unem ciência, estratégia e execução em um único sistema integrado.
                    </motion.p>
                    
                    <motion.div 
                        custom={3}
                        initial="hidden"
                        animate="visible"
                        variants={heroVariants}
                        className="mt-8 flex h-16 items-center justify-center w-full sm:w-auto px-4"
                    >
                        <CtaButton ctaText="ADQUIRIR MEU SOCCEO" ctaHref="#planos" className="w-full sm:w-auto" />
                    </motion.div>
                    
                    <motion.div 
                        custom={4}
                        initial="hidden"
                        animate="visible"
                        variants={heroVariants}
                        className="mt-12 w-full max-w-3xl flex flex-col items-center relative px-2 sm:px-0"
                    >
                        <DatabaseRestApiMinimal />
                        
                        <div className="relative w-full -mt-4 md:-mt-6 z-10">
                        <div className="absolute top-0 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 w-max max-w-[90vw]">
                            <div className="rounded-lg border border-white/30 bg-[#101112] px-3 py-1.5 shadow-xl">
                            <span className="whitespace-nowrap text-[9px] xs:text-[10px] font-bold text-white/90 tracking-widest block">
                                TUDO ISSO CONECTADO A UM ÚNICO CÉREBRO
                            </span>
                            </div>
                        </div>

                        <StrategyExecutionPanel />
                        </div>
                    </motion.div>
                    </div>
                </div>
                
                {/* New Fold: Problem & Solution */}
                <ProblemSolutionSection />
                
                {/* New Fold: Differentiators */}
                <DifferentiatorsSection />

                {/* Second Fold */}
                <StrategySection
                    ref={strategySectionRef}
                />

                {/* New Fourth Fold */}
                <StepByStepSection />

                {/* Third Fold - Pass handler to open blog */}
                <ThirdFold onOpenBlog={handleOpenBlog} />
                
                {/* Unified Section Container */}
                <div className="relative w-full bg-black">
                    {/* Shared Grid Background for Bottom Sections */}
                    <div
                        className="absolute inset-0 z-0 pointer-events-none opacity-50"
                        style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.04)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
                        }}
                    />

                    {/* Testimonials Fold */}
                    <FourthFold />

                    {/* Pricing Fold */}
                    <PricingSection />

                    {/* FAQ Section */}
                    <FaqSection />

                </div>
                <Footer />
            </div>
        )}
    </BlogProvider>
  );
}

export default App;
