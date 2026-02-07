/**
 * Tests for address-based lookups on the /api/lookup endpoint.
 *
 * Note: These tests make real geocoding requests using the configured provider.
 * They may be slower and could fail if the API is unavailable.
 */

import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/lookup/route";
import { createRequest } from "./test-utils";
import { getConfiguredGeocodingProvider } from "@/lib/geocoding";

function hasGeocodingApiKey(): boolean {
  switch (getConfiguredGeocodingProvider()) {
    case "geocode-earth":
      return Boolean(
        process.env.GEOCODE_EARTH_API_KEY ||
          process.env.NEXT_PUBLIC_GEOCODE_EARTH_API_KEY
      );
    case "mapbox":
      return Boolean(process.env.MAPBOX_ACCESS_TOKEN);
    case "google-maps":
      return Boolean(process.env.GOOGLE_MAPS_API_KEY);
    case "geoapify":
      return Boolean(process.env.GEOAPIFY_API_KEY);
    default:
      return false;
  }
}

const describeIfApiConfigured = hasGeocodingApiKey() ? describe : describe.skip;

describeIfApiConfigured("Lookup by Address", () => {
  it(
    "returns valid response for a known in-jurisdiction civic address",
    async () => {
      const request = createRequest("/api/lookup", {
        address: "141 W Randolph St, Chicago, IL 60602",
      });
      const response = await GET(request);

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.address_used).not.toBeNull();
      expect(data.address_used.toLowerCase()).toContain("randolph");
    },
    15000
  );

  it(
    "returns matched address from configured geocoder",
    async () => {
      const request = createRequest("/api/lookup", {
        address: "141 W Randolph St, Chicago, IL",
      });
      const response = await GET(request);

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.address_used).not.toBeNull();
      expect(data.address_used.length).toBeGreaterThan(0);
    },
    15000
  );

  it(
    "returns geocoded coordinates",
    async () => {
      const request = createRequest("/api/lookup", {
        address: "141 W Randolph St, Chicago, IL",
      });
      const response = await GET(request);

      expect(response.status).toBe(200);

      const data = await response.json();
      const coords = data.coordinates;

      // Known downtown address should geocode to this approximate area.
      expect(coords.lat).toBeGreaterThan(41.8);
      expect(coords.lat).toBeLessThan(42.0);
      expect(coords.lng).toBeGreaterThan(-87.7);
      expect(coords.lng).toBeLessThan(-87.5);
    },
    15000
  );

  it(
    "finds all district types for a core-city address",
    async () => {
      const request = createRequest("/api/lookup", {
        address: "141 W Randolph St, Chicago, IL 60602",
      });
      const response = await GET(request);

      expect(response.status).toBe(200);

      const data = await response.json();
      const districts = data.districts;

      expect(districts.congressional).not.toBeNull();
      expect(districts.state_senate).not.toBeNull();
      expect(districts.state_house).not.toBeNull();
      expect(districts.city_ward).not.toBeNull();
    },
    15000
  );

  it(
    "returns no city-ward district for a nearby suburb address",
    async () => {
      const request = createRequest("/api/lookup", {
        address: "1600 Chicago Ave, Evanston, IL 60201",
      });
      const response = await GET(request);

      expect(response.status).toBe(200);

      const data = await response.json();
      expect(data.districts.city_ward).toBeNull();
    },
    15000
  );
});
