import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useState, useRef, useCallback } from "react";

// Mock dock icons - in a real app these would be actual app icons
const dockItems = [
  { id: "finder", name: "Finder", color: "bg-blue-400", emoji: "📁" },
  { id: "safari", name: "Safari", color: "bg-blue-300", emoji: "🌐" },
  { id: "mail", name: "Mail", color: "bg-indigo-300", emoji: "✉️" },
  { id: "photos", name: "Photos", color: "bg-yellow-400", emoji: "📸" },
  { id: "music", name: "Music", color: "bg-red-400", emoji: "🎵" },
  { id: "calendar", name: "Calendar", color: "bg-red-300", emoji: "📅" },
  { id: "notes", name: "Notes", color: "bg-yellow-300", emoji: "📝" },
  { id: "settings", name: "Settings", color: "bg-gray-400", emoji: "⚙️" },
];

const mobileDockItems = [
  { id: "finder", name: "Finder", color: "bg-blue-400", emoji: "📁" },
  { id: "safari", name: "Safari", color: "bg-blue-300", emoji: "🌐" },
  { id: "mail", name: "Mail", color: "bg-indigo-300", emoji: "✉️" },
  { id: "photos", name: "Photos", color: "bg-yellow-400", emoji: "📸" },
];

export default function AnimatedMacDockPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const getClosestIconIndex = useCallback(
    (x: number, _y: number) => {
      if (!dockRef.current) return null;

      const dockRect = dockRef.current.getBoundingClientRect();
      const items = isMobile ? mobileDockItems : dockItems;
      const itemWidth = dockRect.width / items.length;
      const relativeX = x - dockRect.left;

      if (relativeX < 0 || relativeX > dockRect.width) return null;

      return Math.floor(relativeX / itemWidth);
    },
    [isMobile],
  );

  const getScale = (index: number) => {
    const activeIndex = isMobile ? hoveredIndex : hoveredIndex;
    if (activeIndex === null) return 1;

    const distance = Math.abs(index - activeIndex);

    if (distance === 0) return 1.55; // Active item - slightly larger
    if (distance === 1) return 1.3; // Adjacent items
    if (distance === 2) return 1.1; // Items 2 positions away
    if (distance === 3) return 1.0; // Items 3 positions away - subtle effect

    return 1; // Default size
  };

  const getTranslateY = (index: number) => {
    const activeIndex = isMobile ? hoveredIndex : hoveredIndex;
    if (activeIndex === null) return 0;

    const distance = Math.abs(index - activeIndex);

    if (distance === 0) return -24; // Active item lifts up more
    if (distance === 1) return -12; // Adjacent items lift
    if (distance === 2) return -6; // Items 2 positions away lift a bit
    if (distance === 3) return -2; // Items 3 positions away lift slightly

    return 0; // Default position
  };

  return (
    <div className="relative flex h-40 w-full flex-col items-center justify-center gap-4 rounded-lg border border-gray-200 lg:w-[600px]">
      <div
        ref={dockRef}
        className="flex items-end gap-5 rounded-2xl border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur-md"
        onMouseLeave={() => !isMobile && setHoveredIndex(null)}
        onTouchStart={(e) => {
          if (isMobile) {
            const touch = e.touches[0];
            const closestIndex = getClosestIconIndex(
              touch.clientX,
              touch.clientY,
            );
            setHoveredIndex(closestIndex);
          }
        }}
        onTouchMove={(e) => {
          if (isMobile) {
            e.preventDefault();
            const touch = e.touches[0];
            const closestIndex = getClosestIconIndex(
              touch.clientX,
              touch.clientY,
            );
            setHoveredIndex(closestIndex);
          }
        }}
        onTouchEnd={() => {
          if (isMobile) {
            setHoveredIndex(null);
          }
        }}
      >
        {(isMobile ? mobileDockItems : dockItems).map((item, index) => (
          <motion.div
            key={item.id}
            className="relative flex flex-col items-center"
            onMouseEnter={() => !isMobile && setHoveredIndex(index)}
            animate={{
              scale: getScale(index),
              y: getTranslateY(index),
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 25,
              mass: 0.8,
            }}
          >
            {/* Tooltip */}
            <motion.div
              className="absolute -top-7 rounded-md bg-black/80 px-2 py-1 text-[8px] text-white"
              initial={{ opacity: 0, y: 5 }}
              animate={{
                opacity: hoveredIndex === index ? 1 : 0,
                y: hoveredIndex === index ? 0 : 5,
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
                mass: 0.5,
              }}
            >
              {item.name}
            </motion.div>

            {/* Dock Icon */}
            <div
              className={cn(
                "flex size-10 cursor-pointer items-center justify-center rounded-xl text-xl shadow-lg transition-shadow hover:shadow-xl",
                item.color,
              )}
            >
              {item.emoji}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
