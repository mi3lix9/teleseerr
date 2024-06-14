import env from "../../env";

const { JELLYSEERR_URL, JELLYSEERR_KEY } = env;

/**
 * Fetches data from the Jellyseerr API.
 *
 * This function constructs a URL using the provided endpoint and query parameters,
 * makes an HTTP GET request to the Jellyseerr API, and returns the JSON response.
 *
 * @template T - The expected return type of the API response. Defaults to `any`.
 *
 * @param {string} endpoint - The API endpoint to call (e.g., "/search").
 * @param {Record<string, string>} params - An object representing the query parameters to include in the request.
 *
 **/
export async function fetchFromJellyseerr<T = any>(
  endpoint: string,
  params: Record<string, string>
): Promise<T> {
  const url = new URL(JELLYSEERR_URL + endpoint);

  Object.entries(params).forEach(([key, val]) =>
    url.searchParams.append(key, encodeURIComponent(val))
  );

  const res = await fetch(url.toString(), {
    headers: { "X-Api-Key": JELLYSEERR_KEY },
  });

  return res.json();
}
