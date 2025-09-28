import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Volume2Icon, PowerIcon, VolumeIcon, Volume1Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

// Simplified radio stations
const radioStations = [
  { frequency: 92.3, name: "Rock" },
  { frequency: 95.5, name: "Pop" },
  { frequency: 98.7, name: "Jazz" },
  { frequency: 101.1, name: "News" },
];

export default function AnimatedRadioControlPage() {
  const [isOn, setIsOn] = useState(false);
  const [frequency, setFrequency] = useState(90.0);
  const [volume, setVolume] = useState(60);

  // Find current station
  const currentStation = radioStations.find(
    (station) => Math.abs(station.frequency - frequency) < 1.0,
  );

  const handleFrequencyChange = (value: number[]) => {
    const newFrequency = 90 + (value[0] / 100) * (105 - 90);
    setFrequency(Math.round(newFrequency * 10) / 10);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const handleTunerScroll = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.5 : 0.5;
    setFrequency((prev) => Math.max(90, Math.min(105, prev + delta)));
  };

  return (
    <div className="relative flex min-h-40 w-full flex-col items-center justify-center gap-4 rounded-lg border border-gray-200 p-4 lg:w-[600px]">
      <div className="h-42 w-42 rounded-2xl bg-black p-2 shadow-xl">
        {/* Header */}
        <div className="mb-2 flex items-center justify-between">
          <motion.div
            className="text-xs font-medium text-green-400"
            animate={{ opacity: isOn ? 1 : 0.3 }}
          >
            FM
          </motion.div>

          <motion.button
            className={cn(
              "flex h-4 w-4 items-center cursor-pointer justify-center rounded-full",
              isOn ? "bg-green-500" : "bg-gray-600",
            )}
            onClick={() => setIsOn(!isOn)}
            whileTap={{ scale: 0.9 }}
          >
            <PowerIcon className="h-2.5 w-2.5 text-white" />
          </motion.button>
        </div>

        {/* Frequency Display */}
        <motion.div
          className="mb-2 text-center"
          animate={{ opacity: isOn ? 1 : 0.3 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="font-mono text-base text-white"
            key={frequency}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.15 }}
          >
            {frequency.toFixed(1)}
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStation?.name}
              className="h-4 text-lg text-gray-400"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: currentStation ? 1 : 0, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              {currentStation?.name}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Tuner */}
        <div className="relative mb-2" onWheel={handleTunerScroll}>
          {/* Station dots */}
          {radioStations.map((station) => (
            <motion.div
              key={station.frequency}
              className="pointer-events-none absolute top-1/2 z-10 h-0.5 w-0.5 -translate-y-1/2 rounded-full"
              style={{
                left: `${((station.frequency - 90) / (105 - 90)) * 100}%`,
              }}
              animate={{
                backgroundColor:
                  Math.abs(station.frequency - frequency) < 1.0
                    ? "#10b981"
                    : "#9ca3af",
                scale: Math.abs(station.frequency - frequency) < 1.0 ? 4 : 1,
              }}
              transition={{ duration: 0.2 }}
            />
          ))}

          <Slider
            value={[((frequency - 90) / (105 - 90)) * 100]}
            onValueChange={handleFrequencyChange}
            max={100}
            step={1}
            className={cn(
              "h-10 w-full transition-colors duration-200 ease-in-out [&_[data-slot=slider-range]]:bg-neutral-700 [&_[data-slot=slider-thumb]]:!size-5 [&_[data-slot=slider-thumb]]:border-gray-300 [&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-track]]:bg-gray-700",
              Math.abs((currentStation?.frequency || 0) - frequency) < 1.0 &&
                "[&_[data-slot=slider-thumb]]:!bg-[#10b981]",
            )}
          />
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-1.5">
          <AnimatePresence mode="wait">
            {volume === 0 && (
              <motion.div
                key="volume-icon"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.1 }}
              >
                <VolumeIcon className="h-2.5 w-2.5 text-gray-400" />
              </motion.div>
            )}
            {volume > 0 && volume < 50 && (
              <motion.div
                key="volume-1-icon"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.1 }}
              >
                <Volume1Icon className="h-2.5 w-2.5 text-gray-400" />
              </motion.div>
            )}
            {volume >= 50 && (
              <motion.div
                key="volume-2-icon"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.1 }}
              >
                <Volume2Icon className="h-2.5 w-2.5 text-gray-400" />
              </motion.div>
            )}
          </AnimatePresence>

          <Slider
            value={[volume]}
            onValueChange={handleVolumeChange}
            max={100}
            step={5}
            className="h-4 flex-1 [&_[data-slot=slider-range]]:bg-green-500 [&_[data-slot=slider-thumb]]:!size-4 [&>*[data-slot=slider-thumb]]:border-gray-300 [&>*[data-slot=slider-thumb]]:bg-white [&>*[data-slot=slider-track]]:h-1 [&>*[data-slot=slider-track]]:bg-gray-700"
          />

          <span className="w-4 text-right text-xs text-gray-400">
            {Math.round(volume / 10)}
          </span>
        </div>

        {/* Signal indicator */}
        <motion.div
          className="mt-1 flex justify-center gap-0.5"
          animate={{ opacity: isOn && currentStation ? 1 : 0.5 }}
        >
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-0.5 rounded-full bg-green-400"
              animate={{
                height:
                  isOn && Boolean(currentStation?.name)
                    ? ["2px", "8px", "2px"]
                    : ["2px", "2px", "2px"],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
