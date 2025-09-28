import AnimatedTabsPage from "./pages/AnimatedTabs";
import AnimatedProfilePicturesPage from "./pages/AnimatedProfilePictures";
import AnimatedClaimButtonPage from "./pages/AnimatedClaimButton";
import AnimatedMacDockPage from "./pages/AnimatedMacDock";
import AnimatedAlbumCoversPage from "./pages/AnimatedAlbumCovers";
import AnimatedRadioControlPage from "./pages/AnimatedRadioControl";
import AnimatedDualChatPage from "./pages/AnimatedDualChat";
import { GithubIcon } from "./components/icons";

function App() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center gap-4 p-4 sm:p-10">
      <div className="flex flex-col items-center justify-center gap-1">
        <h1 className="text-2xl font-bold">Microinteractions</h1>
        <h2 className="max-w-64 text-center text-sm text-gray-500">
          A collection of microinteractions built with React, Tailwind CSS and
          Motion.
        </h2>
        <a
          href="https://github.com/cristianbgp/microinteractions"
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <GithubIcon className="h-4 w-4 transition-transform duration-200 group-hover:scale-150 group-hover:opacity-80" />
        </a>
      </div>
      <AnimatedTabsPage />
      <AnimatedProfilePicturesPage />
      <AnimatedClaimButtonPage />
      <AnimatedRadioControlPage />
      <AnimatedMacDockPage />
      <AnimatedAlbumCoversPage />
      <AnimatedDualChatPage />
      <div className="flex flex-col items-center gap-2">
        <p className="text-sm text-gray-500">
          Made by{" "}
          <a
            href="https://cristianbgp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity duration-200 hover:opacity-80"
          >
            @cristianbgp
          </a>
        </p>
      </div>
    </div>
  );
}

export default App;
