import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Eye, EyeOff, Check } from 'lucide-react'
import { PageWrapper, PageSection } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Toggle } from '@/components/ui/Toggle'
import { useProfile, useUpdateProfile } from '@/hooks/useSupabase'
import type { UserProfile } from '@/lib/supabase'

const FIELD_OPTIONS = ['SWE', 'ML/AI', 'Quant Research', 'Quant Trading', 'Data Science', 'Product', 'Design']
const LOC_OPTIONS = ['Remote', 'Singapore', 'US', 'UK', 'Anywhere']

export function Settings() {
  const { data: profile } = useProfile()
  const { mutate: updateProfile, isPending, isSuccess } = useUpdateProfile()

  const [form, setForm] = useState<Partial<UserProfile>>({})
  const [showApiKey, setShowApiKey] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)
  const [newSkill, setNewSkill] = useState('')
  const [newCompany, setNewCompany] = useState('')

  useEffect(() => {
    if (profile) setForm(profile)
  }, [profile])

  const set = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) =>
    setForm(f => ({ ...f, [key]: value }))

  const handleSave = () => {
    updateProfile(form)
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 2500)
  }

  const toggleField = (field: string) => {
    const current = form.target_fields ?? []
    set('target_fields', current.includes(field)
      ? current.filter(f => f !== field)
      : [...current, field]
    )
  }

  const addSkill = () => {
    if (!newSkill.trim()) return
    const current = form.skills ?? []
    if (!current.includes(newSkill.trim())) {
      set('skills', [...current, newSkill.trim()])
    }
    setNewSkill('')
  }

  const removeSkill = (skill: string) => {
    set('skills', (form.skills ?? []).filter(s => s !== skill))
  }

  const addCompany = () => {
    if (!newCompany.trim()) return
    const current = form.target_companies ?? []
    if (!current.includes(newCompany.trim())) {
      set('target_companies', [...current, newCompany.trim()])
    }
    setNewCompany('')
  }

  const removeCompany = (company: string) => {
    set('target_companies', (form.target_companies ?? []).filter(c => c !== company))
  }

  return (
    <PageWrapper>
      <PageSection>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-semibold text-text-primary">Settings</h1>
            <p className="text-sm text-text-secondary mt-0.5">Configure your profile and preferences</p>
          </div>
          <Button onClick={handleSave} loading={isPending}>
            {savedFlash ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}
          </Button>
        </div>
      </PageSection>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Profile */}
        <PageSection>
          <Card hover={false} animate={false}>
            <h3 className="font-display font-semibold text-sm text-text-primary mb-4">Profile</h3>
            <div className="space-y-4">
              <Input
                label="Name"
                value={form.name ?? ''}
                onChange={e => set('name', e.target.value)}
              />
              <Input
                label="University"
                value={form.university ?? ''}
                onChange={e => set('university', e.target.value)}
              />
              <Input
                label="Expected Graduation"
                value={form.grad_date ?? ''}
                onChange={e => set('grad_date', e.target.value)}
                placeholder="May 2028"
              />
              <Input
                label="Current Role"
                value={form.current_position ?? ''}
                onChange={e => set('current_position', e.target.value)}
              />
              <Input
                label="Notification Email"
                type="email"
                value={form.notification_email ?? ''}
                onChange={e => set('notification_email', e.target.value)}
              />
            </div>
          </Card>
        </PageSection>

        {/* Preferences */}
        <PageSection>
          <Card hover={false} animate={false}>
            <h3 className="font-display font-semibold text-sm text-text-primary mb-4">Preferences</h3>
            <div className="space-y-4">
              {/* Target fields */}
              <div>
                <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">Target Fields</p>
                <div className="flex flex-wrap gap-2">
                  {FIELD_OPTIONS.map(f => (
                    <button
                      key={f}
                      onClick={() => toggleField(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        form.target_fields?.includes(f)
                          ? 'bg-purple-dim/20 text-purple-bright border border-purple-dim/30'
                          : 'text-text-muted border border-transparent hover:border-border-hover'
                      }`}
                      style={{
                        borderColor: form.target_fields?.includes(f) ? undefined : 'var(--border)',
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">Location Preference</p>
                <div className="flex flex-wrap gap-2">
                  {LOC_OPTIONS.map(l => (
                    <button
                      key={l}
                      onClick={() => set('location_pref', l)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        form.location_pref === l
                          ? 'bg-teal-500/10 text-teal-soft border border-teal-500/20'
                          : 'text-text-muted'
                      }`}
                      style={{
                        border: form.location_pref === l ? undefined : '1px solid var(--border)',
                      }}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pay floor */}
              <div>
                <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">
                  Minimum Pay ($/month)
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={10000}
                    step={500}
                    value={form.pay_floor ?? 0}
                    onChange={e => set('pay_floor', parseInt(e.target.value))}
                    className="flex-1 accent-purple-mid"
                  />
                  <span className="font-mono text-sm text-purple-bright w-20 text-right">
                    ${(form.pay_floor ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Scan frequency */}
              <div>
                <p className="text-xs font-medium text-text-secondary uppercase tracking-wider mb-2">Scan Frequency</p>
                <div className="flex gap-2">
                  {[1, 2, 3].map(d => (
                    <button
                      key={d}
                      onClick={() => set('scan_frequency', d)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        form.scan_frequency === d
                          ? 'bg-amber-500/10 text-amber-soft border border-amber-500/20'
                          : 'text-text-muted'
                      }`}
                      style={{
                        border: form.scan_frequency === d ? undefined : '1px solid var(--border)',
                      }}
                    >
                      Every {d}d
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </PageSection>

        {/* Skills */}
        <PageSection>
          <Card hover={false} animate={false}>
            <h3 className="font-display font-semibold text-sm text-text-primary mb-4">Skills</h3>
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="Add skill..."
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addSkill()}
                className="flex-1"
              />
              <Button size="sm" onClick={addSkill}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              {(form.skills ?? []).map(s => (
                <motion.button
                  key={s}
                  onClick={() => removeSkill(s)}
                  className="badge badge-purple text-2xs hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-colors"
                  whileTap={{ scale: 0.9 }}
                >
                  {s} ×
                </motion.button>
              ))}
            </div>
          </Card>
        </PageSection>

        {/* Target Companies */}
        <PageSection>
          <Card hover={false} animate={false}>
            <h3 className="font-display font-semibold text-sm text-text-primary mb-4">Target Companies</h3>
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="Add company..."
                value={newCompany}
                onChange={e => setNewCompany(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCompany()}
                className="flex-1"
              />
              <Button size="sm" onClick={addCompany}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
              {(form.target_companies ?? []).map(c => (
                <motion.button
                  key={c}
                  onClick={() => removeCompany(c)}
                  className="badge badge-teal text-2xs hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-colors"
                  whileTap={{ scale: 0.9 }}
                >
                  {c} ×
                </motion.button>
              ))}
            </div>
          </Card>
        </PageSection>

        {/* Base Resume */}
        <PageSection>
          <Card hover={false} animate={false} className="lg:col-span-2">
            <h3 className="font-display font-semibold text-sm text-text-primary mb-4">Base Resume</h3>
            <Textarea
              value={form.base_resume ?? ''}
              onChange={e => set('base_resume', e.target.value)}
              placeholder="Paste your base resume here. Used by the Optimizer."
              className="h-56 text-xs"
            />
          </Card>
        </PageSection>

        {/* API Keys */}
        <PageSection>
          <Card hover={false} animate={false}>
            <h3 className="font-display font-semibold text-sm text-text-primary mb-4">API Keys</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Claude API Key
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={form.claude_api_key ?? ''}
                    onChange={e => set('claude_api_key', e.target.value)}
                    placeholder="sk-ant-..."
                    className="input-field w-full pr-10"
                  />
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                    aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
                  >
                    {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <p className="text-2xs text-text-muted">Stored encrypted in Supabase. Used for Resume Optimizer and DM drafts.</p>
              </div>

              <Input
                label="n8n Webhook URL"
                value={(form as Record<string, string>)['n8n_webhook_url'] ?? ''}
                onChange={e => set('notification_email', e.target.value)}
                placeholder="https://your-n8n.onrender.com/webhook/..."
              />
            </div>
          </Card>
        </PageSection>
      </div>
    </PageWrapper>
  )
}
