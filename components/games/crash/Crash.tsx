import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebaseClient";
import { useAddress } from "@thirdweb-dev/react";
import CrashChart from "./CrashChart";
import { Button } from "../../ui/button";
import { useToast } from "../../ui/use-toast";

export const Crash: React.FC = () => {
  const address = useAddress();
  const { toast } = useToast();
  const [coins, setCoins] = useState<number | null>(null);
  const [bet, setBet] = useState(5);
  const [multiplier, setMultiplier] = useState(1);
  const [outcome, setOutcome] = useState<"win" | "loss" | null>(null);
  const [isCrashed, setIsCrashed] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [cashOutMultiplier, setCashOutMultiplier] = useState<number | null>(
    null,
  );
  const [hasCashedOut, setHasCashedOut] = useState(false);

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBet = Number(e.target.value);
    if (newBet >= 1 && newBet <= coins!) {
      setBet(newBet);
    }
  };

  const cashOut = () => {
    if (hasCashedOut) return;
    setHasCashedOut(true);
    const calculatedWinningAmount = bet * multiplier;
    setCashOutMultiplier(multiplier);
    setCoins((prev) => (prev ? prev + calculatedWinningAmount : null));
    setOutcome("win");
    if (address) {
      const userRef = doc(db, "users", address);
      updateDoc(userRef, { coinBalance: coins });
    }
  };

  useEffect(() => {
    const fetchInitialCoins = async () => {
      if (address) {
        const userRef = doc(db, "users", address);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setCoins(userSnap.data().coinBalance);
        }
      }
    };
    fetchInitialCoins();
  }, [address]);

  const startGame = () => {
    setIsStarted(true);
    setHasCashedOut(false);
    setIsCrashed(false);
    setMultiplier(1);
    setCashOutMultiplier(null);
    setOutcome(null);
  };

  useEffect(() => {
    if (!isStarted) return;
    let interval: NodeJS.Timeout;
    if (!isCrashed) {
      interval = setInterval(() => {
        setMultiplier((prev) => prev + 0.01);
      }, 100);

      const crashTime =
        Math.random() <= 0.01 ? 1000 : Math.random() * 59000 + 1000;

      setTimeout(() => {
        clearInterval(interval);
        setIsCrashed(true);
        setIsStarted(false);
        setMultiplier(1);
        if (!hasCashedOut) {
          setOutcome("loss");
          setCoins((prev) => (prev ? prev - bet : null));
          if (address) {
            const userRef = doc(db, "users", address);
            updateDoc(userRef, { coinBalance: coins });
          }
        }
      }, crashTime);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isStarted]);

  useEffect(() => {
    if (outcome) {
      let title, description;

      if (outcome === "win") {
        title = "Congratulations!";
        description = `You've won ${bet * (cashOutMultiplier ?? 1)} coins!`;
      } else if (outcome === "loss" && !hasCashedOut) {
        title = "Game Over";
        description = "You lost. Better luck next time";
      }

      if (title && description) {
        toast({
          title,
          description,
        });
      }
    }
  }, [outcome, bet, cashOutMultiplier, hasCashedOut]);

  return (
    <div className="h-full flex flex-col items-center justify-center bg-background text-foreground">
      <div className="mb-4 p-4 rounded-lg bg-card text-foreground">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">
          Crash Game
        </h1>
        {address ? (
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between">
            <div className="mb-4 md:mb-0">
              <p className="font-semibold text-foreground text-lg">
                Coins: {coins ?? "Loading..."}
              </p>
              <div className="flex items-center mt-2">
                <p className="font-semibold text-foreground text-lg mr-2">
                  Bet:
                </p>
                <input
                  className="w-20 p-2 rounded border"
                  type="number"
                  value={bet}
                  onChange={handleBetChange}
                  min="1"
                  max={coins ?? undefined}
                  disabled={isStarted || coins === null || coins < bet}
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <Button
                onClick={startGame}
                disabled={isStarted || coins === null || coins < bet}
              >
                Start Game
              </Button>
              <Button
                onClick={cashOut}
                disabled={!isStarted || isCrashed || hasCashedOut}
              >
                Cash Out
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center text-xl md:text-2xl font-bold">
            Please sign in to play.
          </div>
        )}
      </div>
      <CrashChart
        multiplier={multiplier}
        isCrashed={isCrashed}
        cashOutMultiplier={cashOutMultiplier}
      />
    </div>
  );
};

export default Crash;
