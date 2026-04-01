import { motion } from "framer-motion";
import { MessageSquare, Shield, Clock, Mountain } from "lucide-react";
import heroImage from "@/assets/hero-mountain.jpg";

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-primary/80 backdrop-blur-md">
    <div className="flex items-center gap-2">
      <Mountain className="h-6 w-6 text-accent" />
      <span className="font-display text-xl font-bold text-primary-foreground tracking-wide">Aware</span>
    </div>
    <div className="hidden md:flex items-center gap-8 font-body text-sm text-primary-foreground/80">
      <a href="#how-it-works" className="hover:text-accent transition-colors">How It Works</a>
      <a href="#features" className="hover:text-accent transition-colors">Features</a>
      <a href="#pricing" className="hover:text-accent transition-colors">Pricing</a>
    </div>
    <a href="#pricing" className="px-5 py-2 rounded-lg bg-accent text-accent-foreground font-body font-semibold text-sm hover:brightness-110 transition-all">
      Get Started
    </a>
  </nav>
);

const Hero = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    <img
      src={heroImage}
      alt="Hiker standing on mountain ridge at golden hour"
      className="absolute inset-0 w-full h-full object-cover"
      width={1920}
      height={1080}
    />
    <div className="absolute inset-0" style={{ background: "var(--hero-overlay)" }} />
    <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="font-body text-accent text-sm md:text-base uppercase tracking-[0.25em] mb-6 font-semibold"
      >
        Your Virtual Safety Companion
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6"
      >
        Adventure Boldly.{" "}
        <span className="text-accent">Return Safely.</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="font-body text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
      >
        The simplest safety check-in for adventurers. Text your plans before you go — if you don't check back in, we alert your emergency contacts. No apps. No devices. Just peace of mind.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <a href="#pricing" className="px-8 py-4 rounded-lg font-body font-bold text-accent-foreground text-lg hover:brightness-110 transition-all" style={{ background: "var(--gradient-accent)" }}>
          Start Your Free Trial
        </a>
        <a href="#how-it-works" className="px-8 py-4 rounded-lg border-2 border-primary-foreground/30 text-primary-foreground font-body font-semibold text-lg hover:border-accent hover:text-accent transition-all">
          Learn More
        </a>
      </motion.div>
    </div>
  </section>
);

