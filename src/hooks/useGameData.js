import { useQuery } from 'react-query';
import { fetchGameDetails, searchGames } from '../services/GameDataService';

export const useGameDetails = (id) => {
  return useQuery(['gameDetails', id], () => fetchGameDetails(id), {
    enabled: !!id,
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
  });
};

export const useGameSearch = (query) => {
  return useQuery(['gameSearch', query], () => searchGames(query), {
    enabled: query.length > 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false
  });
};
