import axios from "axios";
import { apiConfig } from "../config";
import { getOdAuthTokens, storeOdAuthTokens } from "./oauth";

// Generate the Microsoft OAuth 2.0 authorization URL, used for requesting the authorisation code
export function generateAuthorisationUrl(): string {
  const { clientId, redirectUri, authApi, scope } = apiConfig;
  const authUrl = authApi.replace("/token", "/authorize");

  // Construct URL parameters for OAuth2
  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("redirect_uri", redirectUri);
  params.append("response_type", "code");
  params.append("scope", scope);
  params.append("response_mode", "query");

  return `${authUrl}?${params.toString()}`;
}

export async function getAuthPersonInfo(accessToken: string) {
  const profileApi = apiConfig.driveApi.replace("/drive", "");
  return axios.get(profileApi, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
