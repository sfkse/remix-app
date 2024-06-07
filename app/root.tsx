import { LinksFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import React, { useState } from "react";
import {
  Link,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useFetcher,
  useLoaderData,
  useLocation,
  useRouteError,
} from "@remix-run/react";
import appStylesHref from "./styles/index.css?url";
import { LoaderData, Location } from "./types/location";
import Filters from "./components/Filters";
import { getAllLocations } from "./data";
import {
  getUniqueValues,
  isMatchingDimension,
  isMatchingType,
} from "./helpers/utils";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];

export const loader = async () => {
  const locationData = await getAllLocations();
  if (!locationData) throw new Error("Error when fetching locations");

  // Get values for type and dimension filters
  const locationTypes = ["All", ...getUniqueValues(locationData, "type")];
  const locationDimensions = [
    "All",
    ...getUniqueValues(locationData, "dimension"),
  ];
  return json({ locationData, locationTypes, locationDimensions });
};

export const action = async ({ request }: LoaderFunctionArgs) => {
  const formData = await request.formData();
  const type = formData.get("type") || "All";
  const dimension = formData.get("dimension") || "All";

  const locationData = await getAllLocations();
  if (!locationData) throw new Error("Error when fetching locations");

  const filteredLocations = locationData.filter(
    (location: Location) =>
      isMatchingType(type as string, location) &&
      isMatchingDimension(dimension as string, location)
  );

  return json({
    locationData: filteredLocations,
  });
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Rick and Morty</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { locationData, locationTypes, locationDimensions } =
    useLoaderData<typeof loader>();
  const fetcher = useFetcher<LoaderData>();

  const [type, setType] = useState("All");
  const [dimension, setDimension] = useState("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const url = useLocation();
  const locationId = new URLSearchParams(url.search).get("locationId") || "";

  const locations = fetcher.data?.locationData || locationData;

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setType(event.target.value);

  const handleDimensionChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    setDimension(event.target.value);

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("type", type);
    formData.append("dimension", dimension);
    fetcher.submit(formData, { method: "post" });
  };

  const handleToggleMobileMenu = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <Layout>
      <div
        id="hamburger"
        onClick={handleToggleMobileMenu}
        onKeyDown={handleToggleMobileMenu}
        role="button"
        tabIndex={0}
      >
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div id="sidebar" className={isSidebarOpen ? "open" : ""}>
        <h1>Rick and Morty</h1>
        <Filters
          fetcher={fetcher}
          locationTypes={locationTypes}
          locationDimensions={locationDimensions}
          type={type}
          dimension={dimension}
          handleTypeChange={handleTypeChange}
          handleDimensionChange={handleDimensionChange}
          handleSubmit={handleSubmit}
        />
        <nav>
          <ul id="menu-list">
            {locations.map((location: Location) => (
              <li key={location.id}>
                <NavLink
                  className={({ isActive }) =>
                    isActive && location.id === locationId ? "active" : ""
                  }
                  to={`/location?locationId=${location.id}`}
                >
                  {location.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <main id="content">
        <Outlet />
      </main>
    </Layout>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <Layout>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </Layout>
    );
  } else if (error instanceof Error) {
    return (
      <Layout>
        <div className="error-page">
          <h1>Error</h1>
          <p>{error.message}</p>
          <button type="button">
            <Link to="/">Go back to the homepage</Link>
          </button>
        </div>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <h1>Unknown Error</h1>
      </Layout>
    );
  }
}

