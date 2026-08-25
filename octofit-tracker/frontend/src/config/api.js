// Builds the API base URL from VITE_CODESPACE_NAME, falling back to localhost.
// VITE_CODESPACE_NAME must be defined in an env file (e.g. .env.local) when
// running inside a Codespace so requests reach the forwarded 8000 port.
const codespaceName = import.meta.env.VITE_CODESPACE_NAME

export const API_BASE_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'

export function apiUrl(path) {
  return `${API_BASE_URL}/${path}/`
}

// Backend endpoints return plain arrays, but this also supports paginated
// shapes (e.g. { results: [...] } or { data: [...] }) for compatibility.
export function toArray(payload) {
  if (Array.isArray(payload)) {
    return payload
  }
  if (payload && Array.isArray(payload.results)) {
    return payload.results
  }
  if (payload && Array.isArray(payload.data)) {
    return payload.data
  }
  return []
}
