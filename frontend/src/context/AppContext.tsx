import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { Team } from "../types/team";

type AppContextValue = {
  teams: Team[];
  setTeams: Dispatch<SetStateAction<Team[]>>;
  selectedTeamId: string;
  setSelectedTeamId: Dispatch<SetStateAction<string>>;
  isLoadingTeams: boolean;
  setIsLoadingTeams: Dispatch<SetStateAction<boolean>>;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [isLoadingTeams, setIsLoadingTeams] = useState<boolean>(false);

  const value = useMemo(
    () => ({
      teams,
      setTeams,
      selectedTeamId,
      setSelectedTeamId,
      isLoadingTeams,
      setIsLoadingTeams,
    }),
    // useState setters (setTeams/setSelectedTeamId/setIsLoadingTeams) are
    // stable across renders, so they don't belong in the dep array.
    [teams, selectedTeamId, isLoadingTeams],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components -- co-located hook keeps consumers' import paths short
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
