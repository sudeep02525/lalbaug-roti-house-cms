"use client"
import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, CheckCircle2 } from 'lucide-react'
import { useAutoSave } from '@/hooks/useAutoSave'
import axios from "axios"

export default function AboutContentPage() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/settings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }, validateStatus: () => true
      })
      const data = res.data
      if (data.success) {
        setSettings(data.data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveToApi = useCallback(async (dataToSave) => {
    const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/settings`, {
        aboutHeroTitle: dataToSave.aboutHeroTitle,
        aboutHeroSubtitle: dataToSave.aboutHeroSubtitle,
        aboutHeroDescription: dataToSave.aboutHeroDescription,
        missionDescription: dataToSave.missionDescription,
        visionDescription: dataToSave.visionDescription
    }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
      }, validateStatus: () => true
    })
    if (res.status !== 200 && res.status !== 201) throw new Error('Failed to save settings')
  }, [])

  const { saveState } = useAutoSave(settings, saveToApi)

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="flex-1 p-4 md:p-8 pt-20 md:pt-8 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
      </div>
    )
  }

  return (
    <div className="flex-1 p-4 md:p-8 pt-20 md:pt-8 max-w-5xl mx-auto w-full animate-fade-in space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">About Page Content</h1>
          <p className="text-[var(--muted-foreground)] mt-1">Update content on the About Us page. Changes are saved automatically.</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium h-11 px-4 rounded-xl border border-[var(--border)] bg-black/5 dark:bg-white/5">
          {saveState === 'saving' && <><Loader2 className="w-4 h-4 animate-spin text-[var(--primary)]" /> <span className="text-[var(--primary)]">Saving...</span></>}
          {saveState === 'saved' && <><CheckCircle2 className="w-4 h-4 text-green-500" /> <span className="text-green-500">Saved</span></>}
          {saveState === 'error' && <span className="text-red-500">Error saving</span>}
          {saveState === 'idle' && <span className="text-[var(--muted-foreground)]">All changes saved</span>}
        </div>
      </div>

      <Card className="glass-panel premium-shadow overflow-hidden">
        <CardHeader className="border-b border-[var(--border)]/50 bg-black/5 dark:bg-white/5">
          <CardTitle>About Section</CardTitle>
          <CardDescription>Hero, Mission, and Vision text.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">About Hero Title</label>
                <Input
                  value={settings?.aboutHeroTitle || ''}
                  onChange={e => handleChange('aboutHeroTitle', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">About Hero Subtitle</label>
                <Input
                  value={settings?.aboutHeroSubtitle || ''}
                  onChange={e => handleChange('aboutHeroSubtitle', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">About Hero Description</label>
              <textarea
                value={settings?.aboutHeroDescription || ''}
                onChange={e => handleChange('aboutHeroDescription', e.target.value)}
                className="flex min-h-[80px] w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Mission Description</label>
              <textarea
                value={settings?.missionDescription || ''}
                onChange={e => handleChange('missionDescription', e.target.value)}
                className="flex min-h-[80px] w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Vision Description</label>
              <textarea
                value={settings?.visionDescription || ''}
                onChange={e => handleChange('visionDescription', e.target.value)}
                className="flex min-h-[80px] w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
