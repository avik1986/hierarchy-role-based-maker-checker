
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Geography {
  id: string;
  name: string;
  type: 'country' | 'state' | 'city' | 'zone';
  parentId?: string;
  level: number;
}

export const GeographyHierarchy = () => {
  const { toast } = useToast();
  const [geographies, setGeographies] = useState<Geography[]>([
    { id: '1', name: 'United States', type: 'country', level: 0 },
    { id: '2', name: 'California', type: 'state', parentId: '1', level: 1 },
    { id: '3', name: 'Texas', type: 'state', parentId: '1', level: 1 },
    { id: '4', name: 'Los Angeles', type: 'city', parentId: '2', level: 2 },
    { id: '5', name: 'San Francisco', type: 'city', parentId: '2', level: 2 },
    { id: '6', name: 'Downtown LA', type: 'zone', parentId: '4', level: 3 },
    { id: '7', name: 'Hollywood', type: 'zone', parentId: '4', level: 3 },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGeography, setEditingGeography] = useState<Geography | null>(null);
  const [formData, setFormData] = useState({ name: '', type: 'country' as Geography['type'], parentId: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingGeography) {
      setGeographies(prev => prev.map(geo => 
        geo.id === editingGeography.id 
          ? { ...geo, name: formData.name, type: formData.type, parentId: formData.parentId || undefined }
          : geo
      ));
      toast({ title: "Geography updated successfully!" });
    } else {
      const newGeography: Geography = {
        id: Date.now().toString(),
        name: formData.name,
        type: formData.type,
        parentId: formData.parentId || undefined,
        level: formData.parentId ? (geographies.find(g => g.id === formData.parentId)?.level || 0) + 1 : 0,
      };
      setGeographies(prev => [...prev, newGeography]);
      toast({ title: "Geography created successfully!" });
    }
    
    setIsDialogOpen(false);
    setEditingGeography(null);
    setFormData({ name: '', type: 'country', parentId: '' });
  };

  const handleEdit = (geography: Geography) => {
    setEditingGeography(geography);
    setFormData({ name: geography.name, type: geography.type, parentId: geography.parentId || '' });
    setIsDialogOpen(true);
  };

  const handleDelete = (geographyId: string) => {
    setGeographies(prev => prev.filter(geo => geo.id !== geographyId && geo.parentId !== geographyId));
    toast({ title: "Geography deleted successfully!" });
  };

  const getTypeColor = (type: Geography['type']) => {
    switch (type) {
      case 'country': return 'bg-green-100 text-green-800';
      case 'state': return 'bg-blue-100 text-blue-800';
      case 'city': return 'bg-purple-100 text-purple-800';
      case 'zone': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderGeographyTree = (parentId?: string, level = 0) => {
    return geographies
      .filter(geo => geo.parentId === parentId)
      .map(geography => (
        <div key={geography.id} className={`ml-${level * 6}`}>
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 mb-2 hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-blue-600" />
              <span className="font-medium text-slate-900">{geography.name}</span>
              <span className={`text-xs px-2 py-1 rounded-full capitalize ${getTypeColor(geography.type)}`}>
                {geography.type}
              </span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Level {geography.level}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(geography)}
                className="hover:bg-blue-50"
              >
                <Edit size={14} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(geography.id)}
                className="hover:bg-red-50 text-red-600"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
          {renderGeographyTree(geography.id, level + 1)}
        </div>
      ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Geography Hierarchy</h1>
          <p className="text-slate-600 mt-1">Define operational areas like regions, cities, and zones.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus size={18} className="mr-2" />
              Add Location
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingGeography ? 'Edit Location' : 'Create New Location'}</DialogTitle>
              <DialogDescription>
                {editingGeography ? 'Update the location details below.' : 'Add a new location to the geography hierarchy.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Location Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter location name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Location Type</Label>
                <Select value={formData.type} onValueChange={(value: Geography['type']) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="country">Country</SelectItem>
                    <SelectItem value="state">State</SelectItem>
                    <SelectItem value="city">City</SelectItem>
                    <SelectItem value="zone">Zone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="parent">Parent Location (Optional)</Label>
                <Select value={formData.parentId} onValueChange={(value) => setFormData(prev => ({ ...prev, parentId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None (Root Location)</SelectItem>
                    {geographies.map(geography => (
                      <SelectItem key={geography.id} value={geography.id}>
                        {geography.name} ({geography.type})
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
                  {editingGeography ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Geography Tree</CardTitle>
          <CardDescription>Hierarchical view of all locations and operational areas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {renderGeographyTree()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
