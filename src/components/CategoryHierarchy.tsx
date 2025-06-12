
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, FolderTree } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: string;
  name: string;
  parentId?: string;
  level: number;
}

export const CategoryHierarchy = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Electronics', level: 0 },
    { id: '2', name: 'Mobile Phones', parentId: '1', level: 1 },
    { id: '3', name: 'Laptops', parentId: '1', level: 1 },
    { id: '4', name: 'Smartphones', parentId: '2', level: 2 },
    { id: '5', name: 'Feature Phones', parentId: '2', level: 2 },
    { id: '6', name: 'Clothing', level: 0 },
    { id: '7', name: "Men's Clothing", parentId: '6', level: 1 },
    { id: '8', name: "Women's Clothing", parentId: '6', level: 1 },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', parentId: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCategory) {
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, name: formData.name, parentId: formData.parentId || undefined }
          : cat
      ));
      toast({ title: "Category updated successfully!" });
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: formData.name,
        parentId: formData.parentId || undefined,
        level: formData.parentId ? (categories.find(c => c.id === formData.parentId)?.level || 0) + 1 : 0,
      };
      setCategories(prev => [...prev, newCategory]);
      toast({ title: "Category created successfully!" });
    }
    
    setIsDialogOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', parentId: '' });
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, parentId: category.parentId || '' });
    setIsDialogOpen(true);
  };

  const handleDelete = (categoryId: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId && cat.parentId !== categoryId));
    toast({ title: "Category deleted successfully!" });
  };

  const renderCategoryTree = (parentId?: string, level = 0) => {
    return categories
      .filter(cat => cat.parentId === parentId)
      .map(category => (
        <div key={category.id} className={`ml-${level * 6}`}>
          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 mb-2 hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <FolderTree size={18} className="text-blue-600" />
              <span className="font-medium text-slate-900">{category.name}</span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Level {category.level}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(category)}
                className="hover:bg-blue-50"
              >
                <Edit size={14} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(category.id)}
                className="hover:bg-red-50 text-red-600"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
          {renderCategoryTree(category.id, level + 1)}
        </div>
      ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Category Hierarchy</h1>
          <p className="text-slate-600 mt-1">Organize products and services into categories and subcategories.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus size={18} className="mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Category' : 'Create New Category'}</DialogTitle>
              <DialogDescription>
                {editingCategory ? 'Update the category details below.' : 'Add a new category to the hierarchy.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter category name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="parent">Parent Category (Optional)</Label>
                <Select value={formData.parentId} onValueChange={(value) => setFormData(prev => ({ ...prev, parentId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parent category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None (Root Category)</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name} (Level {category.level})
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
                  {editingCategory ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Tree</CardTitle>
          <CardDescription>Hierarchical view of all categories and subcategories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {renderCategoryTree()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
