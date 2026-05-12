import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createTeam, getTeams, type Team, type TeamRole } from "../service/teams";
import {
  ChooseTeamSection,
  CreateTeamSection,
  TeamNotice,
  TeamsHeader,
  type TeamForm,
} from "../components/TeamsSections";
import { useAppContext } from "../context/AppContext";

const Teams = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { teams, setTeams, selectedTeamId, setSelectedTeamId, isLoadingTeams, setIsLoadingTeams } = useAppContext();
  const [notice, setNotice] = useState<string | null>(null);
  const [isChoosing] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [teamForm, setTeamForm] = useState<TeamForm>({ name: "", description: "" });

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
      setNotice("You are already on a team. Leave it before creating a new one.");
      return;
    }
    if (!teamForm.name.trim()) {
      setNotice("Team name is required.");
      return;
    }
    setIsCreating(true);
    try {
      const createdTeam = await createTeam({
        name: teamForm.name.trim(),
        description: teamForm.description.trim() || "No description provided",
        creators: [{ id: actor.id, role: actor.role }],
      });
      setTeams((previous: Team[]) =>
        [createdTeam, ...previous.filter((team: Team) => team.id !== createdTeam.id)],
      );
      setSelectedTeamId(createdTeam.id);

      setTeamForm({ name: "", description: "" });
      setNotice("Team created successfully.");
    } catch (err) {
      console.error(err);
      setNotice("Failed to create team.");
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    const loadTeams = async () => {
      setIsLoadingTeams(true);
      try {
        const fetchedTeams = await getTeams();
        setTeams(fetchedTeams);
        setSelectedTeamId(fetchedTeams[0]?.id ?? "");
        setNotice(null);
      } catch (err) {
        console.error(err);
        setNotice("Failed to load teams.");
      } finally {
        setIsLoadingTeams(false);
      }
    };

    void loadTeams();
  }, []);



  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 text-left sm:px-6 sm:py-10">
      <TeamsHeader />
      <TeamNotice notice={notice} />
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
    </div>
  );
};

export default Teams;
