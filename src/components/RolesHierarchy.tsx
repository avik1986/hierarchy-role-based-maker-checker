import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Role {
  id: string;
  name: string;
  department: string;
  parentId?: string;
  level: number;
}

export const RolesHierarchy = () => {
  const { toast } = useToast();
  const [roles, setRoles] = useState<Role[]>([
    { id: '1', name: 'CEO', department: 'Executive', level: 0 },
    { id: '2', name: 'Sales Director', department: 'Sales', parentId: '1', level: 1 },
    { id: '3', name: 'Finance Director', department: 'Finance', parentId: '1', level: 1 },
    { id: '4', name: 'Regional Sales Manager', department: 'Sales', parentId: '2', level: 2 },
    { id: '5', name: 'Zonal Sales Head', department: 'Sales', parentId: '4', level: 3 },
    { id: '6', name: 'Sales Executive', department: 'Sales', parentId: '5', level: 4 },
    { id: '7', name: 'Finance Manager', department: 'Finance', parentId: '3', level: 2 },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({ name: '', department: '', parentId: 'none' });

  const departments = ['Executive', 'Sales', 'Finance', 'Operations', 'HR', 'IT', 'Marketing'];

  const calculateLevel = (parentId?: string): number => {
    if (!parentId || parentId === 'none') return 0;
    const parent = roles.find(r => r.id === parentId);
    return parent ? parent.level + 1 : 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({ title: "Role name is required!", variant: "destructive" });
      return;
    }
    
    if (!formData.department) {
      toast({ title: "Department is required!", variant: "destructive" });
      return;
    }
    
    if (editingRole) {
      const newLevel = calculateLevel(formData.parentId === 'none' ? undefined : formData.parentId);
      setRoles(prev => prev.map(role => 
        role.id === editingRole.id 
          ? { 
              ...role, 
              name: formData.name.trim(), 
              department: formData.department, 
              parentId: formData.parentId === 'none' ? undefined : formData.parentId,
              level: newLevel
            }
          : role
      ));
      toast({ title: "Role updated successfully!" });
    } else {
      const newLevel = calculateLevel(formData.parentId === 'none' ? undefined : formData.parentId);
      const newRole: Role = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        department: formData.department,
        parentId: formData.parentId === 'none' ? undefined : formData.parentId,
        level: newLevel,
      };
      setRoles(prev => [...prev, newRole]);
      toast({ title: "Role created successfully!" });
    }
    
    setIsDialogOpen(false);
    setEditingRole(null);
    setFormData({ name: '', department: '', parentId: 'none' });
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({ name: role.name, department: role.department, parentId: role.parentId || 'none' });
    setIsDialogOpen(true);
  };

  const handleDelete = (roleId: string) => {
    // Check if role has children
    const hasChildren = roles.some(role => role.parentId === roleId);
    if (hasChildren) {
      toast({ title: "Cannot delete role with sub-roles!", variant: "destructive" });
      return;
    }
    
    setRoles(prev => prev.filter(role => role.id !== roleId));
    toast({ title: "Role deleted successfully!" });
  };

  const getDepartmentColor = (department: string) => {
    const colors = {
      Executive: 'bg-purple-100 text-purple-800',
      Sales: 'bg-green-100 text-green-800',
      Finance: 'bg-blue-100 text-blue-800',
      Operations: 'bg-orange-100 text-orange-800',
      HR: 'bg-pink-100 text-pink-800',
      IT: 'bg-gray-100 text-gray-800',
      Marketing: 'bg-yellow-100 text-yellow-800',
    };
    return colors[department as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const renderRoleTree = (parentId?: string, level = 0) => {
    return roles
      .filter(role => role.parentId === parentId)
      .map(role => (
        <div key={role.id} style={{ marginLeft: `${level * 24}px` }}>
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 mb-2 hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <Users size={18} className="text-blue-600" />
              <span className="font-medium text-slate-900">{role.name}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${getDepartmentColor(role.department)}`}>
                {role.department}
              </span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Level {role.level}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(role)}
                className="hover:bg-blue-50"
              >
                <Edit size={14} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(role.id)}
                className="hover:bg-red-50 text-red-600"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
          {renderRoleTree(role.id, level + 1)}
        </div>
      ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Roles Hierarchy</h1>
          <p className="text-slate-600 mt-1">Structure roles by department and organizational level.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus size={18} className="mr-2" />
              Add Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingRole ? 'Edit Role' : 'Create New Role'}</DialogTitle>
              <DialogDescription>
                {editingRole ? 'Update the role details below.' : 'Add a new role to the hierarchy.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter role name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="parent">Parent Role (Optional)</Label>
                <Select value={formData.parentId} onValueChange={(value) => setFormData(prev => ({ ...prev, parentId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (Top Level)</SelectItem>
                    {roles
                      .filter(role => editingRole ? role.id !== editingRole.id : true)
                      .map(role => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name} ({role.department})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingRole ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organizational Structure</CardTitle>
          <CardDescription>Hierarchical view of roles across departments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {renderRoleTree()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
