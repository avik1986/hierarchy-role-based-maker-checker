
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Settings, Shield, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RuleCondition {
  id: string;
  attribute: string;
  operator: string;
  values: string[];
  logicalOperator?: 'AND' | 'OR';
}

interface ApprovalRule {
  id: string;
  name: string;
  entityType: string;
  conditions: RuleCondition[];
  assignedRoles: string[];
  assignedUsers: string[];
  isActive: boolean;
  description?: string;
}

export const ApprovalRules = () => {
  const { toast } = useToast();
  const [rules, setRules] = useState<ApprovalRule[]>([
    {
      id: '1',
      name: 'High Value Product Rule',
      entityType: 'Product',
      conditions: [
        { id: '1', attribute: 'price', operator: 'greater_than', values: ['1000'], logicalOperator: 'AND' },
        { id: '2', attribute: 'category', operator: 'in', values: ['Electronics', 'Luxury'], logicalOperator: undefined }
      ],
      assignedRoles: ['checker', 'admin'],
      assignedUsers: ['1', '3'],
      isActive: true,
      description: 'Requires approval for high-value products'
    },
    {
      id: '2',
      name: 'User Creation Rule',
      entityType: 'User',
      conditions: [
        { id: '1', attribute: 'role', operator: 'equals', values: ['admin'], logicalOperator: undefined }
      ],
      assignedRoles: ['admin'],
      assignedUsers: ['1'],
      isActive: true
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<ApprovalRule | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    entityType: '',
    description: '',
    conditions: [] as RuleCondition[],
    assignedRoles: [] as string[],
    assignedUsers: [] as string[]
  });

  const entityTypes = ['Product', 'Category', 'Geography', 'Role', 'User', 'Attribute', 'Entity'];
  const roles = ['admin', 'maker', 'checker', 'viewer'];
  const users = [
    { id: '1', name: 'John Admin' },
    { id: '2', name: 'Jane Maker' },
    { id: '3', name: 'Bob Checker' },
    { id: '4', name: 'Alice Viewer' }
  ];

  const availableAttributes = [
    { id: 'name', name: 'Name', type: 'string' },
    { id: 'price', name: 'Price', type: 'number' },
    { id: 'category', name: 'Category', type: 'string' },
    { id: 'brand', name: 'Brand', type: 'string' },
    { id: 'status', name: 'Status', type: 'string' },
    { id: 'role', name: 'Role', type: 'string' },
    { id: 'date_created', name: 'Date Created', type: 'date' }
  ];

  const operators = [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'greater_than_equal', label: 'Greater Than or Equal' },
    { value: 'less_than_equal', label: 'Less Than or Equal' },
    { value: 'in', label: 'In' },
    { value: 'not_in', label: 'Not In' },
    { value: 'like', label: 'Like' },
    { value: 'regex', label: 'Regex' }
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      entityType: '',
      description: '',
      conditions: [],
      assignedRoles: [],
      assignedUsers: []
    });
    setEditingRule(null);
  };

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
    
    if (formData.conditions.length === 0) {
      toast({ title: "At least one condition is required!", variant: "destructive" });
      return;
    }
    
    if (formData.assignedRoles.length === 0 && formData.assignedUsers.length === 0) {
      toast({ title: "At least one role or user assignment is required!", variant: "destructive" });
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
    resetForm();
  };

  const handleEdit = (rule: ApprovalRule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      entityType: rule.entityType,
      description: rule.description || '',
      conditions: rule.conditions,
      assignedRoles: rule.assignedRoles,
      assignedUsers: rule.assignedUsers
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (ruleId: string) => {
    setRules(prev => prev.filter(rule => rule.id !== ruleId));
    toast({ title: "Approval rule deleted successfully!" });
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const toggleRuleStatus = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, isActive: !rule.isActive }
        : rule
    ));
    toast({ title: "Rule status updated!" });
  };

  const addCondition = () => {
    const newCondition: RuleCondition = {
      id: Date.now().toString(),
      attribute: '',
      operator: 'equals',
      values: [''],
      logicalOperator: formData.conditions.length > 0 ? 'AND' : undefined
    };
    setFormData(prev => ({
      ...prev,
      conditions: [...prev.conditions, newCondition]
    }));
  };

  const updateCondition = (index: number, field: keyof RuleCondition, value: any) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.map((condition, i) =>
        i === index ? { ...condition, [field]: value } : condition
      )
    }));
  };

  const removeCondition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  const updateConditionValue = (conditionIndex: number, valueIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.map((condition, i) =>
        i === conditionIndex
          ? {
              ...condition,
              values: condition.values.map((v, vi) => vi === valueIndex ? value : v)
            }
          : condition
      )
    }));
  };

  const addConditionValue = (conditionIndex: number) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.map((condition, i) =>
        i === conditionIndex
          ? { ...condition, values: [...condition.values, ''] }
          : condition
      )
    }));
  };

  const removeConditionValue = (conditionIndex: number, valueIndex: number) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.map((condition, i) =>
        i === conditionIndex
          ? { ...condition, values: condition.values.filter((_, vi) => vi !== valueIndex) }
          : condition
      )
    }));
  };

  const toggleAssignment = (type: 'roles' | 'users', id: string) => {
    const fieldName = type === 'roles' ? 'assignedRoles' : 'assignedUsers';
    setFormData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].includes(id)
        ? prev[fieldName].filter(item => item !== id)
        : [...prev[fieldName], id]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Approval Rules</h1>
          <p className="text-slate-600 mt-1">Configure advanced approval workflows with conditions and assignments.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus size={18} className="mr-2" />
              Add Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingRule ? 'Edit Approval Rule' : 'Create New Approval Rule'}</DialogTitle>
              <DialogDescription>
                {editingRule ? 'Update the approval rule details below.' : 'Define a new approval rule with conditions and assignments.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  <Label htmlFor="entityType">Applicable Entity</Label>
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

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the purpose of this rule"
                  rows={2}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Rule Conditions</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addCondition}>
                    <Plus size={14} className="mr-1" />
                    Add Condition
                  </Button>
                </div>
                <div className="space-y-4 border rounded-lg p-4">
                  {formData.conditions.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">No conditions added yet. Click "Add Condition" to start.</p>
                  ) : (
                    formData.conditions.map((condition, index) => (
                      <div key={condition.id} className="border rounded-lg p-4 bg-slate-50">
                        {index > 0 && (
                          <div className="mb-3">
                            <Label>Logical Operator</Label>
                            <Select 
                              value={condition.logicalOperator || 'AND'} 
                              onValueChange={(value: 'AND' | 'OR') => updateCondition(index, 'logicalOperator', value)}
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="AND">AND</SelectItem>
                                <SelectItem value="OR">OR</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                        <div className="grid grid-cols-12 gap-3 items-end">
                          <div className="col-span-4">
                            <Label>Attribute</Label>
                            <Select 
                              value={condition.attribute} 
                              onValueChange={(value) => updateCondition(index, 'attribute', value)}
                            >
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
                          <div className="col-span-3">
                            <Label>Operator</Label>
                            <Select 
                              value={condition.operator} 
                              onValueChange={(value) => updateCondition(index, 'operator', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {operators.map(op => (
                                  <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-4">
                            <Label>Values</Label>
                            <div className="space-y-2">
                              {condition.values.map((value, valueIndex) => (
                                <div key={valueIndex} className="flex gap-2">
                                  <Input
                                    value={value}
                                    onChange={(e) => updateConditionValue(index, valueIndex, e.target.value)}
                                    placeholder="Enter value"
                                  />
                                  {condition.values.length > 1 && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => removeConditionValue(index, valueIndex)}
                                    >
                                      <X size={14} />
                                    </Button>
                                  )}
                                </div>
                              ))}
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addConditionValue(index)}
                              >
                                <Plus size={14} className="mr-1" />
                                Add Value
                              </Button>
                            </div>
                          </div>
                          <div className="col-span-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeCondition(index)}
                              className="text-red-600"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label>Assigned Roles</Label>
                  <div className="border rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto">
                    {roles.map(role => (
                      <div key={role} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`role-${role}`}
                          checked={formData.assignedRoles.includes(role)}
                          onChange={() => toggleAssignment('roles', role)}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor={`role-${role}`} className="text-sm capitalize">
                          {role}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Assigned Users</Label>
                  <div className="border rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto">
                    {users.map(user => (
                      <div key={user.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`user-${user.id}`}
                          checked={formData.assignedUsers.includes(user.id)}
                          onChange={() => toggleAssignment('users', user.id)}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor={`user-${user.id}`} className="text-sm">
                          {user.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => handleDialogOpenChange(false)}>
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
          <CardDescription>Advanced approval workflows with conditions and assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-start justify-between p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-all">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mt-1">
                    <Shield size={24} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-slate-900">{rule.name}</h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {rule.entityType}
                      </span>
                    </div>
                    {rule.description && (
                      <p className="text-sm text-slate-600 mb-2">{rule.description}</p>
                    )}
                    <div className="text-sm text-slate-600 space-y-1">
                      <div>Conditions: {rule.conditions.length} rule(s)</div>
                      <div>Assigned to: {rule.assignedRoles.length} role(s), {rule.assignedUsers.length} user(s)</div>
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
