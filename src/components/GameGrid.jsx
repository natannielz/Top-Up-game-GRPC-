import GameCard from './GameCard';
import GameStoreCard from './GameStoreCard';
import { useData } from '../context/DataContext'; // Updated to use Context
import './GameGrid.css';

const GameGrid = ({ activeTab = 'TOPUP' }) => {
  const { games } = useData();
  const filteredGames = games.filter(g => g.type === activeTab);

  if (activeTab === 'GAME') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {filteredGames.map((game) => (
          <GameStoreCard key={game.id} game={game} />
        ))}
      </div>
    );
  }

  // Default TOPUP Grid
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
      {filteredGames.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
};

export default GameGrid;
