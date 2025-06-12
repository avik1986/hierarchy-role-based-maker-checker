
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, UserPlus, Mail, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser, UserRole } from '@/contexts/UserContext';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  geographyId?: string;
  categoryId?: string;
  status: 'active' | 'inactive';
}

export const UserManagement = () => {
  const { toast } = useToast();
  const { users, setUsers } = useUser();
  const [localUsers, setLocalUsers] = useState<User[]>([
    { id: '1', name: 'John Admin', email: 'admin@company.com', phone: '+1234567890', role: 'admin', status: 'active' },
    { id: '2', name: 'Jane Maker', email: 'maker@company.com', phone: '+1234567891', role: 'maker', status: 'active' },
    { id: '3', name: 'Bob Checker', email: 'checker@company.com', phone: '+1234567892', role: 'checker', status: 'active' },
    { id: '4', name: 'Alice Viewer', email: 'viewer@company.com', phone: '+1234567893', role: 'viewer', status: 'active' },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'viewer' as UserRole,
    geographyId: '',
    categoryId: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'viewer',
      geographyId: '',
      categoryId: '',
    });
    setEditingUser(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({ title: "Name is required!", variant: "destructive" });
      return;
    }
    
    if (!formData.email.trim()) {
      toast({ title: "Email is required!", variant: "destructive" });
      return;
    }
    
    if (!formData.phone.trim()) {
      toast({ title: "Phone is required!", variant: "destructive" });
      return;
    }
    
    if (editingUser) {
      setLocalUsers(prev => prev.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...formData, geographyId: formData.geographyId || undefined, categoryId: formData.categoryId || undefined }
          : user
      ));
      toast({ title: "User updated successfully!" });
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        ...formData,
        geographyId: formData.geographyId || undefined,
        categoryId: formData.categoryId || undefined,
        status: 'active',
      };
      setLocalUsers(prev => [...prev, newUser]);
      toast({ title: "User created successfully!" });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      geographyId: user.geographyId || '',
      categoryId: user.categoryId || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (userId: string) => {
    setLocalUsers(prev => prev.filter(user => user.id !== userId));
    toast({ title: "User deleted successfully!" });
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'checker': return 'bg-green-100 text-green-800';
      case 'maker': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-600 mt-1">Manage users with roles, geography, and category scope.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus size={18} className="mr-2" />
              Create User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Edit User' : 'Create New User'}</DialogTitle>
              <DialogDescription>
                {editingUser ? 'Update the user details below.' : 'Add a new user to the system.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={formData.role} onValueChange={(value: UserRole) => setFormData(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="checker">Checker</SelectItem>
                      <SelectItem value="maker">Maker</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="geography">Geography (Optional)</Label>
                  <Select value={formData.geographyId} onValueChange={(value) => setFormData(prev => ({ ...prev, geographyId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select geography" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No restriction</SelectItem>
                      <SelectItem value="1">United States</SelectItem>
                      <SelectItem value="2">California</SelectItem>
                      <SelectItem value="4">Los Angeles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category (Optional)</Label>
                  <Select value={formData.categoryId} onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No restriction</SelectItem>
                      <SelectItem value="1">Electronics</SelectItem>
                      <SelectItem value="2">Mobile Phones</SelectItem>
                      <SelectItem value="6">Clothing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => handleDialogOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingUser ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Users</CardTitle>
          <CardDescription>All users registered in the system with their roles and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {localUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <UserPlus size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{user.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                      <span className="flex items-center gap-1">
                        <Mail size={14} />
                        {user.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone size={14} />
                        {user.phone}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.status}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(user)}
                      className="hover:bg-blue-50"
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                      className="hover:bg-red-50 text-red-600"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
