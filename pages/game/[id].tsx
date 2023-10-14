// pages/game/[id].tsx
import { useRouter } from 'next/router';
import { games } from '../../lib/GamesList';
import { SlotMachine } from '../../components/games';
import { Crash } from '../../components/games';

const componentMap: Record<string, React.ComponentType> = {
  SlotMachine,
  Crash,
  // Add other game components here
};

const GamePage = () => {
  const router = useRouter();
  const { id } = router.query;

  // Find the game based on the ID
  const game = games.find((game) => game.id === id);

  if (!game) {
    return <div>Game not found</div>;
  }

  let GameComponent;
  if (game.gameComponent) {
    GameComponent = componentMap[game.gameComponent];
  }

  return (
    <div className="container mx-auto px-4 sm:px-8 mb-64">
      <div className="py-8">
        <div className="my-2 bg-muted p-8 rounded-lg shadow-md">
        <h2 className="text-2xl leading-tight">
            {game.title}
          </h2>
          <p className="text-md mb-4">
            {game.description}
          </p>
          {GameComponent && <GameComponent />}
        </div>
      </div>
    </div>
  );
};

export default GamePage;
