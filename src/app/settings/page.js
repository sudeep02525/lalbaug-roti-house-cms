"use client"
import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, CheckCircle2 } from "lucide-react"
import { useAutoSave } from "@/hooks/useAutoSave"

export default function SettingsPage() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  const [initialLoad, setInitialLoad] = useState(true)
  const [bannerImageFile, setBannerImageFile] = useState(null)
  const [uploadingBanner, setUploadingBanner] = useState(false)

  const getImageUrl = (url) => {
    if (!url) return "";
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    if (url.startsWith('/uploads')) return `${apiUrl}${url}`;
    if (url.startsWith('/images')) return `${apiUrl}${url}`;
    return url;
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const freshToken = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
      const freshHeaders = { 'Authorization': `Bearer ${freshToken}`, 'Content-Type': 'application/json' }
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/settings`, {
        headers: freshHeaders
      })
      if (res.ok) {
        const data = await res.json()
        setSettings(data.data)
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err)
    } finally {
      setLoading(false)
      setInitialLoad(false)
    }
  }

  const saveToApi = useCallback(async (dataToSave) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
      },
      body: JSON.stringify({
        maxRadiusKm: Number(dataToSave.maxRadiusKm),
        restaurantLat: Number(dataToSave.restaurantLat),
        restaurantLng: Number(dataToSave.restaurantLng),
        restaurantPhone: dataToSave.restaurantPhone,
        restaurantName: dataToSave.restaurantName,
        isAcceptingOrders: dataToSave.isAcceptingOrders,
        serviceStartTime: dataToSave.serviceStartTime,
        serviceEndTime: dataToSave.serviceEndTime,
        heroTitle1: dataToSave.heroTitle1,
        heroTitle2: dataToSave.heroTitle2,
        heroSubtitle: dataToSave.heroSubtitle,
        heroImage: dataToSave.heroImage,
        footerDescription: dataToSave.footerDescription,
        facebookUrl: dataToSave.facebookUrl,
        instagramUrl: dataToSave.instagramUrl,
      }),
    })
    if (!res.ok) throw new Error('Failed to save settings')
  }, [])

  const { saveState } = useAutoSave(settings, saveToApi)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  // Hero image upload moved to home content page

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--foreground)] tracking-tight mb-2">System Settings</h1>
          <p className="text-[var(--muted-foreground)] font-medium">Configure global settings for the platform.</p>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-[var(--muted)] rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
          toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
        }`}>
          {toast.msg}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">System Settings</h1>
          <p className="text-[var(--muted-foreground)] mt-1">Manage global configuration for your restaurant. Changes are saved automatically.</p>
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
          <CardTitle>Restaurant Info</CardTitle>
          <CardDescription>Basic restaurant contact and location details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Restaurant Name</label>
              <Input
                value={settings?.restaurantName || ''}
                onChange={e => handleChange('restaurantName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Restaurant Phone</label>
              <Input
                value={settings?.restaurantPhone || ''}
                onChange={e => handleChange('restaurantPhone', e.target.value)}
                placeholder="9324688099"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Restaurant Latitude</label>
              <Input
                type="number"
                step="0.0001"
                value={settings?.restaurantLat || ''}
                onChange={e => handleChange('restaurantLat', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Restaurant Longitude</label>
              <Input
                type="number"
                step="0.0001"
                value={settings?.restaurantLng || ''}
                onChange={e => handleChange('restaurantLng', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>


      <Card className="glass-panel premium-shadow overflow-hidden">
        <CardHeader className="border-b border-[var(--border)]/50 bg-black/5 dark:bg-white/5">
          <CardTitle>Operating Hours</CardTitle>
          <CardDescription>Control when customers can place orders on the website.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="flex items-center justify-between bg-[var(--muted)]/50 p-4 rounded-lg border border-[var(--border)]">
            <div>
              <p className="font-semibold text-[var(--foreground)]">Accept Orders</p>
              <p className="text-sm text-[var(--muted-foreground)]">Manually turn the store on or off</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings?.isAcceptingOrders ?? true}
                onChange={e => handleChange('isAcceptingOrders', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
            </label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Service Start Time</label>
              <Input
                type="time"
                value={settings?.serviceStartTime || '09:00'}
                onChange={e => handleChange('serviceStartTime', e.target.value)}
              />
              <p className="text-[13px] text-[var(--muted-foreground)]">Daily opening time (IST).</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Service End Time</label>
              <Input
                type="time"
                value={settings?.serviceEndTime || '22:00'}
                onChange={e => handleChange('serviceEndTime', e.target.value)}
              />
              <p className="text-[13px] text-[var(--muted-foreground)]">Daily closing time (IST).</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-panel premium-shadow overflow-hidden">
        <CardHeader className="border-b border-[var(--border)]/50 bg-black/5 dark:bg-white/5">
          <CardTitle>Delivery Settings</CardTitle>
          <CardDescription>Update rules regarding delivery charges and order limits.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Maximum Delivery Radius (km)</label>
              <Input
                type="number"
                value={settings?.maxRadiusKm || ''}
                onChange={e => handleChange('maxRadiusKm', e.target.value)}
              />
              <p className="text-[13px] text-[var(--muted-foreground)]">Deliveries beyond this radius will be rejected.</p>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
