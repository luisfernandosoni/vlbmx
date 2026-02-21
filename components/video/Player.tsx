"use client";

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';

interface PlayerProps {
  src: string;
  title?: string;
  poster?: string;
  className?: string; // Additional Tailwind styling if needed
}

export default function Player({ src, title, poster, className = "" }: PlayerProps) {
  return (
    <div className={`w-full overflow-hidden rounded-2xl border border-zinc-800 shadow-2xl shadow-black/50 ${className}`}>
      <MediaPlayer 
        src={src} 
        title={title} 
        poster={poster}
        viewType="video"
        streamType="on-demand"
        crossOrigin
      >
        <MediaProvider />
        {/* We use the default layout but hook into its CSS via globals to enforce our dark theme */}
        <DefaultVideoLayout 
            icons={defaultLayoutIcons} 
            colorScheme="dark"
            slots={{
               // Optional: We can inject custom UI into player slots later
            }}
        />
      </MediaPlayer>
    </div>
  );
}
