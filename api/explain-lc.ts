import type { VercelRequest, VercelResponse } from '@vercel/node'
import Anthropic from '@anthropic-ai/sdk'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { problemNumber, problemTitle } = req.body as {
    problemNumber: number
    problemTitle: string
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.write(`data: ${JSON.stringify({ text: `[ANTHROPIC_API_KEY not set]\n\nTo enable LeetCode explanations, add your Claude API key in Settings or as an environment variable.` })}\n\n`)
    res.write('data: [DONE]\n\n')
    return res.end()
  }

  const client = new Anthropic({ apiKey })

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const prompt = `Explain LeetCode problem #${problemNumber}: ${problemTitle}

Provide a clear technical explanation with:

## Problem Summary
Brief 2-sentence description of what needs to be solved.

## Key Insight
The core observation that unlocks the solution.

## Approach
Step-by-step algorithm explanation. Be specific.

## Complexity
- Time: O(...) — why
- Space: O(...) — why

## Python Solution
\`\`\`python
# Clean, well-commented solution
def solution(...):
    ...
\`\`\`

## Common Mistakes
1-2 pitfalls to avoid.

Keep the explanation concise and interview-ready. Focus on what a Quant/SWE interviewer at Jane Street, Citadel, or Google would care about.`

  try {
    const stream = client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    })

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
      }
    }

    res.write('data: [DONE]\n\n')
    res.end()
  } catch (err) {
    console.error('ExplainLC error:', err)
    res.write(`data: ${JSON.stringify({ text: '\n[Error generating explanation]' })}\n\n`)
    res.end()
  }
}
