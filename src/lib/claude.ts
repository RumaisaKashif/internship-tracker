const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

export async function scrapeJob(url: string) {
  const res = await fetch(`${BASE_URL}/api/scrape`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })
  if (!res.ok) throw new Error(`Scrape failed: ${res.statusText}`)
  return res.json() as Promise<{ title: string; company: string; description: string; requirements: string }>
}

export async function* streamOptimize(payload: {
  jobDescription: string
  baseResume: string
  tone: string
}): AsyncGenerator<string> {
  const res = await fetch(`${BASE_URL}/api/optimize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`Optimize failed: ${res.statusText}`)
  const reader = res.body?.getReader()
  if (!reader) return
  const decoder = new TextDecoder()
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value, { stream: true })
    const lines = chunk.split('\n').filter(l => l.startsWith('data: '))
    for (const line of lines) {
      const data = line.slice(6)
      if (data === '[DONE]') return
      try {
        const parsed = JSON.parse(data)
        if (parsed.text) yield parsed.text
      } catch {
        yield data
      }
    }
  }
}

export async function draftDM(payload: {
  company: string
  roleType: string
  templateType: string
}): Promise<{ message: string }> {
  const res = await fetch(`${BASE_URL}/api/draft-dm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`DraftDM failed: ${res.statusText}`)
  return res.json()
}

export async function* streamExplainLC(payload: {
  problemNumber: number
  problemTitle: string
}): AsyncGenerator<string> {
  const res = await fetch(`${BASE_URL}/api/explain-lc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`ExplainLC failed: ${res.statusText}`)
  const reader = res.body?.getReader()
  if (!reader) return
  const decoder = new TextDecoder()
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const chunk = decoder.decode(value, { stream: true })
    const lines = chunk.split('\n').filter(l => l.startsWith('data: '))
    for (const line of lines) {
      const data = line.slice(6)
      if (data === '[DONE]') return
      try {
        const parsed = JSON.parse(data)
        if (parsed.text) yield parsed.text
      } catch {
        yield data
      }
    }
  }
}
