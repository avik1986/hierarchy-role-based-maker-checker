
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FolderTree, 
  MapPin, 
  Users, 
  UserPlus, 
  Tags, 
  Database, 
  CheckCircle, 
  ClipboardCheck,
  Settings
} from 'lucide-react';

interface SidebarProps {
  currentModule: string;
  onModuleChange: (module: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'categories', label: 'Category Hierarchy', icon: FolderTree },
  { id: 'geography', label: 'Geography Hierarchy', icon: MapPin },
  { id: 'roles', label: 'Roles Hierarchy', icon: Users },
  { id: 'users', label: 'User Management', icon: UserPlus },
  { id: 'attributes', label: 'Attribute Management', icon: Tags },
  { id: 'entities', label: 'Entity Management', icon: Database },
  { id: 'approval-rules', label: 'Approval Rules', icon: Settings },
  { id: 'approvals', label: 'Approval Workflow', icon: CheckCircle },
];

export const Sidebar = ({ currentModule, onModuleChange }: SidebarProps) => {
  return (
    <div className="w-64 bg-white shadow-xl border-r border-slate-200">
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">Maker-Checker</h1>
        <p className="text-sm text-slate-600 mt-1">Master Data Management</p>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onModuleChange(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200",
                    currentModule === item.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
