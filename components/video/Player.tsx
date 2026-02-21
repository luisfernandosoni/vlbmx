"use client";

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';

interface PlayerProps {
  src: string;
  title?: string;
  poster?: string;
  className?: string;
}

export default function Player({ src, title, poster, className = "" }: PlayerProps) {
  return (
    // @ui-ux-pro-max: aspect-video prevents CLS (Cumulative Layout Shift) on mobile
    <div className={`w-full aspect-video overflow-hidden rounded-2xl border border-zinc-800 shadow-2xl shadow-black/50 ${className}`}>
      <MediaPlayer
        src={src}
        title={title}
        poster={poster}
        viewType="video"
        streamType="on-demand"
        crossOrigin
        playsInline  // @mobile-design: Critical for iOS — prevents native fullscreen hijack
      >
        <MediaProvider />
        {/* @ui-ux-pro-max: DefaultVideoLayout enforces dark theme */}
        <DefaultVideoLayout
          icons={defaultLayoutIcons}
          colorScheme="dark"
        />
      </MediaPlayer>
    </div>
  );
}
