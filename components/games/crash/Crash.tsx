import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebaseClient';
import { useAddress } from '@thirdweb-dev/react';
import CrashChart from './CrashChart';
import { Button } from '../../ui/button';
import { useToast } from '../../ui/use-toast';

export const Crash: React.FC = () => {
  const address = useAddress();
  const { toast } = useToast();
  const [coins, setCoins] = useState<number | null>(null);
  const [bet, setBet] = useState(5);
  const [multiplier, setMultiplier] = useState(1);
  const [outcome, setOutcome] = useState<'win' | 'loss' | null>(null);
  const [isCrashed, setIsCrashed] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [winningAmount, setWinningAmount] = useState<number | null>(null);
  const [cashOutMultiplier, setCashOutMultiplier] = useState<number | null>(null);
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
    setWinningAmount(calculatedWinningAmount);
    setCoins((prev) => (prev ? prev + calculatedWinningAmount : null));
    setOutcome('win');
    if (address) {
      const userRef = doc(db, 'users', address);
      updateDoc(userRef, { coinBalance: coins });
    }
  };

  useEffect(() => {
    const fetchInitialCoins = async () => {
      if (address) {
        const userRef = doc(db, 'users', address);
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
  };

  useEffect(() => {
    if (!isStarted) return;
    let interval: NodeJS.Timeout;
    if (!isCrashed) {
      interval = setInterval(() => {
        setMultiplier((prev) => prev + 0.01);
      }, 100);

      const crashTime = Math.random() * 59000 + 1000;

      setTimeout(() => {
        clearInterval(interval);
        setIsCrashed(true);
        setIsStarted(false);
        setMultiplier(1);
        setOutcome('loss');
        setCoins((prev) => (prev ? prev - bet : null));
        if (address) {
          const userRef = doc(db, 'users', address);
          updateDoc(userRef, { coinBalance: coins });
        }
      }, crashTime);
    }
  
    return () => {
      clearInterval(interval);
    };
  }, [isStarted]);

  useEffect(() => {
    if (outcome) {
      const title = outcome === 'win' ? 'Congratulations!' : 'Game Over';
      const description = outcome === 'win'
        ? `You've won ${winningAmount} coins!`
        : 'You lost. Better luck next time.';

      toast({
        title,
        description,
      });
    }
  }, [outcome]);

  return (
    <div className="h-full flex flex-col items-center justify-center bg-background text-foreground">
      <div className="mb-4 p-4 rounded-lg bg-card text-foreground">
        <h1 className="text-2xl font-bold mb-4 text-center">Crash Game</h1>
        {address ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground">Coins: {coins ?? 'Loading...'}</p>
              <div className="flex items-center">
                <p className="font-semibold text-foreground mr-2">Bet:</p>
                <input
                  type="number"
                  value={bet}
                  onChange={handleBetChange}
                  min="1"
                  max={coins ?? undefined}
                  disabled={isStarted || coins === null || coins < bet}
                />
              </div>
            </div>
            <div>
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
          <div className="text-center text-2xl font-bold">
            Please sign in to play.
          </div>
        )}
      </div>
      <CrashChart multiplier={multiplier} isCrashed={isCrashed} cashOutMultiplier={cashOutMultiplier} />
    </div>
  );
};

export default Crash;
