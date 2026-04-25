import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { url } = req.body as { url: string }
  if (!url) return res.status(400).json({ error: 'URL required' })

  try {
    const jinaUrl = `https://r.jina.ai/${url}`
    const response = await fetch(jinaUrl, {
      headers: {
        'Accept': 'application/json',
        'X-Return-Format': 'markdown',
      },
    })

    if (!response.ok) {
      throw new Error(`Jina fetch failed: ${response.status}`)
    }

    const text = await response.text()

    const titleMatch = text.match(/^#\s+(.+)/m)
    const title = titleMatch?.[1]?.trim() ?? 'Software Engineering Intern'

    const companyPatterns = [
      /at\s+([A-Z][a-zA-Z\s]+?)(?:\s+is|\s+are|\s+\||$)/m,
      /([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?)\s+is\s+(?:looking|hiring|seeking)/m,
    ]
    let company = 'Unknown Company'
    for (const p of companyPatterns) {
      const m = text.match(p)
      if (m?.[1]) { company = m[1].trim(); break }
    }

    const reqMatch = text.match(/(?:requirements?|qualifications?|what you.ll need)[:\s\n]([\s\S]{100,600}?)(?:\n#|\n\n\n|$)/i)
    const requirements = reqMatch?.[1]?.trim() ?? ''

    const descMatch = text.match(/(?:about the role|job description|responsibilities)[:\s\n]([\s\S]{100,600}?)(?:\n#|\n\n\n|$)/i)
    const description = descMatch?.[1]?.trim() ?? text.slice(0, 500)

    return res.status(200).json({ title, company, description, requirements })
  } catch (err) {
    console.error('Scrape error:', err)
    return res.status(500).json({
      error: 'Failed to fetch job page',
      title: 'Unknown Role',
      company: 'Unknown Company',
      description: '',
      requirements: '',
    })
  }
}
