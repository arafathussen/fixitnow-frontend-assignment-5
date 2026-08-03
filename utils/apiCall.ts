const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://fixitnow-api-gh7m.onrender.com";

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string;
  tags?: string[];
  cache?: RequestCache;
};

export async function apiCall<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<{ success: boolean; data?: T; message?: string }> {
  const { method = "GET", body, token, tags, cache } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const isAuthEndpoint = endpoint.includes("/api/auth/login") || endpoint.includes("/api/auth/register");

  let authToken = token;
  if (!authToken && !isAuthEndpoint && typeof window !== "undefined") {
    const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
    if (match) {
      authToken = match[1];
    }
  }

  if (authToken && !isAuthEndpoint) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
    ...(tags && { next: { tags } }),
    ...(cache && { cache }),
  };

  if (body !== undefined && body !== null) {
    fetchOptions.body = typeof body === "string" ? body : JSON.stringify(body);
  }

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      console.error(`API Error [${res.status}]:`, data);

      let cleanMessage = "Something went wrong";
      if (typeof data?.message === "string") {
        try {
          const parsed = JSON.parse(data.message);
          if (Array.isArray(parsed)) {
            cleanMessage = parsed.map((e: any) => e.message).filter(Boolean).join(". ");
          } else {
            cleanMessage = data.message;
          }
        } catch {
          cleanMessage = data.message;
        }
      } else if (Array.isArray(data?.errorSources)) {
        cleanMessage = data.errorSources.map((e: any) => e.message).filter(Boolean).join(". ");
      }

      return { success: false, message: cleanMessage };
    }

    return data;
  } catch (error: any) {
    console.error("API Fetch failed:", error?.message || error);
    return { 
      success: false, 
      message: dataErrorMessage(error)
    };
  }
}

function dataErrorMessage(error: any): string {
  if (!error) return "Server response error. Please try again.";
  const msg = typeof error === "string" ? error : error?.message || "";
  if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
    return "Backend server is waking up or network issue. Please click Sign In again.";
  }
  return msg || "Connection error. Please try again.";
}
