import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebaseClient";
import { useAddress } from "@thirdweb-dev/react";
import { Button } from "../../ui/button";
import { useToast } from "../../ui/use-toast";

export const Plinko: React.FC = () => {
  const address = useAddress();
  const { toast } = useToast();
  const [coins, setCoins] = useState<number | null>(null);
  const [bet, setBet] = useState(5);
  const [outcome, setOutcome] = useState<"win" | "loss" | null>(null);
  const [isStarted, setIsStarted] = useState(false);

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBet = Number(e.target.value);
    if (newBet >= 1 && newBet <= coins!) {
      setBet(newBet);
    }
  };

  const startGame = () => {
    setIsStarted(true);
    setOutcome(null);
    //TODO: Update outcome and coins based on game result
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

  useEffect(() => {
    if (outcome) {
      let title, description;
      if (outcome === "win") {
        title = "Congratulations!";
        description = `You've won ${bet * 2} coins!`; //TODO: integrate real multiplier
      } else {
        title = "Game Over";
        description = "You lost. Better luck next time";
      }
      toast({
        title,
        description,
      });
    }
  }, [outcome, bet]);

  return (
    <div className="h-full flex flex-col items-center justify-center bg-background text-foreground">
      <div className="mb-4 p-4 rounded-lg bg-card text-foreground">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center">
          Plinko Game
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
            </div>
          </div>
        ) : (
          <div className="text-center text-xl md:text-2xl font-bold">
            Please sign in to play.
          </div>
        )}
      </div>
      {/*//TODO: implement plinko board component */}
    </div>
  );
};

export default Plinko;
