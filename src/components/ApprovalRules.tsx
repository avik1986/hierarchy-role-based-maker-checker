
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Settings, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApprovalRule {
  id: string;
  name: string;
  entityType: string;
  makerRoles: string[];
  checkerRoles: string[];
  isActive: boolean;
}

export const ApprovalRules = () => {
  const { toast } = useToast();
  const [rules, setRules] = useState<ApprovalRule[]>([
    {
      id: '1',
      name: 'Category Management Rule',
      entityType: 'Category',
      makerRoles: ['maker'],
      checkerRoles: ['checker', 'admin'],
      isActive: true
    },
    {
      id: '2',
      name: 'User Creation Rule',
      entityType: 'User',
      makerRoles: ['admin'],
      checkerRoles: ['admin'],
      isActive: true
    },
    {
      id: '3',
      name: 'Geography Update Rule',
      entityType: 'Geography',
      makerRoles: ['maker', 'admin'],
      checkerRoles: ['checker'],
      isActive: true
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<ApprovalRule | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    entityType: '',
    makerRoles: [] as string[],
    checkerRoles: [] as string[]
  });

  const entityTypes = ['Category', 'Geography', 'Role', 'User', 'Attribute', 'Entity'];
  const roles = ['admin', 'maker', 'checker', 'viewer'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({ title: "Rule name is required!", variant: "destructive" });
      return;
    }
    
    if (!formData.entityType) {
      toast({ title: "Entity type is required!", variant: "destructive" });
      return;
    }
    
    if (formData.makerRoles.length === 0) {
      toast({ title: "At least one maker role is required!", variant: "destructive" });
      return;
    }
    
    if (formData.checkerRoles.length === 0) {
      toast({ title: "At least one checker role is required!", variant: "destructive" });
      return;
    }
    
    if (editingRule) {
      setRules(prev => prev.map(rule => 
        rule.id === editingRule.id 
          ? { ...rule, ...formData }
          : rule
      ));
      toast({ title: "Approval rule updated successfully!" });
    } else {
      const newRule: ApprovalRule = {
        id: Date.now().toString(),
        ...formData,
        isActive: true
      };
      setRules(prev => [...prev, newRule]);
      toast({ title: "Approval rule created successfully!" });
    }
    
    setIsDialogOpen(false);
    setEditingRule(null);
    setFormData({ name: '', entityType: '', makerRoles: [], checkerRoles: [] });
  };

  const handleEdit = (rule: ApprovalRule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      entityType: rule.entityType,
      makerRoles: rule.makerRoles,
      checkerRoles: rule.checkerRoles
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (ruleId: string) => {
    setRules(prev => prev.filter(rule => rule.id !== ruleId));
    toast({ title: "Approval rule deleted successfully!" });
  };

  const toggleRuleStatus = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, isActive: !rule.isActive }
        : rule
    ));
    toast({ title: "Rule status updated!" });
  };

  const toggleRole = (roleArray: string[], role: string, setter: (roles: string[]) => void) => {
    if (roleArray.includes(role)) {
      setter(roleArray.filter(r => r !== role));
    } else {
      setter([...roleArray, role]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Approval Rules</h1>
          <p className="text-slate-600 mt-1">Configure approval workflows for different entity types.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus size={18} className="mr-2" />
              Add Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingRule ? 'Edit Approval Rule' : 'Create New Approval Rule'}</DialogTitle>
              <DialogDescription>
                {editingRule ? 'Update the approval rule details below.' : 'Define a new approval rule for entity management.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Rule Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter rule name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="entityType">Entity Type</Label>
                  <Select value={formData.entityType} onValueChange={(value) => setFormData(prev => ({ ...prev, entityType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select entity type" />
                    </SelectTrigger>
                    <SelectContent>
                      {entityTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Maker Roles</Label>
                  <div className="border rounded-lg p-3 space-y-2">
                    {roles.map(role => (
                      <div key={role} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`maker-${role}`}
                          checked={formData.makerRoles.includes(role)}
                          onChange={() => toggleRole(formData.makerRoles, role, (roles) => 
                            setFormData(prev => ({ ...prev, makerRoles: roles }))
                          )}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor={`maker-${role}`} className="text-sm capitalize">
                          {role}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Checker Roles</Label>
                  <div className="border rounded-lg p-3 space-y-2">
                    {roles.map(role => (
                      <div key={role} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`checker-${role}`}
                          checked={formData.checkerRoles.includes(role)}
                          onChange={() => toggleRole(formData.checkerRoles, role, (roles) => 
                            setFormData(prev => ({ ...prev, checkerRoles: roles }))
                          )}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor={`checker-${role}`} className="text-sm capitalize">
                          {role}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingRule ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Approval Rules</CardTitle>
          <CardDescription>Manage approval workflows for different entity types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <Shield size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{rule.name}</h3>
                    <p className="text-sm text-slate-600">Entity: {rule.entityType}</p>
                    <div className="flex gap-4 mt-1">
                      <span className="text-xs text-slate-500">
                        Makers: {rule.makerRoles.join(', ')}
                      </span>
                      <span className="text-xs text-slate-500">
                        Checkers: {rule.checkerRoles.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleRuleStatus(rule.id)}
                    className={rule.isActive ? 'text-green-600' : 'text-red-600'}
                  >
                    {rule.isActive ? 'Active' : 'Inactive'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(rule)}
                    className="hover:bg-blue-50"
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(rule.id)}
                    className="hover:bg-red-50 text-red-600"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
