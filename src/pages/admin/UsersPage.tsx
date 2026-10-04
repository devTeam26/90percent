import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useAdminGetUsersQuery, useAdminDeleteUserMutation } from '@/features/users/services/usersApi'
import { Skeleton } from '@/components/common/Skeleton'
import Pagination from '@/components/common/Pagination'
import { formatDate, getInitials } from '@/lib/utils'
import { toast } from 'sonner'

export default function UsersPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { data, isLoading } = useAdminGetUsersQuery({ page, search })
  const [deleteUser] = useAdminDeleteUserMutation()
  const users = data?.data ?? []
  const meta = data?.meta

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
      </div>
      <Card><CardContent className="p-4">
        <Input placeholder="Search users…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} startIcon={<Search className="size-4" />} className="max-w-sm" />
      </CardContent></Card>
      <Card><CardContent className="p-0">
        {isLoading ? (
          <div className="p-4 space-y-3">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-lg" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="p-4">User</th><th className="p-4">Role</th><th className="p-4">Verified</th><th className="p-4">Joined</th><th className="p-4">Actions</th>
              </tr></thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{getInitials(user.firstName, user.lastName)}</div>
                        <div><p className="font-medium">{user.firstName} {user.lastName}</p><p className="text-xs text-muted-foreground">{user.email}</p></div>
                      </div>
                    </td>
                    <td className="p-4"><Badge variant="secondary" className="capitalize">{user.role}</Badge></td>
                    <td className="p-4"><Badge variant={user.isEmailVerified ? 'success' : 'warning'}>{user.isEmailVerified ? 'Yes' : 'No'}</Badge></td>
                    <td className="p-4 text-sm text-muted-foreground">{formatDate(user.createdAt, { dateStyle: 'medium' })}</td>
                    <td className="p-4">
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={async () => {
                        if (window.confirm('Delete user?')) { await deleteUser(user.id); toast.success('User deleted') }
                      }}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && <div className="py-12 text-center text-muted-foreground">No users found</div>}
          </div>
        )}
      </CardContent></Card>
      {meta && meta.totalPages > 1 && <Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={setPage} />}
    </div>
  )
}
