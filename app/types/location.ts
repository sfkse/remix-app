export interface Location {
  id: string;
  name: string;
  type: string;
  dimension: string;
}

export interface LocationResponse {
  locations: {
    results: Location[];
  };
}

export interface LocationWithResidents {
  location: {
    id: string;
    name: string;
    type: string;
    dimension: string;
    residents: Resident[];
  };
}

export interface Resident {
  id: string;
  image: string;
  name: string;
  status: string;
  species: string;
  gender: string;
  location: {
    name: string;
  };
  origin: {
    name: string;
  };
}

export interface LoaderData {
  locationData: Location[];
  locationTypes: string[];
  locationDimensions: string[];
}
