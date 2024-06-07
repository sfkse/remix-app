import { useFetcher } from "@remix-run/react";
import { LoaderData } from "~/types/location";

type FiltersProps = {
  fetcher: ReturnType<typeof useFetcher<LoaderData>>;
  locationTypes: string[];
  locationDimensions: string[];
  type: string;
  dimension: string;
  handleTypeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleDimensionChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export default function Filters({
  fetcher,
  locationTypes,
  locationDimensions,
  type,
  dimension,
  handleTypeChange,
  handleDimensionChange,
  handleSubmit,
}: FiltersProps) {
  return (
    <div id="filters-container">
      <fetcher.Form method="post" onSubmit={handleSubmit}>
        <label htmlFor="type">Type</label>
        <select name="type" id="type" value={type} onChange={handleTypeChange}>
          {locationTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <label htmlFor="dimension">Dimension</label>
        <select
          name="dimension"
          id="dimension"
          value={dimension}
          onChange={handleDimensionChange}
        >
          {locationDimensions.map((dimension) => (
            <option key={dimension} value={dimension}>
              {dimension}
            </option>
          ))}
        </select>
        <button type="submit">Filter</button>
      </fetcher.Form>
    </div>
  );
}

