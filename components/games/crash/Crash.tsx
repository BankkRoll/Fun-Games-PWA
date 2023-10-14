import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebaseClient';
import { useAddress } from '@thirdweb-dev/react';
import OutcomeModal from '../ResultsModal';
import CrashChart from './CrashChart';
import { Button } from '../../ui/button';

export const Crash: React.FC = () => {
  const address = useAddress();
  const [coins, setCoins] = useState<number | null>(null);
  const [bet, setBet] = useState(5);
  const [multiplier, setMultiplier] = useState(1);
  const [outcome, setOutcome] = useState<'win' | 'loss' | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isCrashed, setIsCrashed] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [winningAmount, setWinningAmount] = useState<number | null>(null);

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBet = Number(e.target.value);
    if (newBet >= 1 && newBet <= coins!) {
      setBet(newBet);
    }
  };

  const cashOut = () => {
    const calculatedWinningAmount = bet * multiplier;
    setWinningAmount(calculatedWinningAmount);
    setCoins((prev) => (prev ? prev + calculatedWinningAmount : null));
    setIsStarted(false);
    setMultiplier(1);
    setIsCrashed(false);
    setOutcome('win');
    setShowModal(true);
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
    setIsCrashed(false);
    setMultiplier(1);
  };

  useEffect(() => {
    if (!isStarted) return;
    let interval: NodeJS.Timeout;
    if (!isCrashed) {
      interval = setInterval(() => {
        setMultiplier((prev) => prev + 0.01);
      }, 100);
  
      const crashTime = Math.random() * 59000 + 1000; // Random time between 1 second and 1 minute

      setTimeout(() => {
        clearInterval(interval);
        setIsCrashed(true);
        setIsStarted(false);
        setMultiplier(1);
        setOutcome('loss');
        setShowModal(true);
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

  return (
    <>
      <OutcomeModal
        show={showModal}
        outcome={outcome ?? 'loss'}
        onClose={() => setShowModal(false)}
        winningAmount={winningAmount}
        closeModalKey={"Escape"}
      />
      <div className="h-full flex flex-col items-center justify-center bg-background text-foreground">
        <div className="mb-4 p-4 rounded-lg bg-card text-foreground">
          <h1 className="text-2xl font-bold mb-4 text-center">Crash Game</h1>
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
                disabled={!isStarted || isCrashed}
              >
                Cash Out
              </Button>
            </div>
          </div>
        </div>
        <CrashChart multiplier={multiplier} isCrashed={isCrashed} />
      </div>
    </>
  );
};

export default Crash;
