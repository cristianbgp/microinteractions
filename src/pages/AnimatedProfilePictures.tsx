import { cn } from "@/lib/utils";
import {
  motionImg,
  reactImg,
  codeableImg,
  cristianbgpImg,
} from "../assets/images";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const images = [motionImg, reactImg, codeableImg, cristianbgpImg];

export default function AnimatedProfilePicturesPage() {
  const [status, setStatus] = useState<"inactive" | "active">("inactive");

  return (
    <div className="flex h-40 w-full flex-col items-center justify-center gap-4 rounded-lg border border-gray-200 lg:w-[600px]">
      <div
        className="relative flex items-center justify-center gap-2 p-2"
        onMouseEnter={() => setStatus("active")}
        onMouseLeave={() => setStatus("inactive")}
      >
        {images.map((image, index) => (
          <motion.img
            key={image}
            initial={false}
            src={image}
            alt="profile"
            className={cn(
              "flex size-10 items-center justify-center rounded-full will-change-transform",
            )}
            style={{
              zIndex: 10 * (index + 1),
            }}
            animate={status}
            variants={{
              inactive: { filter: "blur(10px)" },
              active: { filter: "blur(0px)" },
            }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          />
        ))}
      </div>
      <Button
        onClick={() => setStatus(status === "inactive" ? "active" : "inactive")}
        className="min-w-24 overflow-hidden select-none"
      >
        <AnimatePresence mode="wait" initial={false}>
          {status === "inactive" ? (
            <motion.span
              key="reveal-button"
              initial={{ y: 30 }}
              animate={{ y: 0 }}
              exit={{ y: 30 }}
              transition={{ duration: 0.2 }}
              className="select-none"
            >
              Reveal
            </motion.span>
          ) : (
            <motion.span
              key="hide-button"
              initial={{ y: 30 }}
              animate={{ y: 0 }}
              exit={{ y: 30 }}
              transition={{ duration: 0.2 }}
              className="select-none"
            >
              Hide
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </div>
  );
}
