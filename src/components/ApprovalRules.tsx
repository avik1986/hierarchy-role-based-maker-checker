
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Settings, Users, Tags } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApprovalRule {
  id: string;
  name: string;
  attributeId: string;
  makerRoles: string[];
  checkerRoles: string[];
  requiresAllCheckers: boolean;
  status: 'active' | 'inactive';
}

export const ApprovalRules = () => {
  const { toast } = useToast();
  const [rules, setRules] = useState<ApprovalRule[]>([
    {
      id: '1',
      name: 'Product Price Approval',
      attributeId: '2',
      makerRoles: ['maker'],
      checkerRoles: ['checker', 'admin'],
      requiresAllCheckers: false,
      status: 'active'
    },
    {
      id: '2',
      name: 'Product Brand Approval',
      attributeId: '3',
      makerRoles: ['maker'],
      checkerRoles: ['admin'],
      requiresAllCheckers: true,
      status: 'active'
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<ApprovalRule | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    attributeId: '',
    makerRoles: [] as string[],
    checkerRoles: [] as string[],
    requiresAllCheckers: false,
  });

  // Mock data
  const availableAttributes = [
    { id: '1', name: 'Product Name' },
    { id: '2', name: 'Price' },
    { id: '3', name: 'Brand' },
    { id: '4', name: 'In Stock' },
    { id: '5', name: 'Launch Date' },
  ];

  const availableRoles = ['maker', 'checker', 'admin', 'viewer'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingRule) {
      setRules(prev => prev.map(rule => 
        rule.id === editingRule.id 
          ? { 
              ...rule, 
              name: formData.name,
              attributeId: formData.attributeId,
              makerRoles: formData.makerRoles,
              checkerRoles: formData.checkerRoles,
              requiresAllCheckers: formData.requiresAllCheckers,
            }
          : rule
      ));
      toast({ title: "Approval rule updated successfully!" });
    } else {
      const newRule: ApprovalRule = {
        id: Date.now().toString(),
        name: formData.name,
        attributeId: formData.attributeId,
        makerRoles: formData.makerRoles,
        checkerRoles: formData.checkerRoles,
        requiresAllCheckers: formData.requiresAllCheckers,
        status: 'active',
      };
      setRules(prev => [...prev, newRule]);
      toast({ title: "Approval rule created successfully!" });
    }
    
    setIsDialogOpen(false);
    setEditingRule(null);
    setFormData({ name: '', attributeId: '', makerRoles: [], checkerRoles: [], requiresAllCheckers: false });
  };

  const handleEdit = (rule: ApprovalRule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      attributeId: rule.attributeId,
      makerRoles: rule.makerRoles,
      checkerRoles: rule.checkerRoles,
      requiresAllCheckers: rule.requiresAllCheckers,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (ruleId: string) => {
    setRules(prev => prev.filter(rule => rule.id !== ruleId));
    toast({ title: "Approval rule deleted successfully!" });
  };

  const toggleRole = (role: string, type: 'maker' | 'checker') => {
    const field = type === 'maker' ? 'makerRoles' : 'checkerRoles';
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(role)
        ? prev[field].filter(r => r !== role)
        : [...prev[field], role]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Approval Rules</h1>
          <p className="text-slate-600 mt-1">Configure rules for who can approve what changes.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus size={18} className="mr-2" />
              Add Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{editingRule ? 'Edit Approval Rule' : 'Create New Approval Rule'}</DialogTitle>
              <DialogDescription>
                {editingRule ? 'Update the approval rule details below.' : 'Define a new approval rule for attributes.'}
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
                  <Label htmlFor="attribute">Attribute</Label>
                  <Select value={formData.attributeId} onValueChange={(value) => setFormData(prev => ({ ...prev, attributeId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select attribute" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableAttributes.map(attr => (
                        <SelectItem key={attr.id} value={attr.id}>{attr.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label>Maker Roles (Can Create/Edit)</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2 border rounded-lg p-3">
                    {availableRoles.map((role) => (
                      <div key={role} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`maker-${role}`}
                          checked={formData.makerRoles.includes(role)}
                          onChange={() => toggleRole(role, 'maker')}
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
                  <Label>Checker Roles (Can Approve)</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2 border rounded-lg p-3">
                    {availableRoles.map((role) => (
                      <div key={role} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`checker-${role}`}
                          checked={formData.checkerRoles.includes(role)}
                          onChange={() => toggleRole(role, 'checker')}
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

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="requiresAll"
                  checked={formData.requiresAllCheckers}
                  onChange={(e) => setFormData(prev => ({ ...prev, requiresAllCheckers: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="requiresAll">Require approval from all checker roles</Label>
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
          <CardTitle>Active Approval Rules</CardTitle>
          <CardDescription>Rules defining approval workflows for different attributes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {rules.map((rule) => {
              const attribute = availableAttributes.find(a => a.id === rule.attributeId);
              return (
                <div key={rule.id} className="flex items-start justify-between p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-all">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mt-1">
                      <Settings size={24} className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900">{rule.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${rule.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {rule.status}
                        </span>
                      </div>
                      
                      {attribute && (
                        <div className="flex items-center gap-2 mb-2">
                          <Tags size={16} className="text-blue-600" />
                          <span className="text-sm text-slate-600">Attribute: {attribute.name}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Users size={14} className="text-green-600" />
                            <span className="text-sm font-medium text-slate-700">Makers</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {rule.makerRoles.map(role => (
                              <span key={role} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded capitalize">
                                {role}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Users size={14} className="text-purple-600" />
                            <span className="text-sm font-medium text-slate-700">Checkers</span>
                            {rule.requiresAllCheckers && (
                              <span className="px-1 py-0.5 bg-orange-100 text-orange-800 text-xs rounded">All Required</span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {rule.checkerRoles.map(role => (
                              <span key={role} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded capitalize">
                                {role}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
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
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
