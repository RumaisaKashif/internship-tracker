import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useRealtimeInternships() {
  const qc = useQueryClient()

  useEffect(() => {
    const channel = supabase
      .channel('internships-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'internships',
      }, () => {
        qc.invalidateQueries({ queryKey: ['internships'] })
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [qc])
}

export function useRealtimeScanLogs() {
  const qc = useQueryClient()

  useEffect(() => {
    const channel = supabase
      .channel('scan-logs-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'scan_logs',
      }, () => {
        qc.invalidateQueries({ queryKey: ['scan_logs'] })
        qc.invalidateQueries({ queryKey: ['internships'] })
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [qc])
}
