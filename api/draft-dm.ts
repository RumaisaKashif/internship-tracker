import type { VercelRequest, VercelResponse } from '@vercel/node'
import Anthropic from '@anthropic-ai/sdk'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { company, roleType, templateType } = req.body as {
    company: string
    roleType: string
    templateType: string
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(200).json({
      message: `Hi [Name],\n\nI came across your profile and noticed you work at ${company}. I'm Rumaisa Kashif, a CS student at NUS exploring ${roleType} internship opportunities for Summer 2027.\n\nWould you be open to a brief coffee chat to learn more about your experience at ${company}?\n\nBest,\nRumaisa`
    })
  }

  const templateGuide = {
    coffee_chat: 'casual coffee chat request to learn about the company culture and role. Short (3-4 sentences)',
    referral_ask: 'thoughtful referral ask after some rapport. Mention specific reasons you are a strong fit',
    followup: 'polite follow-up to a previous message that got no response. Short, not pushy',
  }[templateType] ?? 'coffee chat request'

  const client = new Anthropic({ apiKey })

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    messages: [{
      role: 'user',
      content: `Write a LinkedIn cold DM for Rumaisa Kashif (NUS CS, interned at Bosch APAC on computer vision with diffusion models, prev SWE intern at Systems Limited, participated in Jane Street INSIGHT).

Target: ${company} employee working in ${roleType}
Type: ${templateGuide}

Requirements:
- 3-4 sentences max for coffee chat
- Personal, not templated-feeling
- Reference specific work Rumaisa has done that's relevant to ${company}
- Don't be sycophantic
- End with a clear CTA

Return ONLY the message text, no quotes or labels.`
    }]
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  return res.status(200).json({ message: text })
}
