import { GraphQLClient, gql } from "graphql-request";
import { LocationResponse, LocationWithResidents } from "./types/location";

const API_URL = "https://rickandmortyapi.com/graphql";

const client = new GraphQLClient(API_URL);

// GraphQL queries

const GET_ALL_LOCATIONS = gql`
  query {
    locations {
      results {
        id
        name
        type
        dimension
      }
    }
  }
`;

const GET_LOCATION_WITH_RESIDENTS = gql`
  query ($locationId: ID!) {
    location(id: $locationId) {
      id
      name
      type
      dimension
      residents {
        id
        name
        status
        species
        type
        gender
        image
        location {
          name
        }
        origin {
          name
        }
      }
    }
  }
`;

// API functions

export async function getAllLocations() {
  try {
    const data: LocationResponse = await client.request(GET_ALL_LOCATIONS);
    return data.locations.results;
  } catch (error) {
    throw new Error("Error when fetching locations");
  }
}

export async function getLocationWithResidents(locationId: string) {
  try {
    const variables = { locationId };
    const data: LocationWithResidents = await client.request(
      GET_LOCATION_WITH_RESIDENTS,
      variables
    );
    return data.location;
  } catch (error) {
    throw new Error("Error when fetching location with residents");
  }
}

