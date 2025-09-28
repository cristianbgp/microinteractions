import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  PlayIcon,
  PauseIcon,
  HeartIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import {
  dataImg,
  dtmfImg,
  lastSummerImg,
  loveMeLoveMeNotImg,
  quienTraeLasCornetasImg,
} from "@/assets/images";
import { cn } from "@/lib/utils";

const albumsData = [
  {
    id: 1,
    title: "Data",
    artist: "Tainy",
    image: dataImg,
  },
  {
    id: 2,
    title: "Debí tirar más fotos",
    artist: "Bad Bunny",
    image: dtmfImg,
  },
  {
    id: 3,
    title: "Last Summer",
    artist: "Barnes Blvd.",
    image: lastSummerImg,
  },
  {
    id: 4,
    title: "Love Me / Love Me Not",
    artist: "HONNE",
    image: loveMeLoveMeNotImg,
  },
  {
    id: 5,
    title: "¿Quién trae las cornetas?",
    artist: "Rawayana",
    image: quienTraeLasCornetasImg,
  },
];

export default function AnimatedAlbumCoversPage() {
  const [hoveredAlbum, setHoveredAlbum] = useState<number | null>(null);
  const [playingAlbum, setPlayingAlbum] = useState<number | null>(null);
  const [likedAlbums, setLikedAlbums] = useState<Set<number>>(new Set());

  const togglePlay = (albumId: number) => {
    setPlayingAlbum(playingAlbum === albumId ? null : albumId);
  };

  const toggleLike = (albumId: number) => {
    const newLiked = new Set(likedAlbums);
    if (newLiked.has(albumId)) {
      newLiked.delete(albumId);
    } else {
      newLiked.add(albumId);
    }
    setLikedAlbums(newLiked);
  };

  return (
    <div className="relative flex min-h-40 w-full flex-col items-center justify-center gap-4 rounded-lg border border-gray-200 lg:w-[600px]">
      <div className="grid grid-cols-3 gap-4 p-4 md:grid-cols-5">
        {albumsData.map((album, index) => (
          <motion.div
            key={album.id}
            className="group relative cursor-pointer"
            onMouseEnter={() => setHoveredAlbum(album.id)}
            onMouseLeave={() => setHoveredAlbum(null)}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              type: "spring",
              stiffness: 100,
            }}
            whileHover={{
              scale: 1.05,
              y: -8,
              transition: { duration: 0.2 },
            }}
          >
            {/* Album Cover Container */}
            <div className="relative overflow-hidden rounded-xl shadow-lg">
              <motion.img
                src={album.image}
                alt={`${album.title} by ${album.artist}`}
                className="aspect-square w-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              />

              {/* Overlay with controls */}
              <AnimatePresence>
                {hoveredAlbum === album.id && (
                  <motion.div
                    className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Play/Pause Button */}
                    <motion.button
                      className="absolute top-1/2 left-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow-lg backdrop-blur-sm transition-colors hover:bg-white"
                      onClick={() => togglePlay(album.id)}
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 90 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {playingAlbum === album.id ? (
                        <PauseIcon className="size-4" />
                      ) : (
                        <PlayIcon className="ml-0.5 size-4" />
                      )}
                    </motion.button>

                    {/* Action Buttons */}
                    <div className="absolute bottom-3 left-3 flex gap-2">
                      <motion.button
                        className={cn(
                          "flex size-4 items-center justify-center rounded-full backdrop-blur-sm transition-colors",
                          likedAlbums.has(album.id)
                            ? "bg-red-500 text-white"
                            : "bg-white/20 text-white hover:bg-white/30",
                        )}
                        onClick={() => toggleLike(album.id)}
                        initial={{ scale: 0, x: -20 }}
                        animate={{ scale: 1, x: 0 }}
                        exit={{ scale: 0, x: -20 }}
                        transition={{ delay: 0.1 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <HeartIcon
                          className={cn(
                            "size-2",
                            likedAlbums.has(album.id) ? "fill-current" : "",
                          )}
                        />
                      </motion.button>

                      <motion.button
                        className="flex size-4 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                        initial={{ scale: 0, x: -20 }}
                        animate={{ scale: 1, x: 0 }}
                        exit={{ scale: 0, x: -20 }}
                        transition={{ delay: 0.15 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <MoreHorizontalIcon className="size-2" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Playing Indicator */}
              <AnimatePresence>
                {playingAlbum === album.id && (
                  <motion.div
                    className="absolute right-2 bottom-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1 rounded-full bg-green-500"
                          animate={{
                            height: ["4px", "12px", "4px"],
                          }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: i * 0.1,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Album Info */}
            <motion.div
              className="mt-3 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              <h3 className="truncate text-sm font-semibold text-gray-900">
                {album.title}
              </h3>
              <p className="truncate text-xs text-gray-600">{album.artist}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
