// components/games/slots/checkwin.tsx
import React from 'react';

type Settings = {
  sounds: string;
  closeModalKey: string;
  spinKey: string;
};

interface CheckWinProps {
  newReels: number[][];
  setOutcome: React.Dispatch<React.SetStateAction<'win' | 'loss' | null>>;
  setCoins: React.Dispatch<React.SetStateAction<number>>;
  bet: number;
  setWinningPositions: React.Dispatch<React.SetStateAction<number[][] | null>>;
  settings: Settings;
  winnerAudio: HTMLAudioElement | null;
  spinningAudio: HTMLAudioElement | null;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  updateCoinsInFirebase: (newCoins: number) => void;
  setWinningAmount: React.Dispatch<React.SetStateAction<number | null>>;
}

export const checkWin = ({
  newReels,
  setOutcome,
  setCoins,
  bet,
  setWinningAmount,
  setWinningPositions,
  settings,
  winnerAudio,
  spinningAudio,
  setShowModal,
  updateCoinsInFirebase,
}: CheckWinProps) => {
  let win = false;
  let newWinningPositions = Array.from({ length: 3 }, () =>
    Array(3).fill(false)
  );

  // Horizontal Lines
  for (let i = 0; i < 3; i++) {
    if (
      newReels[i][0] === newReels[i][1] &&
      newReels[i][1] === newReels[i][2]
    ) {
      win = true;
      newWinningPositions[i] = [true, true, true];
      break;
    }
  }

  // Vertical Lines
  if (!win) {
    for (let i = 0; i < 3; i++) {
      if (
        newReels[0][i] === newReels[1][i] &&
        newReels[1][i] === newReels[2][i]
      ) {
        win = true;
        newWinningPositions[0][i] = true;
        newWinningPositions[1][i] = true;
        newWinningPositions[2][i] = true;
        break;
      }
    }
  }

  // Diagonals
  if (!win) {
    if (
      newReels[0][0] === newReels[1][1] &&
      newReels[1][1] === newReels[2][2]
    ) {
      win = true;
      newWinningPositions = [
        [true, false, false],
        [false, true, false],
        [false, false, true],
      ];
    } else if (
      newReels[0][2] === newReels[1][1] &&
      newReels[1][1] === newReels[2][0]
    ) {
      win = true;
      newWinningPositions = [
        [false, false, true],
        [false, true, false],
        [true, false, false],
      ];
    }
  }

  let winningAmount = 0;
  if (win) {
    winningAmount = 10 * bet;
    setWinningAmount(winningAmount);
    setOutcome("win");
    setShowModal(true);
    setCoins((prevCoins: number) => {
      const newCoins = prevCoins + winningAmount;
      updateCoinsInFirebase(newCoins);
      return newCoins;
    });
    setWinningPositions(newWinningPositions);
    if (settings.sounds === "on" || settings.sounds === "win only") {
      winnerAudio?.play();
    }
  } else {
    setWinningAmount(null);
    setOutcome("loss");
    setShowModal(true);
    setCoins((prevCoins: number) => {
      const newCoins = prevCoins - bet;
      updateCoinsInFirebase(newCoins);
      return newCoins;
    });
    setWinningPositions(null);
    if (settings.sounds === "on") {
      spinningAudio?.pause();
    }
  }
};
