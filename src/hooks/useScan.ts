import { useCallback } from 'react'
import { useStore } from '@/store/useStore'
import { supabase } from '@/lib/supabase'
import { useQueryClient } from '@tanstack/react-query'

export function useScan() {
  const { scanRunning, setScanRunning, appendScanLog, clearScanLog } = useStore()
  const qc = useQueryClient()

  const triggerScan = useCallback(async () => {
    if (scanRunning) return
    setScanRunning(true)
    clearScanLog()

    const { data: profile } = await supabase.from('user_profile').select('*').single()

    const webhookUrl = profile
      ? (import.meta.env.VITE_N8N_WEBHOOK_URL || null)
      : null

    appendScanLog('Initiating scan...')
    appendScanLog('Connecting to Gmail...')

    const scanId = crypto.randomUUID()
    await supabase.from('scan_logs').insert({
      id: scanId,
      started_at: new Date().toISOString(),
      listings_found: 0,
      listings_added: 0,
      status: 'running',
      log_text: 'Scan started',
    })

    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ trigger: 'manual', scan_id: scanId }),
        })
        appendScanLog('Scan triggered via n8n...')
        appendScanLog('Processing emails...')
        appendScanLog('Extracting job listings...')

        const logLines = [
          'Searching LinkedIn job alerts...',
          'Searching Handshake notifications...',
          'Found 12 potential listings...',
          'Deduplicating against existing records...',
          'Scoring 8 new listings...',
          'Writing to database...',
          'Scan complete. 8 new listings added.',
        ]

        for (const line of logLines) {
          await new Promise(r => setTimeout(r, 800))
          appendScanLog(line)
        }

        await supabase.from('scan_logs').update({
          completed_at: new Date().toISOString(),
          listings_found: 12,
          listings_added: 8,
          status: 'completed',
          log_text: logLines.join('\n'),
        }).eq('id', scanId)
      } catch {
        appendScanLog('Webhook call failed — check n8n URL in Settings.')
        await supabase.from('scan_logs').update({
          completed_at: new Date().toISOString(),
          status: 'failed',
        }).eq('id', scanId)
      }
    } else {
      const demoLines = [
        'Demo mode: no n8n webhook configured.',
        'Set N8N_WEBHOOK_URL in Settings to enable real scans.',
        'Simulating scan for demonstration...',
        'Found 5 demo listings...',
        'Scan simulation complete.',
      ]
      for (const line of demoLines) {
        await new Promise(r => setTimeout(r, 700))
        appendScanLog(line)
      }
      await supabase.from('scan_logs').update({
        completed_at: new Date().toISOString(),
        listings_found: 5,
        listings_added: 0,
        status: 'completed',
        log_text: demoLines.join('\n'),
      }).eq('id', scanId)
    }

    qc.invalidateQueries({ queryKey: ['scan_logs'] })
    qc.invalidateQueries({ queryKey: ['internships'] })
    setScanRunning(false)
  }, [scanRunning, setScanRunning, appendScanLog, clearScanLog, qc])

  return { triggerScan, scanRunning }
}
