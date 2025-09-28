import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckIcon, UndoIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const HOLD_SECONDS = 1;

export default function AnimatedClaimButtonPage() {
  const [status, setStatus] = useState<"inactive" | "holding" | "completed">(
    "inactive",
  );
  const [timer, setTimer] = useState<number | null>(null);

  useEffect(() => {
    if (status === "holding") {
      const newTimer = setTimeout(() => {
        setStatus("completed");
      }, HOLD_SECONDS * 1000);
      setTimer(newTimer);
      return () => clearTimeout(newTimer);
    }
  }, [status]);

  const handlePointerUp = () => {
    if (status !== "completed" && timer !== null) {
      clearTimeout(timer);
      setStatus("inactive");
    }
  };

  const handlePointerDown = () => {
    if (status !== "completed") {
      setStatus("holding");
    }
  };

  const reset = () => {
    setStatus("inactive");
    setTimer(null);
  };

  return (
    <div className="relative flex h-40 w-full flex-col items-center justify-center gap-4 rounded-lg border border-gray-200 lg:w-[600px]">
      <div className="w-40">
        <Button
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          className={cn(
            "relative w-full! overflow-hidden transition-colors duration-300 select-none",
            status === "completed" && "cursor-default !bg-green-500",
          )}
        >
          <AnimatePresence
            mode="wait"
            initial={status === "inactive" ? false : true}
          >
            {status === "inactive" && (
              <motion.span
                key="claim-button"
                className="relative select-none"
                initial={{ y: 30 }}
                animate={{ y: 0 }}
                exit={{ y: 30 }}
                transition={{ duration: 0.2 }}
              >
                Claim
              </motion.span>
            )}
            {status === "holding" && (
              <div>
                <motion.div
                  key="progress-bar"
                  className="absolute inset-0 bg-neutral-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  exit={{ width: "0%" }}
                  transition={{ duration: HOLD_SECONDS / 2 }}
                />
                <motion.span
                  key="holding-button"
                  className="relative select-none"
                  initial={{ y: 30, scale: 1 }}
                  animate={{ y: 0, scale: 5 }}
                  exit={{ y: 30, scale: 1 }}
                  transition={{ duration: HOLD_SECONDS / 2 }}
                >
                  Hold to Claim
                </motion.span>
              </div>
            )}
            {status === "completed" && (
              <motion.div
                key="completed-button"
                initial={{ y: 30 }}
                animate={{ y: 0 }}
                exit={{ y: 30 }}
                transition={{ duration: 0.2 }}
                className="relative flex items-center gap-2"
              >
                <CheckIcon className="size-4" />
                <motion.span>Completed</motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </div>
      <button
        onClick={reset}
        className="absolute right-2 bottom-2 flex h-8 w-8 items-center justify-center rounded-lg text-black opacity-50 transition-all hover:bg-black/10 hover:opacity-100 focus-visible:opacity-100 dark:hover:bg-black/10"
      >
        <div>
          <UndoIcon className="size-4" />
        </div>
      </button>
    </div>
  );
}
