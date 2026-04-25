import type { VercelRequest, VercelResponse } from '@vercel/node'
import Anthropic from '@anthropic-ai/sdk'

const RUMAISA_PROFILE = `
Name: Rumaisa Kashif
University: NUS Computer Science, May 2028
Current: Computer Vision Intern @ Bosch APAC (diffusion models, thermal imaging, SAM2, AWS EC2, Docker)
Previous: SWE Intern @ Systems Limited (RAG pipeline, LangChain, Supabase, hybrid search)
Notable: Jane Street INSIGHT (SWE track), MIT xPro ML Certificate
Skills: Python, C/C++, Java, JavaScript, TypeScript, OCaml, PyTorch, TensorFlow, LangChain,
LangGraph, FastAPI, Flask, React, scikit-learn, OpenCV, NumPy, pandas, Stable Baselines3,
Diffusion Models, ViT, MAE, SAM2, CLIP, YOLO, RAG pipelines, LLM agents, MCP, Redis,
Supabase, AWS EC2, Docker, ComfyUI
`

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { jobDescription, baseResume, tone } = req.body as {
    jobDescription: string
    baseResume: string
    tone: string
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(200).json({
      optimizedResume: baseResume + '\n\n[Claude API key not configured]',
      coverLetter: 'Add ANTHROPIC_API_KEY to environment variables.',
      matchScore: 70,
    })
  }

  const client = new Anthropic({ apiKey })

  const toneGuide = {
    professional: 'formal, precise, achievement-focused',
    enthusiastic: 'warm, energetic, passion-forward',
    concise: 'brief, punchy, impact-first',
  }[tone] ?? 'professional'

  const prompt = `You are an elite technical resume writer. Optimize the following resume for the job description.

CANDIDATE PROFILE:
${RUMAISA_PROFILE}

JOB DESCRIPTION:
${jobDescription}

ORIGINAL RESUME:
${baseResume}

TONE: ${toneGuide}

Return ONLY valid JSON with this exact structure:
{
  "optimizedResume": "full optimized resume text",
  "coverLetter": "full cover letter text",
  "matchScore": number between 0-100
}

Rules:
- Keep the same section structure, improve bullet points to match job keywords
- Highlight ML/AI skills for ML roles, systems skills for systems roles
- Cover letter: 3 paragraphs, specific to company, shows genuine interest
- Match score: honest assessment of skills vs requirements`

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  try {
    const stream = client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
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
    console.error('Optimize error:', err)
    res.write(`data: ${JSON.stringify({ error: 'Optimization failed' })}\n\n`)
    res.end()
  }
}
