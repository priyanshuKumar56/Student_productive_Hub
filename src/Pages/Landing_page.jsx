"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useTheme } from "next-themes";
import {
  SunIcon,
  FileText,
  Lightbulb,
  Brain,
  BarChart,
  BookOpen,
  PenTool,
  Clock,
  Users,
  Zap,
  Menu,
  X,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const LandingPage = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme } = useTheme();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-rotate through features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Features data
  const features = [
    {
      icon: <FileText className="h-7 w-7" />,
      title: "Distraction-Free Editor",
      description:
        "Focus on your thoughts with our clean, markdown-enabled editor. Format your notes your way with zero distractions.",
      color: "blue",
    },
    {
      icon: <PenTool className="h-7 w-7" />,
      title: "Unlimited Canvas",
      description:
        "Visualize your ideas with our infinite whiteboard. Create diagrams, mind maps, and visual notes without constraints.",
      color: "purple",
    },
    {
      icon: <Brain className="h-7 w-7" />,
      title: "AI-Powered Assistance",
      description:
        "Get instant summaries, explanations, and translations. Let our AI help you understand complex topics faster.",
      color: "green",
    },
    {
      icon: <SunIcon className="h-7 w-7" />,
      title: "Light & Dark Themes",
      description:
        "Study your way, day or night. Customize your experience with eye-friendly theme options for any environment.",
      color: "amber",
    },
    {
      icon: <Lightbulb className="h-7 w-7" />,
      title: "Smart Diagrams",
      description:
        "Generate professional diagrams instantly. Describe what you need, and our AI creates visual representations for you.",
      color: "rose",
    },
    {
      icon: <BarChart className="h-7 w-7" />,
      title: "Progress Tracking",
      description:
        "Monitor your study habits and productivity with intuitive analytics. Stay motivated and improve your learning efficiency.",
      color: "teal",
    },
  ];

  const getColorClasses = (color, type) => {
    const colorMap = {
      blue: {
        bg: "bg-blue-100 dark:bg-blue-950/30",
        text: "text-blue-600 dark:text-blue-400",
        border: "border-blue-400 dark:border-blue-700",
        gradient: "from-blue-500 to-indigo-600",
        glow: "shadow-blue-500/50 dark:shadow-blue-900/50",
        light: "bg-blue-50 dark:bg-blue-900/20",
        darkBg: "bg-blue-600 dark:bg-blue-500",
        fill: "#3b82f6",
      },
      purple: {
        bg: "bg-purple-100 dark:bg-purple-950/30",
        text: "text-purple-600 dark:text-purple-400",
        border: "border-purple-400 dark:border-purple-700",
        gradient: "from-purple-500 to-indigo-600",
        glow: "shadow-purple-500/50 dark:shadow-purple-900/50",
        light: "bg-purple-50 dark:bg-purple-900/20",
        darkBg: "bg-purple-600 dark:bg-purple-500",
        fill: "#9333ea",
      },
      green: {
        bg: "bg-green-100 dark:bg-green-950/30",
        text: "text-green-600 dark:text-green-400",
        border: "border-green-400 dark:border-green-700",
        gradient: "from-green-500 to-emerald-600",
        glow: "shadow-green-500/50 dark:shadow-green-900/50",
        light: "bg-green-50 dark:bg-green-900/20",
        darkBg: "bg-green-600 dark:bg-green-500",
        fill: "#22c55e",
      },
      amber: {
        bg: "bg-amber-100 dark:bg-amber-950/30",
        text: "text-amber-600 dark:text-amber-400",
        border: "border-amber-400 dark:border-amber-700",
        gradient: "from-amber-500 to-orange-600",
        glow: "shadow-amber-500/50 dark:shadow-amber-900/50",
        light: "bg-amber-50 dark:bg-amber-900/20",
        darkBg: "bg-amber-600 dark:bg-amber-500",
        fill: "#f59e0b",
      },
      rose: {
        bg: "bg-rose-100 dark:bg-rose-950/30",
        text: "text-rose-600 dark:text-rose-400",
        border: "border-rose-400 dark:border-rose-700",
        gradient: "from-rose-500 to-pink-600",
        glow: "shadow-rose-500/50 dark:shadow-rose-900/50",
        light: "bg-rose-50 dark:bg-rose-900/20",
        darkBg: "bg-rose-600 dark:bg-rose-500",
        fill: "#f43f5e",
      },
      teal: {
        bg: "bg-teal-100 dark:bg-teal-950/30",
        text: "text-teal-600 dark:text-teal-400",
        border: "border-teal-400 dark:border-teal-700",
        gradient: "from-teal-500 to-cyan-600",
        glow: "shadow-teal-500/50 dark:shadow-teal-900/50",
        light: "bg-teal-50 dark:bg-teal-900/20",
        darkBg: "bg-teal-600 dark:bg-teal-500",
        fill: "#14b8a6",
      },
    };

    return colorMap[color][type];
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-slate-900 dark:text-slate-100">
      {/* Navbar */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white dark:bg-gray-900 shadow-md py-2"
            : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <BookOpen
                className={`h-8 w-8 mr-2 ${
                  isScrolled
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-white dark:text-white"
                }`}
              />
              <span
                className={`text-xl font-bold ${
                  isScrolled
                    ? "text-slate-900 dark:text-white"
                    : "text-white dark:text-white"
                }`}
              >
                StudySpace
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className={`${
                  isScrolled
                    ? "text-slate-700 dark:text-slate-300"
                    : "text-white dark:text-white"
                } hover:text-blue-500 dark:hover:text-blue-400 transition-colors`}
              >
                Features
              </a>
              <a
                href="#testimonials"
                className={`${
                  isScrolled
                    ? "text-slate-700 dark:text-slate-300"
                    : "text-white dark:text-white"
                } hover:text-blue-500 dark:hover:text-blue-400 transition-colors`}
              >
                Testimonials
              </a>
              <a
                href="#pricing"
                className={`${
                  isScrolled
                    ? "text-slate-700 dark:text-slate-300"
                    : "text-white dark:text-white"
                } hover:text-blue-500 dark:hover:text-blue-400 transition-colors`}
              >
                Pricing
              </a>
              <ThemeToggle />
              <Link to="/auth">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Register
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                className={`${
                  isScrolled
                    ? "text-slate-900 dark:text-white"
                    : "text-white dark:text-white"
                }`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a
                href="#features"
                className="block px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-md"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="block px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-md"
              >
                Testimonials
              </a>
              <a
                href="#pricing"
                className="block px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 rounded-md"
              >
                Pricing
              </a>
              <div className="flex space-x-2 mt-4 px-3">
                <Link to="/auth">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Register
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with Background Image */}
      <div className="relative h-screen flex items-center justify-center">
        {/* Background Image with Overlay and Animated Gradient */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat overflow-hidden"
          style={{
            backgroundImage: "url('/api/placeholder/1920/1080')",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-purple-900/70 to-black/80 dark:from-blue-950/90 dark:via-purple-950/80 dark:to-black/90"></div>

          {/* Animated floating elements */}
          <div className="absolute w-full h-full overflow-hidden">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-blue-500/20 dark:bg-blue-400/10 blur-xl"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${50 + Math.random() * 100}px`,
                  height: `${50 + Math.random() * 100}px`,
                  animation: `float ${5 + Math.random() * 10}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                  opacity: 0.3 + Math.random() * 0.5,
                }}
              />
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Your Ultimate{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              Study Companion
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            One workspace for all your notes, ideas, and creative projects.
            Powered by AI to boost your productivity and academic success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/Dashboard">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-10 py-6 text-lg shadow-lg shadow-blue-600/30 dark:shadow-blue-900/30 transition-all duration-300 hover:scale-105"
              >
                Get Started Free
              </Button>
            </Link>

            <Button
              size="lg"
              variant="outline"
              className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 px-10 py-6 text-lg transition-all duration-300 hover:scale-105"
            >
              Watch Demo
            </Button>
          </div>

          {/* Usage Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 text-white">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
              <div className="text-3xl font-bold">10k+</div>
              <div className="text-gray-300">Active Students</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
              <div className="text-3xl font-bold">1M+</div>
              <div className="text-gray-300">Notes Created</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-gray-300">Universities</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
              <div className="text-3xl font-bold">4.9</div>
              <div className="text-gray-300">User Rating</div>
            </div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>

      {/* Features Section with Animated Timeline */}
      <div
        id="features"
        className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-950 relative overflow-hidden"
      >
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 dark:bg-blue-900/20 rounded-full opacity-50 blur-3xl translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-50 dark:bg-purple-900/20 rounded-full opacity-50 blur-3xl -translate-x-1/3 translate-y-1/3"></div>

        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-100 dark:border-blue-800 text-blue-700 dark:text-blue-400 rounded-full text-sm font-semibold mb-4 shadow-sm">
              POWERFUL FEATURES
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Everything You Need to Excel
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Our all-in-one platform combines powerful tools with intelligent
              features designed specifically for students like you.
            </p>
          </div>

          {/* Animated timeline section with enhanced styling */}
          <div className="relative flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Vertical timeline with enhanced styling */}
            <div className="hidden md:block w-1 bg-gradient-to-b from-gray-100 via-gray-200 to-gray-100 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 absolute h-full left-1/2 transform -translate-x-1/2 rounded-full shadow-inner">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="absolute"
                  style={{
                    top: `${(index * 100) / (features.length - 1)}%`,
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 10,
                  }}
                >
                  {/* Dot on timeline */}
                  <div
                    className={`w-8 h-8 rounded-full border-4 transition-all duration-500 flex items-center justify-center cursor-pointer ${
                      index <= activeFeature
                        ? `border-white dark:border-gray-800 ${getColorClasses(
                            features[index].color,
                            "darkBg"
                          )} shadow-lg`
                        : "border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                    onClick={() => setActiveFeature(index)}
                  >
                    {index === activeFeature && (
                      <span
                        className={`absolute w-12 h-12 rounded-full ${getColorClasses(
                          features[index].color,
                          "darkBg"
                        )} opacity-30 animate-ping`}
                        style={{ top: "-2px", left: "-2px" }}
                      ></span>
                    )}
                  </div>

                  {/* Curved connecting line to card (either to left or right) */}
                  {index === activeFeature && (
                    <svg
                      width="150"
                      height="80"
                      className={`absolute top-0 ${
                        index % 2 === 0 ? "left-8" : "right-8 -scale-x-100"
                      } transition-all duration-500`}
                      style={{ zIndex: 5 }}
                    >
                      <path
                        d={`M0,0 Q75,-30 150,0`}
                        stroke={getColorClasses(features[index].color, "fill")}
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray="6 4"
                        className="animate-dash"
                      />
                      <circle
                        cx="150"
                        cy="0"
                        r="6"
                        fill={getColorClasses(features[index].color, "fill")}
                      />
                    </svg>
                  )}
                </div>
              ))}

              {/* Enhanced animated light effect */}
              <div
                className={`absolute w-6 h-24 rounded-full transition-all duration-700 blur-xl opacity-70 bg-gradient-to-b ${getColorClasses(
                  features[activeFeature].color,
                  "gradient"
                )}`}
                style={{
                  top: `${(activeFeature * 100) / (features.length - 1)}%`,
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  filter: "drop-shadow(0 0 20px currentColor)",
                }}
              ></div>
            </div>

            {/* Features cards with enhanced styling */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-20">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className={`border-0 dark:bg-gray-800/50 transition-all duration-500 overflow-hidden group ${
                    index === activeFeature
                      ? `shadow-2xl ${getColorClasses(
                          feature.color,
                          "glow"
                        )} scale-105 z-20`
                      : "shadow-md hover:shadow-lg dark:shadow-gray-900/50"
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  {/* Gradient top bar */}
                  <div
                    className={`h-1.5 w-full bg-gradient-to-r ${getColorClasses(
                      feature.color,
                      "gradient"
                    )}`}
                  ></div>

                  <CardContent className="p-8 flex flex-col items-start">
                    <div
                      className={`h-16 w-16 rounded-2xl ${getColorClasses(
                        feature.color,
                        "light"
                      )} flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 ${
                        index === activeFeature
                          ? `animate-pulse shadow-md ${getColorClasses(
                              feature.color,
                              "glow"
                            )}`
                          : ""
                      }`}
                    >
                      <div className={getColorClasses(feature.color, "text")}>
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Learn more link that appears on hover */}
                    <div
                      className={`mt-4 text-sm font-medium ${getColorClasses(
                        feature.color,
                        "text"
                      )} opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1`}
                    >
                      Learn more
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 12L10 8L6 4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Mobile indicator dots */}
          <div className="flex justify-center mt-12 md:hidden gap-2">
            {features.map((feature, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeFeature
                    ? getColorClasses(features[activeFeature].color, "darkBg")
                    : "bg-gray-300 dark:bg-gray-700"
                }`}
                onClick={() => setActiveFeature(index)}
                aria-label={`Show feature ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Add animation keyframes for the dashed line */}
        <style jsx>{`
          @keyframes dash {
            to {
              stroke-dashoffset: 40;
            }
          }
          .animate-dash {
            animation: dash 15s linear infinite;
          }
        `}</style>
      </div>

      {/* How it Works Section */}
      <div className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm font-semibold mb-4">
              SEAMLESS WORKFLOW
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              How StudySpace Works
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              A powerful yet simple workflow designed to enhance your studying
              process from beginning to end.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {/* Step 1 */}
            <div className="relative">
              <div className="absolute -top-4 left-0 md:left-1/2 md:-translate-x-1/2 w-12 h-12 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <Card className="pt-10 h-full dark:bg-gray-800/50">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Clock className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 dark:text-white">
                    Capture & Organize
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Quickly capture your thoughts, notes, and ideas in our
                    distraction-free environment. Organize content with our
                    flexible system.
                  </p>
                </CardContent>
              </Card>
              <div className="hidden md:block absolute top-1/2 left-full w-16 h-2 bg-blue-200 dark:bg-blue-900/50">
                <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 dark:bg-blue-500 rotate-45"></div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative mt-8 md:mt-12">
              <div className="absolute -top-4 left-0 md:left-1/2 md:-translate-x-1/2 w-12 h-12 rounded-full bg-purple-600 dark:bg-purple-500 flex items-center justify-center text-white font-bold text-xl">
                2
              </div>
              <Card className="pt-10 h-full dark:bg-gray-800/50">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Zap className="h-12 w-12 text-purple-600 dark:text-purple-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 dark:text-white">
                    Enhance with AI
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Let our AI tools help you understand complex topics,
                    summarize content, translate text, and generate visual
                    diagrams.
                  </p>
                </CardContent>
              </Card>
              <div className="hidden md:block absolute top-1/2 left-full w-16 h-2 bg-purple-200 dark:bg-purple-900/50">
                <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-purple-600 dark:bg-purple-500 rotate-45"></div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative mt-8 md:mt-24">
              <div className="absolute -top-4 left-0 md:left-1/2 md:-translate-x-1/2 w-12 h-12 rounded-full bg-green-600 dark:bg-green-500 flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
              <Card className="pt-10 h-full dark:bg-gray-800/50">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Users className="h-12 w-12 text-green-600 dark:text-green-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 dark:text-white">
                    Review & Succeed
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Track your progress, review your material effectively, and
                    achieve academic success with our comprehensive toolkit.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div
        id="testimonials"
        className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-950"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold mb-4">
              STUDENT STORIES
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Join thousands of students who have transformed their study
              experience with StudySpace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 dark:border dark:border-blue-900/20">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 mb-6 italic">
                  "StudySpace has completely changed how I prepare for exams.
                  The AI features help me understand difficult concepts, and the
                  whiteboard is perfect for visualizing complex ideas."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-200 dark:bg-blue-800 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
                    JD
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold dark:text-white">
                      Jamie Davis
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Computer Science Major
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 dark:border dark:border-purple-900/20">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 mb-6 italic">
                  "As a medical student, I deal with vast amounts of
                  information. StudySpace helps me organize everything and the
                  AI summarization feature saves me hours of review time."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-300 font-bold">
                    SK
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold dark:text-white">Sarah Kim</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Medical Student
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 dark:border dark:border-green-900/20">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 mb-6 italic">
                  "The distraction-free editor is a game-changer for my thesis
                  writing. I can focus completely on my work and use the AI
                  tools to help refine my arguments and explanations."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-200 dark:bg-green-800 rounded-full flex items-center justify-center text-green-600 dark:text-green-300 font-bold">
                    MJ
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold dark:text-white">
                      Michael Johnson
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      PhD Candidate
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">StudySpace</h3>
              <p className="text-gray-300 mb-4">
                Empowering students to achieve their academic goals through
                smart productivity tools and resources.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-6 w-6"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-6 w-6"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-6 w-6"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="5"
                      ry="5"
                    ></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Study Plans
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Time Management
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Note-Taking Tools
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Exam Prep
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Student Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Study Guides
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Productivity Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Templates
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Academic Calendar
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Student Forum
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Tutoring Services
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Contact & Support</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5 mr-2"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span className="text-gray-300">1-800-STUDY-HELP</span>
                </li>
                <li className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5 mr-2"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span className="text-gray-300">support@studyboost.edu</span>
                </li>
                <li className="mt-4">
                  <h4 className="text-sm font-semibold mb-2">
                    Subscribe to our newsletter
                  </h4>
                  <div className="flex">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="p-2 text-black text-sm w-full rounded-l focus:outline-none"
                    />
                    <button className="bg-blue-600 hover:bg-blue-700 px-4 rounded-r text-sm">
                      Subscribe
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 StudyBoost. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Accessibility
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
