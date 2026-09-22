import { useContext } from 'react';
import { HouseholdContext } from '../context/HouseholdContext';

export function useHousehold() {
  const context = useContext(HouseholdContext);

  if (context === undefined) {
    throw new Error('useHousehold doit être utilisé à l\'intérieur d\'un HouseholdProvider');
  }

  return context;
}
