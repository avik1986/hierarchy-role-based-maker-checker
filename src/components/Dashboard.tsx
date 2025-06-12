
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FolderTree, 
  MapPin, 
  Users, 
  UserPlus, 
  Tags, 
  Database, 
  CheckCircle, 
  Clock,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export const Dashboard = () => {
  const { currentUser } = useUser();

  const stats = [
    { title: 'Categories', count: 45, icon: FolderTree, change: '+12%' },
    { title: 'Geographies', count: 23, icon: MapPin, change: '+5%' },
    { title: 'Users', count: 127, icon: Users, change: '+8%' },
    { title: 'Entities', count: 89, icon: Database, change: '+15%' },
  ];

  const pendingApprovals = [
    { id: 1, type: 'Category', name: 'Electronics > Mobile Phones', status: 'pending', days: 2 },
    { id: 2, type: 'User', name: 'Sarah Johnson - Sales Manager', status: 'pending', days: 1 },
    { id: 3, type: 'Entity', name: 'Product Catalog Updates', status: 'pending', days: 3 },
  ];

  const recentActivities = [
    { id: 1, action: 'Created new category', user: 'Jane Maker', time: '2 hours ago' },
    { id: 2, action: 'Approved user registration', user: 'Bob Checker', time: '4 hours ago' },
    { id: 3, action: 'Updated geography hierarchy', user: 'John Admin', time: '1 day ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, {currentUser.name}</h1>
          <p className="text-slate-600 mt-1">Here's what's happening with your master data today.</p>
        </div>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg">
          <span className="text-sm font-medium capitalize">{currentUser.role}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900">{stat.count}</p>
                    <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                      <TrendingUp size={14} />
                      {stat.change}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                    <Icon size={24} className="text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock size={20} />
              Pending Approvals
            </CardTitle>
            <CardDescription>Items requiring your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div>
                    <p className="font-medium text-slate-900">{item.name}</p>
                    <p className="text-sm text-slate-600">{item.type}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      <AlertTriangle size={12} />
                      {item.days}d pending
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle size={20} />
              Recent Activities
            </CardTitle>
            <CardDescription>Latest system updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                    <p className="text-xs text-slate-600">by {activity.user} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
