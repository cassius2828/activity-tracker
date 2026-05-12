import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { chooseTeam, createTeam, getTeams, type Team, type TeamRole } from "../service/teams";
import {
  ChooseTeamSection,
  CreateTeamSection,
  TeamNotice,
  TeamsHeader,
  type TeamForm,
} from "../components/TeamsSections";

const Teams = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [teamForm, setTeamForm] = useState<TeamForm>({ name: "", description: "" });
  const [isLoadingTeams, setIsLoadingTeams] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isChoosing, setIsChoosing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const actor = useMemo(
    () => ({
      id: session?.userId ?? "1",
      email: session?.email ?? "admin@activity.dev",
      role: (session?.role ?? "admin") as TeamRole,
    }),
    [session?.email, session?.role, session?.userId],
  );

  useEffect(() => {
    const loadTeams = async () => {
      setIsLoadingTeams(true);
      try {
        const result = await getTeams();
        setTeams(result.data);
        setNotice(
          result.source === "local"
            ? "Using local fallback data because team endpoints are unavailable."
            : null,
        );
        setIsLoadingTeams(false);
      } catch (err) {
        console.error(err);
        setNotice("Failed to load teams.");
      } finally {
        setIsLoadingTeams(false);
      }

    };

    void loadTeams();
  }, []);

  const handleChooseTeam = async (teamId: string) => {
    if (!teamId) return;
    setIsChoosing(true);
    const result = await chooseTeam({ teamId, user: actor });


    setNotice(
      result.source === "local"
        ? "Selected team in local development mode."
        : "Team selected successfully.",
    );
    setIsChoosing(false);
    navigate(`/tasks/team/${teamId}`);
  };

  const handleCreateTeam = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!teamForm.name.trim()) {
      setNotice("Team name is required.");
      return;
    }
    setIsCreating(true);
    try {
      const result = await createTeam({
        name: teamForm.name.trim(),
        description: teamForm.description.trim() || "No description provided",
        creator: actor,
      });
      setTeams((previous) => [result.data, ...previous.filter((team) => team.id !== result.data.id)]);
      setSelectedTeamId(result.data.id);

      setTeamForm({ name: "", description: "" });
      setNotice(
        result.source === "local"
          ? "Team created with local fallback data."
          : "Team created successfully.",
      );
    } catch (err) {
      console.error(err);
      setNotice("Failed to create team.");
    } finally {
      setIsCreating(false);
    }


  };

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
      />
    </div>
  );
};

export default Teams;
