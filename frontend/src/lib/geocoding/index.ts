import { APP_CONFIG } from "../app-config";
import { createGeocodingClient } from "./providers";
import type { GeocodingClient, GeocodingProviderName } from "./types";

let cachedClient: GeocodingClient | null = null;
let cachedProvider: string | null = null;

const SUPPORTED_GEOCODING_PROVIDERS: GeocodingProviderName[] = [
  "geocode-earth",
  "mapbox",
  "google-maps",
  "geoapify",
];

function parseGeocodingProvider(value: string): GeocodingProviderName | null {
  if ((SUPPORTED_GEOCODING_PROVIDERS as string[]).includes(value)) {
    return value as GeocodingProviderName;
  }
  return null;
}

export function getConfiguredGeocodingProvider(): GeocodingProviderName {
  const envProvider = process.env.GEOCODING_PROVIDER?.trim().toLowerCase();
  if (!envProvider) {
    return APP_CONFIG.geocoding.provider;
  }

  const parsedProvider = parseGeocodingProvider(envProvider);
  if (parsedProvider) {
    return parsedProvider;
  }

  throw new Error(
    `Invalid GEOCODING_PROVIDER: "${envProvider}". Expected one of ${SUPPORTED_GEOCODING_PROVIDERS.join(", ")}`
  );
}

export function getGeocodingClient(): GeocodingClient {
  const provider = getConfiguredGeocodingProvider();

  if (cachedClient && cachedProvider === provider) {
    return cachedClient;
  }

  cachedClient = createGeocodingClient(provider, {
    bounds: APP_CONFIG.geography.bounds,
    focusPoint: APP_CONFIG.geography.focusPoint,
    countryCode: APP_CONFIG.geography.countryCode,
    stateCode: APP_CONFIG.geography.state.code,
    autocompleteLimit: APP_CONFIG.geocoding.autocompleteLimit,
  });
  cachedProvider = provider;
  return cachedClient;
}

export type { GeocodingProviderName, GeocodingClient, GeocodeResult } from "./types";
