import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { tutorialSteps } from "@/data/tutorialSteps";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onClose: () => void;
};

const TutorialOverlay = ({ open, onClose }: Props) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!open) setStep(0);
  }, [open]);

  const isLast = step === tutorialSteps.length - 1;

  const next = () => {
    if (isLast) onClose();
    else setStep((s) => s + 1);
  };

  const back = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="
            fixed inset-0 z-50
            bg-black/70 backdrop-blur-sm
            flex items-center justify-center
            px-4
          "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* CARD */}
          <motion.div
            key={step}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="
              w-full max-w-md
              bg-white
              rounded-2xl
              px-6 py-6
              shadow-2xl
            "
          >
            {/* Progress */}
            <div className="flex justify-center gap-2 mb-5">
              {tutorialSteps.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-6 rounded-full transition-all ${
                    i <= step ? "bg-primary" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>

            {/* Content */}
            <h2 className="text-lg sm:text-xl font-bold text-primary text-center mb-3">
              {tutorialSteps[step].title}
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground text-center leading-relaxed mb-6">
              {tutorialSteps[step].description}
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-11"
                disabled={step === 0}
                onClick={back}
              >
                Back
              </Button>

              <Button className="flex-1 h-11" onClick={next}>
                {isLast ? "Finish" : "Next"}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TutorialOverlay;
