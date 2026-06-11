"use client"
import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, CheckCircle2 } from 'lucide-react'
import { useAutoSave } from '@/hooks/useAutoSave'
import axios from "axios"

export default function ContactContentPage() {
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
        restaurantAddress: dataToSave.restaurantAddress,
        restaurantEmail: dataToSave.restaurantEmail,
        whatsappNumber: dataToSave.whatsappNumber,
        footerDescription: dataToSave.footerDescription,
        facebookUrl: dataToSave.facebookUrl,
        instagramUrl: dataToSave.instagramUrl
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
          <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">Contact & Footer Content</h1>
          <p className="text-[var(--muted-foreground)] mt-1">Manage contact information and social links. Changes are saved automatically.</p>
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
          <CardTitle>Contact Details</CardTitle>
          <CardDescription>Address, Email, and WhatsApp number used in Contact Page and Footer.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium leading-none">Restaurant Address</label>
              <Input
                value={settings?.restaurantAddress || ''}
                onChange={e => handleChange('restaurantAddress', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Email Address</label>
              <Input
                value={settings?.restaurantEmail || ''}
                onChange={e => handleChange('restaurantEmail', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">WhatsApp Number</label>
              <Input
                value={settings?.whatsappNumber || ''}
                onChange={e => handleChange('whatsappNumber', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-panel premium-shadow overflow-hidden">
        <CardHeader className="border-b border-[var(--border)]/50 bg-black/5 dark:bg-white/5">
          <CardTitle>Footer & Social</CardTitle>
          <CardDescription>Social links and text displayed in the website footer.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium leading-none">Footer Description</label>
              <Input
                value={settings?.footerDescription || ''}
                onChange={e => handleChange('footerDescription', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Facebook URL</label>
              <Input
                value={settings?.facebookUrl || ''}
                onChange={e => handleChange('facebookUrl', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Instagram URL</label>
              <Input
                value={settings?.instagramUrl || ''}
                onChange={e => handleChange('instagramUrl', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
