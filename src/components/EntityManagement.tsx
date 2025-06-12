
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Database, Tags } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Entity {
  id: string;
  name: string;
  description?: string;
  categoryId?: string;
  geographyId?: string;
  attributeIds: string[];
  status: 'draft' | 'active' | 'inactive';
}

export const EntityManagement = () => {
  const { toast } = useToast();
  const [entities, setEntities] = useState<Entity[]>([
    { 
      id: '1', 
      name: 'Product Catalog', 
      description: 'Master product information',
      categoryId: '1',
      geographyId: '1',
      attributeIds: ['1', '2', '3', '4'],
      status: 'active'
    },
    { 
      id: '2', 
      name: 'Store Information', 
      description: 'Physical store data',
      categoryId: '6',
      geographyId: '2',
      attributeIds: ['1', '5'],
      status: 'active'
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    geographyId: '',
    attributeIds: [] as string[],
  });

  // Mock data for attributes
  const availableAttributes = [
    { id: '1', name: 'Product Name', type: 'string' },
    { id: '2', name: 'Price', type: 'number' },
    { id: '3', name: 'Brand', type: 'dropdown' },
    { id: '4', name: 'In Stock', type: 'boolean' },
    { id: '5', name: 'Launch Date', type: 'date' },
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      categoryId: '',
      geographyId: '',
      attributeIds: [],
    });
    setEditingEntity(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({ title: "Entity name is required!", variant: "destructive" });
      return;
    }
    
    if (editingEntity) {
      setEntities(prev => prev.map(entity => 
        entity.id === editingEntity.id 
          ? { 
              ...entity, 
              name: formData.name,
              description: formData.description,
              categoryId: formData.categoryId || undefined,
              geographyId: formData.geographyId || undefined,
              attributeIds: formData.attributeIds,
            }
          : entity
      ));
      toast({ title: "Entity updated successfully!" });
    } else {
      const newEntity: Entity = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        categoryId: formData.categoryId || undefined,
        geographyId: formData.geographyId || undefined,
        attributeIds: formData.attributeIds,
        status: 'draft',
      };
      setEntities(prev => [...prev, newEntity]);
      toast({ title: "Entity created successfully!" });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (entity: Entity) => {
    setEditingEntity(entity);
    setFormData({
      name: entity.name,
      description: entity.description || '',
      categoryId: entity.categoryId || '',
      geographyId: entity.geographyId || '',
      attributeIds: entity.attributeIds,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (entityId: string) => {
    setEntities(prev => prev.filter(entity => entity.id !== entityId));
    toast({ title: "Entity deleted successfully!" });
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const toggleAttribute = (attributeId: string) => {
    setFormData(prev => ({
      ...prev,
      attributeIds: prev.attributeIds.includes(attributeId)
        ? prev.attributeIds.filter(id => id !== attributeId)
        : [...prev.attributeIds, attributeId]
    }));
  };

  const getStatusColor = (status: Entity['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Entity Management</h1>
          <p className="text-slate-600 mt-1">Combine attributes into reusable data objects.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus size={18} className="mr-2" />
              Add Entity
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{editingEntity ? 'Edit Entity' : 'Create New Entity'}</DialogTitle>
              <DialogDescription>
                {editingEntity ? 'Update the entity details below.' : 'Define a new entity by combining attributes.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Entity Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter entity name"
                    required
                  />
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
                      <SelectItem value="6">Clothing</SelectItem>
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
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-1"></div>
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the purpose of this entity"
                  rows={3}
                />
              </div>

              <div>
                <Label>Select Attributes</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                  {availableAttributes.map((attribute) => (
                    <div key={attribute.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`attr-${attribute.id}`}
                        checked={formData.attributeIds.includes(attribute.id)}
                        onChange={() => toggleAttribute(attribute.id)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={`attr-${attribute.id}`} className="text-sm">
                        {attribute.name} ({attribute.type})
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => handleDialogOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingEntity ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Entities</CardTitle>
          <CardDescription>All defined entities with their attributes and configurations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {entities.map((entity) => (
              <div key={entity.id} className="flex items-start justify-between p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-all">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mt-1">
                    <Database size={24} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-slate-900">{entity.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(entity.status)}`}>
                        {entity.status}
                      </span>
                    </div>
                    {entity.description && (
                      <p className="text-sm text-slate-600 mb-2">{entity.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {entity.attributeIds.map(attrId => {
                        const attr = availableAttributes.find(a => a.id === attrId);
                        return attr ? (
                          <span key={attrId} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                            <Tags size={12} />
                            {attr.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(entity)}
                    className="hover:bg-blue-50"
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(entity.id)}
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
