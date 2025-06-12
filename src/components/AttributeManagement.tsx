
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Tags } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Attribute {
  id: string;
  name: string;
  type: 'string' | 'number' | 'dropdown' | 'boolean' | 'date';
  description?: string;
  valueList?: string[];
  required: boolean;
}

export const AttributeManagement = () => {
  const { toast } = useToast();
  const [attributes, setAttributes] = useState<Attribute[]>([
    { id: '1', name: 'Product Name', type: 'string', description: 'Name of the product', required: true },
    { id: '2', name: 'Price', type: 'number', description: 'Product price in USD', required: true },
    { id: '3', name: 'Brand', type: 'dropdown', description: 'Product brand', valueList: ['Apple', 'Samsung', 'Google', 'Microsoft'], required: true },
    { id: '4', name: 'In Stock', type: 'boolean', description: 'Whether product is in stock', required: false },
    { id: '5', name: 'Launch Date', type: 'date', description: 'Product launch date', required: false },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState<Attribute | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'string' as Attribute['type'],
    description: '',
    valueList: '',
    required: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const valueArray = formData.type === 'dropdown' && formData.valueList 
      ? formData.valueList.split(',').map(v => v.trim()).filter(v => v)
      : undefined;

    if (editingAttribute) {
      setAttributes(prev => prev.map(attr => 
        attr.id === editingAttribute.id 
          ? { 
              ...attr, 
              name: formData.name, 
              type: formData.type, 
              description: formData.description,
              valueList: valueArray,
              required: formData.required 
            }
          : attr
      ));
      toast({ title: "Attribute updated successfully!" });
    } else {
      const newAttribute: Attribute = {
        id: Date.now().toString(),
        name: formData.name,
        type: formData.type,
        description: formData.description,
        valueList: valueArray,
        required: formData.required,
      };
      setAttributes(prev => [...prev, newAttribute]);
      toast({ title: "Attribute created successfully!" });
    }
    
    setIsDialogOpen(false);
    setEditingAttribute(null);
    setFormData({ name: '', type: 'string', description: '', valueList: '', required: false });
  };

  const handleEdit = (attribute: Attribute) => {
    setEditingAttribute(attribute);
    setFormData({
      name: attribute.name,
      type: attribute.type,
      description: attribute.description || '',
      valueList: attribute.valueList ? attribute.valueList.join(', ') : '',
      required: attribute.required,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (attributeId: string) => {
    setAttributes(prev => prev.filter(attr => attr.id !== attributeId));
    toast({ title: "Attribute deleted successfully!" });
  };

  const getTypeColor = (type: Attribute['type']) => {
    switch (type) {
      case 'string': return 'bg-blue-100 text-blue-800';
      case 'number': return 'bg-green-100 text-green-800';
      case 'dropdown': return 'bg-purple-100 text-purple-800';
      case 'boolean': return 'bg-orange-100 text-orange-800';
      case 'date': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Attribute Management</h1>
          <p className="text-slate-600 mt-1">Define field-level metadata with types and validation rules.</p>
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
                {editingAttribute ? 'Update the attribute details below.' : 'Define a new attribute for entities.'}
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
                      <SelectItem value="string">Text (String)</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="dropdown">Dropdown</SelectItem>
                      <SelectItem value="boolean">Yes/No (Boolean)</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
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
                  rows={3}
                />
              </div>

              {formData.type === 'dropdown' && (
                <div>
                  <Label htmlFor="valueList">Dropdown Values</Label>
                  <Input
                    id="valueList"
                    value={formData.valueList}
                    onChange={(e) => setFormData(prev => ({ ...prev, valueList: e.target.value }))}
                    placeholder="Enter values separated by commas (e.g., Apple, Samsung, Google)"
                  />
                  <p className="text-sm text-slate-600 mt-1">Separate multiple values with commas</p>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="required"
                  checked={formData.required}
                  onChange={(e) => setFormData(prev => ({ ...prev, required: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="required">This attribute is required</Label>
              </div>

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
                    <Tags size={24} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-slate-900">{attribute.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(attribute.type)}`}>
                        {attribute.type}
                      </span>
                      {attribute.required && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Required</span>
                      )}
                    </div>
                    {attribute.description && (
                      <p className="text-sm text-slate-600">{attribute.description}</p>
                    )}
                    {attribute.valueList && (
                      <p className="text-xs text-slate-500 mt-1">
                        Values: {attribute.valueList.join(', ')}
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
