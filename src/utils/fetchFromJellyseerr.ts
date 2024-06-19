import env from "~/env";

const { JELLYSEERR_URL, JELLYSEERR_KEY } = env;

/**
/**
 * Fetches data from the Jellyseerr API.
 *
 * This function constructs a URL using the provided endpoint and query parameters,
 * makes an HTTP request to the Jellyseerr API using the specified method, and returns the JSON response.
 *
 * @template T - The expected return type of the API response. Defaults to `any`.
 *
 * @param {string} endpoint - The API endpoint to call (e.g., "/search").
 * @param {Object} options - The options for the API request.
 * @param {string} [options.method="GET"] - The HTTP method to use for the request.
 * @param {Record<string, string>} [options.params={}] - An object representing the query parameters to include in the request.
 * @param {Object} [options.body] - The body of the request for POST and PUT methods.
 * 
 * @returns {Promise<T>} A promise that resolves to the JSON response from the API.
 *
 * @throws {Error} Throws an error if the fetch operation fails.
 *
 * @example
 * // Example usage of fetchFromJellyseerr to search for movies
 * const response = await fetchFromJellyseerr("/search", {
 *   params: { query: "Inception", page: "1" }
 * });
 * console.log(response);
 * // Output might be an array of movie objects
 *
 * @example
 * // Example usage with POST method
 * const response = await fetchFromJellyseerr("/request", {
 *   method: "POST",
 *   body: { mediaId: 12345, userId: 67890 }
 * });
 * console.log(response);
 * // Output might be a confirmation object
 */
export async function fetchFromJellyseerr<T = any>(
  endpoint: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    params?: Record<string, string>;
    body?: Record<string, any>;
  } = {}
) {
  const { method = "GET", params = {}, body } = options;
  const url = new URL(JELLYSEERR_URL + endpoint);

  // Append query parameters to the URL
  Object.entries(params).forEach(([key, val]) =>
    url.searchParams.append(key, encodeURIComponent(val))
  );

  const fetchOptions: RequestInit = {
    method,
    headers: {
      "X-Api-Key": JELLYSEERR_KEY,
      "Content-Type": "application/json",
    },
  };

  if (body) fetchOptions.body = JSON.stringify(body);

  // Make the API request
  const res = await fetch(url.toString(), fetchOptions);

  // Check for HTTP errors
  if (!res.ok) {
    throw new Error(`Error: ${res.status} ${res.statusText}`);
  }

  // Return the JSON response
  return { json: (await res.json()) as T, status: res.status, ok: res.ok };
}
