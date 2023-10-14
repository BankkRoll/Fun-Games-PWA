// components/games/slots/spin.ts
import { useAnimation } from "framer-motion";
import React from "react";

interface SpinProps {
  setIsSpinning: React.Dispatch<React.SetStateAction<boolean>>;
  reelControls: ReturnType<typeof useAnimation>[];
  setReels: React.Dispatch<React.SetStateAction<number[][]>>;
  settings: { sounds: string };
  spinningAudio: HTMLAudioElement | null;
  checkWin: (newReels: number[][]) => void;
}

export const spin = async ({
  setIsSpinning,
  reelControls,
  setReels,
  settings,
  spinningAudio,
  checkWin,
}: SpinProps) => {
  setIsSpinning(true);

  // Reset and play the spinning audio
  if (spinningAudio && settings.sounds === "on") {
    spinningAudio.currentTime = 0;
    spinningAudio.play();
  }

  let newReels: number[][] = [];
  for (let i = 0; i < 3; i++) {
    const reelControl = reelControls[i];
    const newRow = Array.from(
      { length: 9 },
      () => Math.floor(Math.random() * 9) + 1
    );
    newReels.push(newRow);

    reelControl.start({
      y: [-2500, 0],
      transition: { duration: 3.2 + i * 0.5, ease: "easeOut" },
    });
  }

  await Promise.all(reelControls.map((control) => control.stop));
  setReels(newReels);

  // Delay win message and sound
  setTimeout(() => {
    checkWin(newReels);
    setIsSpinning(false);
  }, 5000);
};
