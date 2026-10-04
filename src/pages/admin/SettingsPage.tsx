import { Settings } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <h1 className="text-2xl font-bold">Settings</h1>
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Settings className="size-4" /> Store Settings</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><label className="mb-1.5 block text-sm font-medium">Store Name</label><Input defaultValue="90percent Store" /></div>
          <div><label className="mb-1.5 block text-sm font-medium">Store Email</label><Input defaultValue="support@90percent.com" type="email" /></div>
          <div><label className="mb-1.5 block text-sm font-medium">Currency</label>
            <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
          </div>
          <Button>Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  )
}
