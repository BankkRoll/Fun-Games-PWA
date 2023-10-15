// components/games/slots/slotMachine.tsx
import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { checkWin } from "./CheckWin";
import { spin } from "./Spin";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebaseClient";
import { useAddress } from "@thirdweb-dev/react";
import { Input } from "../../ui/input";
import { useToast } from "../../ui/use-toast";

export const SlotMachine: React.FC = () => {
  const address = useAddress();
  const { toast } = useToast();

  const [coins, setCoins] = useState<number | null>(null);
  const [bet, setBet] = useState(5);
  const [outcome, setOutcome] = useState<"win" | "loss" | null>(null);
  const [winningAmount, setWinningAmount] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winnerAudio, setWinnerAudio] = useState<HTMLAudioElement | null>(null);
  const [spinningAudio, setSpinningAudio] = useState<HTMLAudioElement | null>(
    null,
  );
  const [settings] = useState({
    sounds: "on",
    closeModalKey: "Escape",
    spinKey: "Enter",
  });
  const [reels, setReels] = useState([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]);
  const [winningPositions, setWinningPositions] = useState<number[][] | null>(
    null,
  );

  const reelControls = [useAnimation(), useAnimation(), useAnimation()];

  useEffect(() => {
    const fetchInitialCoins = async () => {
      if (!address) return;
      const userRef = doc(db, "users", address);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) setCoins(userSnap.data().coinBalance);
    };

    setSpinningAudio(new Audio("/slots/spinning.mp3"));
    setWinnerAudio(new Audio("/slots/winner.mp3"));

    fetchInitialCoins();
  }, [address]);

  useEffect(() => {
    if (!outcome) return;

    const title = outcome === "win" ? "Congratulations!" : "Game Over";
    const description =
      outcome === "win"
        ? `You've won ${winningAmount} coins!`
        : "You lost. Better luck next time.";
    toast({ title, description });
  }, [outcome, winningAmount, toast]);

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBet = Number(e.target.value);
    if (newBet >= 1 && newBet <= coins!) setBet(newBet);
  };

  const handleSpin = () => {
    if (!coins || coins < bet) return;

    setWinningPositions(null);
    setIsSpinning(true);

    spin({
      setIsSpinning,
      reelControls,
      setReels,
      settings,
      spinningAudio,
      checkWin: (newReels) =>
        checkWin({
          newReels,
          setOutcome,
          setCoins,
          bet,
          setWinningPositions,
          setWinningAmount,
          settings,
          winnerAudio,
          spinningAudio,
          updateCoinsInFirebase: (newCoins) => {
            if (!address) return;
            const userRef = doc(db, "users", address);
            updateDoc(userRef, { coinBalance: newCoins });
          },
        }),
    });
  };

  return (
    <>
      <div className="h-full flex flex-col items-center justify-center bg-background text-foreground">
        <div className="mb-4 p-4 rounded-lg bg-card text-foreground">
          <h1 className="text-2xl font-bold mb-4 text-center">Slot Machine</h1>
          {address ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">
                  Coins: {coins ?? "Loading..."}
                </p>
                <div className="flex items-center">
                  <p className="font-semibold text-foreground mr-2">Bet:</p>
                  <Input
                    type="number"
                    value={bet}
                    onChange={handleBetChange}
                    min="1"
                    max={coins ?? undefined}
                    disabled={isSpinning || coins === null || coins < bet}
                  />
                </div>
              </div>
              <button
                className={`${
                  coins !== null && coins >= bet && !isSpinning
                    ? "bg-primary text-secondary"
                    : "bg-muted "
                }  p-2 rounded text-primary`}
                onClick={handleSpin}
                disabled={isSpinning || coins === null || coins < bet}
              >
                Spin
              </button>
            </div>
          ) : (
            <div className="text-center text-2xl font-bold">
              Please sign in to play.
            </div>
          )}
        </div>

        <div className="relative flex items-center justify-center w-full min-h-[50vh] bg-card">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="overflow-hidden mt-10 h-[195px] sm:h-[240px] md:h-[242px] lg:h-[385px] xl:h-[435px]">
              <div className="grid grid-cols-3 mx-auto gap-x-2 sm:gap-x-3 xl:gap-x-5">
                {" "}
                {reelControls.map((control, idx) => (
                  <motion.div key={idx} animate={control}>
                    {Array.from({ length: 10 }, (_, k) => k).map((k) =>
                      reels[idx].map((value, index) => (
                        <div
                          key={`${k}-${index}`}
                          className={`bg-secondary w-16 h-16 sm:w-20 sm:h-20 md:w-26 md:h-26 lg:w-32 lg:h-32 xl:w-36 xl:h-36 flex items-center justify-center`}
                        >
                          <img
                            src={`/slot${value}.png`}
                            alt={`Image ${value}`}
                            className={`object-cover ${
                              winningPositions && winningPositions[idx][index]
                                ? "goldenGlow"
                                : ""
                            }`}
                          />
                        </div>
                      )),
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
