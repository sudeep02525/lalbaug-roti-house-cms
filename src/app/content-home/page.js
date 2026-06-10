"use client"
import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, CheckCircle2 } from 'lucide-react'
import { useAutoSave } from '@/hooks/useAutoSave'

export default function HomeContentPage() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploadingHero, setUploadingHero] = useState(false)
  const [uploadingCraft, setUploadingCraft] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

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
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/settings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      })
      const data = await res.json()
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
      },
      body: JSON.stringify({
        heroTitle1: dataToSave.heroTitle1,
        heroTitle2: dataToSave.heroTitle2,
        heroSubtitle: dataToSave.heroSubtitle,
        heroImage: dataToSave.heroImage,
        craftTitle: dataToSave.craftTitle,
        craftDescription: dataToSave.craftDescription,
        craftImage: dataToSave.craftImage,
        craftImages: dataToSave.craftImages
      }),
    })
    if (!res.ok) throw new Error('Failed to save settings')
  }, [])

  const { saveState } = useAutoSave(settings, saveToApi)

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (field === 'heroImage') setUploadingHero(true);
    if (field === 'craftImage') setUploadingCraft(true);
    
    try {
      const token = localStorage.getItem("admin_token")
      const formData = new FormData();
      formData.append('image', file);
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/catalog/products/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      
      const data = await res.json();
      if (data.success) {
        if (field === 'craftImages') {
          const currentImages = settings?.craftImages || [];
          handleChange('craftImages', [...currentImages, data.data.imageUrl]);
        } else {
          handleChange(field, data.data.imageUrl);
        }
        showToast('Image uploaded successfully');
      } else {
        showToast('Upload failed: ' + data.message, 'error');
      }
    } catch(err) {
      showToast('Error uploading image', 'error');
    } finally {
      if (field === 'heroImage') setUploadingHero(false);
      if (field === 'craftImages') setUploadingCraft(false);
    }
  }

  const handleRemoveCraftImage = (indexToRemove) => {
    const currentImages = settings?.craftImages || [];
    handleChange('craftImages', currentImages.filter((_, idx) => idx !== indexToRemove));
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
          <h1 className="text-2xl md:text-3xl font-extrabold text-[var(--foreground)] tracking-tight">Home Page Content</h1>
          <p className="text-[var(--muted-foreground)] mt-1">Manage the text and images shown on the website homepage. Changes are saved automatically.</p>
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
          <CardTitle>Hero Section</CardTitle>
          <CardDescription>The main banner text and image on the homepage.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Hero Title Line 1</label>
              <Input
                value={settings?.heroTitle1 || ''}
                onChange={e => handleChange('heroTitle1', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Hero Title Line 2</label>
              <Input
                value={settings?.heroTitle2 || ''}
                onChange={e => handleChange('heroTitle2', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Hero Subtitle</label>
              <Input
                value={settings?.heroSubtitle || ''}
                onChange={e => handleChange('heroSubtitle', e.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium leading-none block">Hero Image</label>
              <div className="flex items-start gap-4">
                {settings?.heroImage && (
                  <div className="relative group rounded-xl border border-[var(--border)] overflow-hidden shadow-sm">
                    <img src={getImageUrl(settings?.heroImage)} alt="Hero Banner" className="w-32 h-24 object-cover" />
                    <button 
                      onClick={() => handleChange('heroImage', '')}
                      className="absolute inset-0 bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm"
                      title="Remove image"
                    >
                      <div className="bg-red-500 text-white p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                      </div>
                    </button>
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={e => handleImageUpload(e, 'heroImage')}
                    className="text-sm text-[var(--muted-foreground)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--primary)] file:text-white hover:file:bg-[var(--primary)]/90 cursor-pointer"
                    disabled={uploadingHero}
                  />
                  {uploadingHero && <p className="text-xs text-[var(--primary)] mt-2 font-medium">Uploading...</p>}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-panel premium-shadow overflow-hidden">
        <CardHeader className="border-b border-[var(--border)]/50 bg-black/5 dark:bg-white/5">
          <CardTitle>Our Craft Section</CardTitle>
          <CardDescription>Manage the 'Our Craft' section on the homepage.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Craft Title</label>
              <Input
                value={settings?.craftTitle || ''}
                onChange={e => handleChange('craftTitle', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Craft Description</label>
              <textarea
                value={settings?.craftDescription || ''}
                onChange={e => handleChange('craftDescription', e.target.value)}
                className="flex min-h-[100px] w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none block">Craft Images Gallery</label>
              <p className="text-xs text-[var(--muted-foreground)] mb-2">Upload multiple images. They will fade between each other on the home page.</p>
              
              <div className="flex flex-wrap gap-4 mb-4">
                {(settings?.craftImages || []).map((imgUrl, idx) => (
                  <div key={idx} className="relative group rounded-xl border border-[var(--border)] overflow-hidden shadow-sm">
                    <img src={getImageUrl(imgUrl)} alt={`Craft ${idx}`} className="w-32 h-24 object-cover" />
                    <button 
                      onClick={() => handleRemoveCraftImage(idx)}
                      className="absolute inset-0 bg-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm"
                      title="Remove image"
                    >
                      <div className="bg-red-500 text-white p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="flex items-start gap-4 flex-col sm:flex-row">
                <div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={e => handleImageUpload(e, 'craftImages')}
                    className="text-sm text-[var(--muted-foreground)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--primary)] file:text-white hover:file:bg-[var(--primary)]/90 cursor-pointer"
                    disabled={uploadingCraft}
                  />
                  {uploadingCraft && <p className="text-xs text-[var(--primary)] mt-2 font-medium">Uploading...</p>}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
