export type Outcome = "win" | "loss" | null;
export type Reel = number[];
export type Reels = Reel[];
export type WinningPositions = number[][] | null;
export type Coins = number | null;
export type Bet = number;
export type WinningAmount = number | null;
export type AudioElement = HTMLAudioElement | null;

export interface Settings {
  sounds: string;
  closeModalKey: string;
  spinKey: string;
}

export interface CheckWinProps {
  newReels: Reels;
  setOutcome: React.Dispatch<React.SetStateAction<Outcome>>;
  setCoins: React.Dispatch<React.SetStateAction<Coins>>;
  bet: Bet;
  setWinningPositions: React.Dispatch<React.SetStateAction<WinningPositions>>;
  settings: Settings;
  winnerAudio: AudioElement;
  spinningAudio: AudioElement;
  updateCoinsInFirebase: (newCoins: number) => void;
  setWinningAmount: React.Dispatch<React.SetStateAction<WinningAmount>>;
}

export interface SpinProps {
  setIsSpinning: React.Dispatch<React.SetStateAction<boolean>>;
  reelControls: ReturnType<typeof useAnimation>[];
  setReels: React.Dispatch<React.SetStateAction<number[][]>>;
  settings: { sounds: string };
  spinningAudio: HTMLAudioElement | null;
  checkWin: (newReels: number[][]) => void;
}

export interface SlotMachineProps {
  address: string | null;
  coins: Coins;
  bet: Bet;
  outcome: Outcome;
  isSpinning: boolean;
  winnerAudio: AudioElement;
  settings: Settings;
  winningAmount: WinningAmount;
  reelControls: ReturnType<typeof import("framer-motion").useAnimation>[];
  winningPositions: WinningPositions;
  spinningAudio: AudioElement;
  reels: Reels;
}
