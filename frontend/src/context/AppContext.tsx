import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { Team } from "../service/teams";

type AppContextValue = {
    teams: Team[];
    setTeams: (teams: Team[]) => void;
    selectedTeamId: string;
    setSelectedTeamId: (selectedTeamId: string) => void;
    isLoadingTeams: boolean;
    setIsLoadingTeams: (isLoadingTeams: boolean) => void;
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

export const useApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useApp must be used within an AppProvider");
    }
    return context;
};