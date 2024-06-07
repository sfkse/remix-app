import { Location } from "~/types/location";

export const isMatchingType = (type: string, location: Location) =>
  type === "All" || location.type === type;

export const isMatchingDimension = (dimension: string, location: Location) =>
  dimension === "All" || location.dimension === dimension;

export const getUniqueValues = (
  data: Location[],
  key: "type" | "dimension"
): string[] => {
  const uniqueValues = data.reduce<string[]>((acc, item) => {
    const value = item[key];
    if (typeof value === "string" && !acc.includes(value)) {
      acc.push(value);
    }
    return acc;
  }, []);
  return uniqueValues;
};
