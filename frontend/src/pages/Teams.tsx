import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { createTeam, getTeams } from "../services/teams";
import type { Team, TeamForm, TeamRole } from "../types/team";
import ChooseTeamSection from "../components/Teams/ChooseTeamSection";
import CreateTeamSection from "../components/Teams/CreateTeamSection";
import TeamsHeader from "../components/Teams/TeamsHeader";
import { useAppContext } from "../context/AppContext";
import PageShell from "../components/Ui/PageShell";

const Teams = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const {
    teams,
    setTeams,
    selectedTeamId,
    setSelectedTeamId,
    isLoadingTeams,
    setIsLoadingTeams,
  } = useAppContext();
  const [isChoosing] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [teamForm, setTeamForm] = useState<TeamForm>({
    name: "",
    description: "",
  });

  const actor = useMemo(
    () => ({
      id: session?.userId ?? "",
      email: session?.email ?? "",
      role: (session?.role ?? "user") as TeamRole,
    }),
    [session?.email, session?.role, session?.userId],
  );

  const handleChooseTeam = (teamId: string) => {
    if (!teamId) return;
    navigate(`/tasks/team/${teamId}`);
  };

  const myTeamId = session?.teamId ?? null;

  const handleOpenMyTeam = () => {
    if (!myTeamId) return;
    navigate(`/tasks/team/${myTeamId}`);
  };

  const isAlreadyOnTeam = Boolean(session?.teamId);

  const handleCreateTeam = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isAlreadyOnTeam) {
      toast.error("You are already on a team. Leave it before creating a new one.");
      return;
    }
    if (!teamForm.name.trim()) {
      toast.error("Team name is required.");
      return;
    }
    setIsCreating(true);
    try {
      const createdTeam = await createTeam({
        name: teamForm.name.trim(),
        description: teamForm.description.trim() || "No description provided",
        creators: [{ id: actor.id, role: actor.role }],
      });
      setTeams((previous: Team[]) => [
        createdTeam,
        ...previous.filter((team: Team) => team.id !== createdTeam.id),
      ]);
      setSelectedTeamId(createdTeam.id);
      setTeamForm({ name: "", description: "" });
      toast.success("Team created successfully.");
    } catch {
      toast.error("Failed to create team.");
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const loadTeams = async () => {
      setIsLoadingTeams(true);
      try {
        const fetchedTeams = await getTeams();
        if (controller.signal.aborted) return;
        setTeams(fetchedTeams);
        setSelectedTeamId(fetchedTeams[0]?.id ?? "");
      } catch {
        if (controller.signal.aborted) return;
        toast.error("Failed to load teams.");
      } finally {
        if (!controller.signal.aborted) setIsLoadingTeams(false);
      }
    };

    void loadTeams();
    return () => controller.abort();
    // setTeams / setSelectedTeamId / setIsLoadingTeams from useState are
    // stable; including them here would re-run the effect every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageShell>
      <TeamsHeader />
      <ChooseTeamSection
        teams={teams}
        selectedTeamId={selectedTeamId}
        onSelectedTeamChange={setSelectedTeamId}
        isLoadingTeams={isLoadingTeams}
        isChoosing={isChoosing}
        onOpenTeam={(teamId) => void handleChooseTeam(teamId)}
        myTeamId={myTeamId}
        onOpenMyTeam={handleOpenMyTeam}
      />
      <CreateTeamSection
        teamForm={teamForm}
        isCreating={isCreating}
        selectedTeamId={selectedTeamId}
        onFormSubmit={(event) => void handleCreateTeam(event)}
        onNameChange={(name) => setTeamForm((previous) => ({ ...previous, name }))}
        onDescriptionChange={(description) =>
          setTeamForm((previous) => ({ ...previous, description }))
        }
        onGoToSelectedTeam={() => navigate(`/tasks/team/${selectedTeamId}`)}
        isAlreadyOnTeam={isAlreadyOnTeam}
      />
    </PageShell>
  );
};

export default Teams;
