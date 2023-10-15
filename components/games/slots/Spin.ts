import { SpinProps } from "./SlotTypes.d";

export const spin = async ({
  setIsSpinning,
  reelControls,
  setReels,
  settings,
  spinningAudio,
  checkWin,
}: SpinProps) => {
  setIsSpinning(true);

  if (spinningAudio && settings.sounds === "on") {
    spinningAudio.currentTime = 0;
    spinningAudio.play();
  }

  let newReels: number[][] = [];
  for (let i = 0; i < 3; i++) {
    const reelControl = reelControls[i];
    const newRow = Array.from(
      { length: 9 },
      () => Math.floor(Math.random() * 9) + 1,
    );
    newReels.push(newRow);

    reelControl.start({
      y: [-2500, 0],
      transition: { duration: 3.2 + i * 0.5, ease: "easeOut" },
    });
  }

  await Promise.all(reelControls.map((control) => control.stop));
  setReels(newReels);

  setTimeout(() => {
    checkWin(newReels);
    setIsSpinning(false);
  }, 5000);
};
