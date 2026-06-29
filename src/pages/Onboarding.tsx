import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mountain, ArrowRight, ArrowLeft, Phone, Shield, MapPin, Check } from "lucide-react";
import { storage } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const ACTIVITY_TYPES = [
  "Hiking", "Climbing", "Trail Running", "Backpacking",
  "Mountain Biking", "Kayaking", "Skiing", "Fishing",
];

const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

export default function Onboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);

  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactRelationship, setContactRelationship] = useState("");

  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState("Beginner");

  const toggleActivity = (a: string) =>
    setSelectedActivities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );

  const handleComplete = () => {
    if (contactName.trim() && contactPhone.trim()) {
      storage.addContact({
        name: contactName.trim(),
        phone: contactPhone.trim(),
        email: contactEmail.trim(),
        relationship: contactRelationship.trim(),
      });
    }
    if (selectedActivities.length > 0) {
      storage.setActivities(selectedActivities);
    }
    storage.setSetupComplete();
    toast({ title: "You're all set!", description: "Start your first check-in whenever you're ready." });
    navigate("/dashboard");
  };

  const steps = [
    { title: "Emergency contact", subtitle: "Who should we notify if you don't check back in?", icon: Shield },
    { title: "Your adventures", subtitle: "What activities do you enjoy?", icon: MapPin },
  ];

  const canProceed = () => {
    if (step === 0) return contactName.trim().length > 0 && contactPhone.trim().length > 0;
    if (step === 1) return selectedActivities.length > 0;
    return false;
  };

  const isLastStep = step === steps.length - 1;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <Mountain className="h-6 w-6 text-accent" />
          <span className="font-display text-xl font-bold text-foreground">Aware</span>
        </Link>
        <div className="flex items-center gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? "w-8 bg-accent" : i < step ? "w-2 bg-accent/60" : "w-2 bg-border"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
                  {(() => { const Icon = steps[step].icon; return <Icon className="h-6 w-6 text-accent" />; })()}
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-1">{steps[step].title}</h2>
                <p className="font-body text-muted-foreground">{steps[step].subtitle}</p>
              </div>

              {step === 0 && (
                <div className="space-y-4 bg-card border border-border rounded-2xl p-6">
                  <div className="space-y-2">
                    <Label className="font-body">Contact name *</Label>
                    <Input placeholder="e.g. Sarah Tolerico" value={contactName} onChange={(e) => setContactName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-body">Phone number *</Label>
                    <Input placeholder="+1 (555) 000-0000" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-body">Email <span className="text-muted-foreground">(optional)</span></Label>
                    <Input type="email" placeholder="sarah@example.com" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-body">Relationship <span className="text-muted-foreground">(optional)</span></Label>
                    <Input placeholder="e.g. Spouse, Parent, Friend" value={contactRelationship} onChange={(e) => setContactRelationship(e.target.value)} />
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6 bg-card border border-border rounded-2xl p-6">
                  <div>
                    <Label className="font-body mb-3 block">Select your activities *</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {ACTIVITY_TYPES.map((a) => (
                        <button
                          key={a}
                          onClick={() => toggleActivity(a)}
                          className={`px-4 py-3 rounded-xl font-body text-sm font-medium transition-all border ${
                            selectedActivities.includes(a)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background border-border text-foreground hover:border-accent"
                          }`}
                        >
                          {selectedActivities.includes(a) && <Check className="h-3.5 w-3.5 inline mr-1.5" />}
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="font-body mb-3 block">Experience level</Label>
                    <div className="flex gap-2 flex-wrap">
                      {EXPERIENCE_LEVELS.map((level) => (
                        <button
                          key={level}
                          onClick={() => setExperienceLevel(level)}
                          className={`px-4 py-2 rounded-xl font-body text-sm font-medium transition-all border ${
                            experienceLevel === level
                              ? "bg-accent text-accent-foreground border-accent"
                              : "bg-background border-border text-foreground hover:border-accent"
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8">
            <Button variant="ghost" onClick={() => step > 0 ? setStep(step - 1) : navigate("/auth")} className="font-body">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            {isLastStep ? (
              <Button onClick={handleComplete} disabled={!canProceed()} className="font-body font-bold" style={{ background: "var(--gradient-accent)" }}>
                Complete setup
                <Check className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={() => setStep(step + 1)} disabled={!canProceed()} className="font-body font-bold" style={{ background: "var(--gradient-accent)" }}>
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
