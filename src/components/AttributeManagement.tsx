
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Tags, Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Attribute {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'dropdown' | 'multiselect';
  description?: string;
  isRequired: boolean;
  defaultValue?: string;
  options?: string[];
}

export const AttributeManagement = () => {
  const { toast } = useToast();
  const [attributes, setAttributes] = useState<Attribute[]>([
    { id: '1', name: 'Product Name', type: 'string', description: 'Name of the product', isRequired: true },
    { id: '2', name: 'Price', type: 'number', description: 'Product price in USD', isRequired: true },
    { id: '3', name: 'Brand', type: 'dropdown', description: 'Product brand', isRequired: false, options: ['Apple', 'Samsung', 'Google', 'Sony'] },
    { id: '4', name: 'In Stock', type: 'boolean', description: 'Product availability', isRequired: false, defaultValue: 'true' },
    { id: '5', name: 'Launch Date', type: 'date', description: 'Product launch date', isRequired: false }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState<Attribute | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'string' as Attribute['type'],
    description: '',
    isRequired: false,
    defaultValue: '',
    options: ['']
  });

  const attributeTypes = [
    { value: 'string', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'boolean', label: 'True/False' },
    { value: 'date', label: 'Date' },
    { value: 'dropdown', label: 'Dropdown' },
    { value: 'multiselect', label: 'Multi-select' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({ title: "Attribute name is required!", variant: "destructive" });
      return;
    }
    
    const processedOptions = (formData.type === 'dropdown' || formData.type === 'multiselect') 
      ? formData.options.filter(opt => opt.trim() !== '') 
      : undefined;
    
    if ((formData.type === 'dropdown' || formData.type === 'multiselect') && (!processedOptions || processedOptions.length === 0)) {
      toast({ title: "At least one option is required for dropdown/multiselect fields!", variant: "destructive" });
      return;
    }
    
    if (editingAttribute) {
      setAttributes(prev => prev.map(attr => 
        attr.id === editingAttribute.id 
          ? { 
              ...attr, 
              name: formData.name.trim(),
              type: formData.type,
              description: formData.description.trim() || undefined,
              isRequired: formData.isRequired,
              defaultValue: formData.defaultValue.trim() || undefined,
              options: processedOptions
            }
          : attr
      ));
      toast({ title: "Attribute updated successfully!" });
    } else {
      const newAttribute: Attribute = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        type: formData.type,
        description: formData.description.trim() || undefined,
        isRequired: formData.isRequired,
        defaultValue: formData.defaultValue.trim() || undefined,
        options: processedOptions
      };
      setAttributes(prev => [...prev, newAttribute]);
      toast({ title: "Attribute created successfully!" });
    }
    
    setIsDialogOpen(false);
    setEditingAttribute(null);
    setFormData({ name: '', type: 'string', description: '', isRequired: false, defaultValue: '', options: [''] });
  };

  const handleEdit = (attribute: Attribute) => {
    setEditingAttribute(attribute);
    setFormData({
      name: attribute.name,
      type: attribute.type,
      description: attribute.description || '',
      isRequired: attribute.isRequired,
      defaultValue: attribute.defaultValue || '',
      options: attribute.options || ['']
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (attributeId: string) => {
    setAttributes(prev => prev.filter(attr => attr.id !== attributeId));
    toast({ title: "Attribute deleted successfully!" });
  };

  const updateOption = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 1) {
      setFormData(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const getTypeColor = (type: Attribute['type']) => {
    const colors = {
      string: 'bg-blue-100 text-blue-800',
      number: 'bg-green-100 text-green-800',
      boolean: 'bg-purple-100 text-purple-800',
      date: 'bg-orange-100 text-orange-800',
      dropdown: 'bg-pink-100 text-pink-800',
      multiselect: 'bg-indigo-100 text-indigo-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Attribute Management</h1>
          <p className="text-slate-600 mt-1">Define reusable attributes for your entities.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus size={18} className="mr-2" />
              Add Attribute
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingAttribute ? 'Edit Attribute' : 'Create New Attribute'}</DialogTitle>
              <DialogDescription>
                {editingAttribute ? 'Update the attribute details below.' : 'Define a new attribute for your entities.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Attribute Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter attribute name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="type">Data Type</Label>
                  <Select value={formData.type} onValueChange={(value: Attribute['type']) => setFormData(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {attributeTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
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
                  placeholder="Describe the purpose of this attribute"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="defaultValue">Default Value (Optional)</Label>
                  <Input
                    id="defaultValue"
                    value={formData.defaultValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, defaultValue: e.target.value }))}
                    placeholder="Enter default value"
                  />
                </div>
                <div className="flex items-center space-x-2 mt-8">
                  <input
                    type="checkbox"
                    id="isRequired"
                    checked={formData.isRequired}
                    onChange={(e) => setFormData(prev => ({ ...prev, isRequired: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="isRequired">Required field</Label>
                </div>
              </div>

              {(formData.type === 'dropdown' || formData.type === 'multiselect') && (
                <div>
                  <Label>Options</Label>
                  <div className="space-y-2">
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeOption(index)}
                          disabled={formData.options.length === 1}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={addOption}>
                      <Plus size={14} className="mr-1" />
                      Add Option
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingAttribute ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Attributes</CardTitle>
          <CardDescription>All defined attributes available for entity creation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {attributes.map((attribute) => (
              <div key={attribute.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <Code size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-slate-900">{attribute.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(attribute.type)}`}>
                        {attributeTypes.find(t => t.value === attribute.type)?.label}
                      </span>
                      {attribute.isRequired && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          Required
                        </span>
                      )}
                    </div>
                    {attribute.description && (
                      <p className="text-sm text-slate-600">{attribute.description}</p>
                    )}
                    {attribute.options && (
                      <p className="text-xs text-slate-500 mt-1">
                        Options: {attribute.options.slice(0, 3).join(', ')}{attribute.options.length > 3 ? '...' : ''}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(attribute)}
                    className="hover:bg-blue-50"
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(attribute.id)}
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
