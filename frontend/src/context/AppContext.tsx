import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { Team } from "../service/teams";

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
    const value = useMemo(() => ({
        teams,
        setTeams,
        selectedTeamId,
        setSelectedTeamId,
        isLoadingTeams,
        setIsLoadingTeams,
    }), [teams, selectedTeamId, isLoadingTeams]);
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useApp must be used within an AppProvider");
    }
    return context;
};