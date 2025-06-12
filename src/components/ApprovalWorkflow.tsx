
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Clock, Eye, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';

interface ApprovalRequest {
  id: string;
  type: 'create' | 'update' | 'delete';
  entityType: 'category' | 'geography' | 'role' | 'user' | 'attribute' | 'entity';
  entityName: string;
  description: string;
  requestedBy: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  changes: Record<string, any>;
}

export const ApprovalWorkflow = () => {
  const { toast } = useToast();
  const { currentUser } = useUser();
  const [requests, setRequests] = useState<ApprovalRequest[]>([
    {
      id: '1',
      type: 'create',
      entityType: 'category',
      entityName: 'Smart Watches',
      description: 'New category for wearable devices',
      requestedBy: 'Jane Maker',
      requestedAt: '2024-01-15T10:30:00Z',
      status: 'pending',
      changes: { name: 'Smart Watches', parentId: '1' }
    },
    {
      id: '2',
      type: 'update',
      entityType: 'user',
      entityName: 'Sarah Johnson',
      description: 'Role change from maker to checker',
      requestedBy: 'John Admin',
      requestedAt: '2024-01-14T14:20:00Z',
      status: 'pending',
      changes: { role: 'checker', previousRole: 'maker' }
    },
    {
      id: '3',
      type: 'create',
      entityType: 'entity',
      entityName: 'Customer Information',
      description: 'New entity for customer master data',
      requestedBy: 'Jane Maker',
      requestedAt: '2024-01-13T09:15:00Z',
      status: 'approved',
      approvedBy: 'Bob Checker',
      approvedAt: '2024-01-13T16:45:00Z',
      changes: { name: 'Customer Information', attributeIds: ['1', '2'] }
    },
  ]);

  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const handleApprove = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { 
            ...req, 
            status: 'approved' as const,
            approvedBy: currentUser.name,
            approvedAt: new Date().toISOString()
          }
        : req
    ));
    toast({ title: "Request approved successfully!" });
  };

  const handleReject = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { 
            ...req, 
            status: 'rejected' as const,
            approvedBy: currentUser.name,
            approvedAt: new Date().toISOString(),
            rejectionReason
          }
        : req
    ));
    setShowRejectDialog(false);
    setRejectionReason('');
    setSelectedRequest(null);
    toast({ title: "Request rejected!" });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: ApprovalRequest['status']) => {
    switch (status) {
      case 'pending': return <Clock className="text-yellow-600" size={20} />;
      case 'approved': return <CheckCircle className="text-green-600" size={20} />;
      case 'rejected': return <XCircle className="text-red-600" size={20} />;
    }
  };

  const getStatusColor = (status: ApprovalRequest['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
    }
  };

  const getTypeColor = (type: ApprovalRequest['type']) => {
    switch (type) {
      case 'create': return 'bg-blue-100 text-blue-800';
      case 'update': return 'bg-purple-100 text-purple-800';
      case 'delete': return 'bg-red-100 text-red-800';
    }
  };

  const canApprove = (request: ApprovalRequest) => {
    return request.status === 'pending' && 
           (currentUser.role === 'checker' || currentUser.role === 'admin') &&
           request.requestedBy !== currentUser.name;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Approval Workflow</h1>
          <p className="text-slate-600 mt-1">Review and approve pending changes to master data.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {requests.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <Clock className="text-yellow-600" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Approved Today</p>
                <p className="text-2xl font-bold text-green-600">
                  {requests.filter(r => r.status === 'approved').length}
                </p>
              </div>
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {requests.filter(r => r.status === 'rejected').length}
                </p>
              </div>
              <XCircle className="text-red-600" size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Approval Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Approval Requests</CardTitle>
          <CardDescription>All pending and processed approval requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="flex items-start justify-between p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-all">
                <div className="flex items-start gap-4 flex-1">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full">
                    {getStatusIcon(request.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-slate-900">{request.entityName}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(request.type)}`}>
                        {request.type}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-2">{request.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Requested by {request.requestedBy}</span>
                      <span>•</span>
                      <span>{formatDate(request.requestedAt)}</span>
                      {request.approvedBy && (
                        <>
                          <span>•</span>
                          <span>
                            {request.status === 'approved' ? 'Approved' : 'Rejected'} by {request.approvedBy}
                          </span>
                        </>
                      )}
                    </div>

                    {request.rejectionReason && (
                      <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-700">
                        <strong>Rejection reason:</strong> {request.rejectionReason}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="hover:bg-blue-50">
                        <Eye size={14} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Request Details</DialogTitle>
                        <DialogDescription>
                          Detailed view of the approval request
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold">Entity Type:</h4>
                          <p className="text-sm text-slate-600 capitalize">{request.entityType}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold">Changes:</h4>
                          <pre className="text-sm text-slate-600 bg-slate-50 p-2 rounded overflow-auto">
                            {JSON.stringify(request.changes, null, 2)}
                          </pre>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {canApprove(request) && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(request.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle size={14} className="mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowRejectDialog(true);
                        }}
                        className="hover:bg-red-50 text-red-600"
                      >
                        <XCircle size={14} className="mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rejection Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Rejection Reason</Label>
              <Textarea
                id="reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter the reason for rejection..."
                rows={4}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => selectedRequest && handleReject(selectedRequest.id)}
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={!rejectionReason.trim()}
              >
                Reject Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
