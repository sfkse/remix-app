import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import invariant from "tiny-invariant";
import Stats from "~/components/Stats";
import { getLocationWithResidents } from "~/data";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const locationId = url.searchParams.get("locationId");
  invariant(locationId, "Location ID is required");

  const locationWithResidents = await getLocationWithResidents(locationId);
  if (!locationWithResidents) throw new Error("Location not found");

  return json({ locationWithResidents });
};

export default function Location() {
  const { locationWithResidents } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

  const numOfCurrentGuests = locationWithResidents.residents.filter(
    (resident) => resident.location.name !== resident.origin.name
  ).length;
  const numOfAliveResidents = locationWithResidents.residents.filter(
    (resident) => resident.status === "Alive"
  ).length;

  const getNumOfSpecies = (species: string) =>
    locationWithResidents.residents.filter(
      (resident) => resident.species === species
    ).length;

  return (
    <div
      id="detail"
      className={navigation.state === "loading" ? "loading" : ""}
    >
      <Stats
        locationWithResidents={locationWithResidents}
        numOfAliveResidents={numOfAliveResidents}
        numOfCurrentGuests={numOfCurrentGuests}
        getNumOfSpecies={getNumOfSpecies}
      />

      <div id="cards-container">
        {locationWithResidents.residents.map((resident) => (
          <div key={resident.id} className="card">
            <div className="card-image">
              <img src={resident.image} alt={resident.name} />
            </div>
            <div className="card-details">
              <h2>{resident.name}</h2>
              <p>
                {resident.species} - {resident.gender}
              </p>
              <p>Status: {resident.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