const steps = [
  {
    icon: MessageSquare,
    title: "Text Your Plans",
    description: "Before your adventure, send a simple text with your destination, activity, and expected return time.",
  },
  {
    icon: Clock,
    title: "Set Your Timer",
    description: "Choose a custom check-in window — from a quick day hike to a multi-day expedition.",
  },
  {
    icon: Shield,
    title: "We've Got Your Back",
    description: "If you don't check back in, Aware automatically alerts your emergency contacts with your last known details.",
  },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-24 md:py-32 bg-background">
    <div className="max-w-6xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="font-body text-accent text-sm uppercase tracking-[0.2em] mb-3 font-semibold">Simple & Reliable</p>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">How Aware Works</h2>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-8 md:gap-12">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="text-center"
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary flex items-center justify-center">
              <step.icon className="h-7 w-7 text-accent" />
            </div>
            <p className="font-body text-accent text-xs uppercase tracking-[0.2em] mb-2 font-semibold">Step {i + 1}</p>
            <h3 className="font-display text-xl font-bold text-foreground mb-3">{step.title}</h3>
            <p className="font-body text-muted-foreground leading-relaxed">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const features = [
  {
    title: "No Apps Required",
    description: "Works via simple text messages — no downloads, no installations, no complicated setup.",
  },
  {
    title: "Automated Alerts",
    description: "Missed check-in? We instantly notify your emergency contacts with your last known location and details.",
  },
  {
    title: "Customizable Timers",
    description: "Tailor check-in windows to your activity — from a 2-hour hike to a week-long expedition.",
  },
  {
    title: "Privacy First",
    description: "Strong encryption protects your data. Location is only shared during an actual emergency.",
  },
  {
    title: "Wearable Integration",
    description: "Connect with smart devices to monitor vital signs and environmental data for real-time safety insights.",
  },
  {
    title: "Works Everywhere",
    description: "Anywhere you have mobile service before your adventure, Aware has you covered.",
  },
];

const Features = () => (
  <section id="features" className="py-24 md:py-32" style={{ background: "var(--gradient-dark)" }}>
    <div className="max-w-6xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="font-body text-accent text-sm uppercase tracking-[0.2em] mb-3 font-semibold">Built for Adventurers</p>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground">Why Choose Aware</h2>
      </motion.div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 backdrop-blur-sm hover:border-accent/40 transition-all group"
          >
            <h3 className="font-display text-lg font-bold text-primary-foreground mb-3 group-hover:text-accent transition-colors">{feature.title}</h3>
            <p className="font-body text-primary-foreground/70 leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const plans = [
  {
    name: "Basic",
    price: "Free",
    period: "",
    description: "For occasional adventurers",
    features: ["Manual text check-ins", "1 emergency contact", "Basic location sharing", "Email alerts"],
    highlight: false,
  },
  {
    name: "Premium",
    price: "$9",
    period: "/month",
    description: "For serious explorers",
    features: ["Unlimited check-ins", "5 emergency contacts", "24/7 automated monitoring", "SMS & email alerts", "Wearable integration", "Priority support"],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For teams & organizations",
    features: ["Unlimited users", "Real-time safety tracking", "Custom safety protocols", "API access", "Dedicated account manager", "Emergency service dispatch"],
    highlight: false,
  },
];

const Pricing = () => (
  <section id="pricing" className="py-24 md:py-32 bg-background">
    <div className="max-w-6xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <p className="font-body text-accent text-sm uppercase tracking-[0.2em] mb-3 font-semibold">Simple Pricing</p>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">Choose Your Safety Plan</h2>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className={`rounded-2xl p-8 flex flex-col ${
              plan.highlight
                ? "bg-primary text-primary-foreground ring-2 ring-accent scale-105"
                : "bg-card border border-border"
            }`}
          >
            {plan.highlight && (
              <span className="self-start px-3 py-1 rounded-full text-xs font-body font-bold text-accent-foreground mb-4" style={{ background: "var(--gradient-accent)" }}>
                Most Popular
              </span>
            )}
            <h3 className="font-display text-xl font-bold mb-1">{plan.name}</h3>
            <p className={`font-body text-sm mb-4 ${plan.highlight ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
              {plan.description}
            </p>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="font-display text-4xl font-bold">{plan.price}</span>
              {plan.period && <span className={`font-body text-sm ${plan.highlight ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{plan.period}</span>}
            </div>
            <ul className="space-y-3 mb-8 flex-grow">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 font-body text-sm">
                  <span className="text-accent mt-0.5">✓</span>
                  <span className={plan.highlight ? "text-primary-foreground/90" : "text-foreground/80"}>{f}</span>
                </li>
              ))}
            </ul>
            <button
              className={`w-full py-3 rounded-lg font-body font-bold text-sm transition-all ${
                plan.highlight
                  ? "text-accent-foreground hover:brightness-110"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
              style={plan.highlight ? { background: "var(--gradient-accent)" } : undefined}
            >
              {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const QuoteSection = () => (
  <section className="py-20 md:py-28" style={{ background: "var(--gradient-dark)" }}>
    <div className="max-w-3xl mx-auto px-6 text-center">
      <motion.blockquote
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <p className="font-display text-2xl md:text-3xl text-primary-foreground/90 italic leading-relaxed mb-6">
          "We understand that many adventurers want a safety solution that doesn't get in the way of their experience. With Aware, it's as easy as texting your plans, and we'll take care of the rest."
        </p>
        <footer className="font-body text-accent font-semibold">
          — Joe Tolerico, Founder & CEO
        </footer>
      </motion.blockquote>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-12 bg-primary">
    <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-2">
        <Mountain className="h-5 w-5 text-accent" />
        <span className="font-display text-lg font-bold text-primary-foreground">Aware</span>
      </div>
      <p className="font-body text-sm text-primary-foreground/50">
        Pagosa Springs, Colorado · © {new Date().getFullYear()} Aware Safety. All rights reserved.
      </p>
    </div>
  </footer>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <QuoteSection />
      <Pricing />
      <Footer />
    </div>
  );
}
