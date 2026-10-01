const API_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '')

export async function checkHealth(signal: AbortSignal): Promise<void> {
  const response = await fetch(`${API_URL}/health`, { signal })
  if (!response.ok) throw new Error(`A API respondeu com erro ${response.status}.`)
  const result: unknown = await response.json()
  if (
    typeof result !== 'object' || result === null ||
    !('status' in result) || result.status !== 'ok' ||
    !('service' in result) || result.service !== 'musicplanner-api'
  ) throw new Error('A API retornou uma resposta inesperada.')
}

