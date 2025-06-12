
import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { CategoryHierarchy } from '@/components/CategoryHierarchy';
import { GeographyHierarchy } from '@/components/GeographyHierarchy';
import { RolesHierarchy } from '@/components/RolesHierarchy';
import { UserManagement } from '@/components/UserManagement';
import { AttributeManagement } from '@/components/AttributeManagement';
import { EntityManagement } from '@/components/EntityManagement';
import { ApprovalRules } from '@/components/ApprovalRules';
import { ApprovalWorkflow } from '@/components/ApprovalWorkflow';
import { UserProvider } from '@/contexts/UserContext';

const Index = () => {
  const [currentModule, setCurrentModule] = useState('dashboard');

  const renderModule = () => {
    switch (currentModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'categories':
        return <CategoryHierarchy />;
      case 'geography':
        return <GeographyHierarchy />;
      case 'roles':
        return <RolesHierarchy />;
      case 'users':
        return <UserManagement />;
      case 'attributes':
        return <AttributeManagement />;
      case 'entities':
        return <EntityManagement />;
      case 'approval-rules':
        return <ApprovalRules />;
      case 'approvals':
        return <ApprovalWorkflow />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <UserProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
        <Sidebar currentModule={currentModule} onModuleChange={setCurrentModule} />
        <main className="flex-1 p-6">
          {renderModule()}
        </main>
      </div>
    </UserProvider>
  );
};

export default Index;
