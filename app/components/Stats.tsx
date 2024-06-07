import { LocationWithResidents } from "~/types/location";

type StatsProps = {
  locationWithResidents: LocationWithResidents["location"];
  numOfAliveResidents: number;
  numOfCurrentGuests: number;
  getNumOfSpecies: (species: string) => number;
};

function Stats({
  locationWithResidents,
  numOfAliveResidents,
  numOfCurrentGuests,
  getNumOfSpecies,
}: StatsProps) {
  return (
    <div id="stats-container">
      <h1>{locationWithResidents.name}</h1>
      <p>
        Dimension: <span>{locationWithResidents.dimension}</span> --- Type:{" "}
        <span>{locationWithResidents.type}</span>
      </p>
      <p>
        Alive: <span>{numOfAliveResidents}</span> --- Dead:{" "}
        <span>
          {locationWithResidents.residents.length - numOfAliveResidents}
        </span>{" "}
        --- Guests: <span>{numOfCurrentGuests}</span>
      </p>
      <p>
        Robots: <span>{getNumOfSpecies("Robot")}</span> --- Aliens:{" "}
        <span>{getNumOfSpecies("Alien")}</span> --- Humans:{" "}
        <span>{getNumOfSpecies("Human")}</span>
      </p>
    </div>
  );
}

export default Stats;

