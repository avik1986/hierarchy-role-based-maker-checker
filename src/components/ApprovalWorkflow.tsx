
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Clock, Eye, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApprovalItem {
  id: string;
  type: 'Category' | 'Geography' | 'Role' | 'User' | 'Entity';
  name: string;
  action: 'Create' | 'Update' | 'Delete';
  submittedBy: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  details: Record<string, any>;
  comments?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export const ApprovalWorkflow = () => {
  const { toast } = useToast();
  const [approvalItems, setApprovalItems] = useState<ApprovalItem[]>([
    {
      id: '1',
      type: 'Category',
      name: 'Smart Watches',
      action: 'Create',
      submittedBy: 'Jane Maker',
      submittedAt: '2024-01-15T10:30:00Z',
      status: 'pending',
      details: { parentCategory: 'Electronics > Mobile Phones', description: 'Wearable technology devices' }
    },
    {
      id: '2',
      type: 'User',
      name: 'Sarah Johnson',
      action: 'Create',
      submittedBy: 'John Admin',
      submittedAt: '2024-01-14T14:20:00Z',
      status: 'pending',
      details: { email: 'sarah.johnson@company.com', role: 'Sales Manager', geography: 'California' }
    },
    {
      id: '3',
      type: 'Geography',
      name: 'Miami',
      action: 'Update',
      submittedBy: 'Jane Maker',
      submittedAt: '2024-01-13T09:15:00Z',
      status: 'approved',
      details: { type: 'city', parentLocation: 'Florida' },
      reviewedBy: 'Bob Checker',
      reviewedAt: '2024-01-13T16:45:00Z',
      comments: 'Approved - location details verified'
    }
  ]);

  const [selectedItem, setSelectedItem] = useState<ApprovalItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reviewComment, setReviewComment] = useState('');

  const handleApprove = (itemId: string) => {
    setApprovalItems(prev => prev.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            status: 'approved' as const, 
            reviewedBy: 'Current User',
            reviewedAt: new Date().toISOString(),
            comments: reviewComment || 'Approved'
          }
        : item
    ));
    toast({ title: "Item approved successfully!" });
    setIsDialogOpen(false);
    setReviewComment('');
  };

  const handleReject = (itemId: string) => {
    if (!reviewComment.trim()) {
      toast({ title: "Please provide a reason for rejection", variant: "destructive" });
      return;
    }
    
    setApprovalItems(prev => prev.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            status: 'rejected' as const, 
            reviewedBy: 'Current User',
            reviewedAt: new Date().toISOString(),
            comments: reviewComment
          }
        : item
    ));
    toast({ title: "Item rejected successfully!" });
    setIsDialogOpen(false);
    setReviewComment('');
  };

  const openReviewDialog = (item: ApprovalItem) => {
    setSelectedItem(item);
    setReviewComment('');
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: ApprovalItem['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: ApprovalItem['status']) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'approved': return <CheckCircle size={16} />;
      case 'rejected': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Approval Workflow</h1>
          <p className="text-slate-600 mt-1">Review and manage pending approval requests.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-yellow-600">
            {approvalItems.filter(item => item.status === 'pending').length} Pending
          </Badge>
          <Badge variant="outline" className="text-green-600">
            {approvalItems.filter(item => item.status === 'approved').length} Approved
          </Badge>
          <Badge variant="outline" className="text-red-600">
            {approvalItems.filter(item => item.status === 'rejected').length} Rejected
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Approval Queue</CardTitle>
          <CardDescription>Items waiting for review and approval</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {approvalItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 hover:shadow-md transition-all">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    {getStatusIcon(item.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-slate-900">{item.action} {item.type}</h3>
                      <Badge className={getStatusColor(item.status)} variant="outline">
                        {item.status}
                      </Badge>
                    </div>
                    <p className="font-medium text-slate-700 mb-1">{item.name}</p>
                    <div className="text-sm text-slate-600 space-y-1">
                      <p>Submitted by: {item.submittedBy}</p>
                      <p>Date: {formatDate(item.submittedAt)}</p>
                      {item.reviewedBy && (
                        <p>Reviewed by: {item.reviewedBy} on {item.reviewedAt && formatDate(item.reviewedAt)}</p>
                      )}
                      {item.comments && (
                        <div className="flex items-start gap-1 mt-2">
                          <MessageSquare size={14} className="mt-0.5 text-slate-400" />
                          <p className="text-slate-600 italic">{item.comments}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openReviewDialog(item)}
                    className="hover:bg-blue-50"
                  >
                    <Eye size={14} className="mr-1" />
                    Review
                  </Button>
                  {item.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedItem(item);
                          setReviewComment('');
                          handleApprove(item.id);
                        }}
                        className="hover:bg-green-50 text-green-600"
                      >
                        <CheckCircle size={14} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openReviewDialog(item)}
                        className="hover:bg-red-50 text-red-600"
                      >
                        <XCircle size={14} />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review: {selectedItem?.action} {selectedItem?.type}</DialogTitle>
            <DialogDescription>
              Review the details and provide your decision for this request.
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Request Details</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {selectedItem.name}</p>
                  <p><strong>Action:</strong> {selectedItem.action}</p>
                  <p><strong>Type:</strong> {selectedItem.type}</p>
                  <p><strong>Submitted by:</strong> {selectedItem.submittedBy}</p>
                  <p><strong>Date:</strong> {formatDate(selectedItem.submittedAt)}</p>
                  {Object.entries(selectedItem.details).map(([key, value]) => (
                    <p key={key}><strong>{key}:</strong> {String(value)}</p>
                  ))}
                </div>
              </div>
              
              {selectedItem.status === 'pending' && (
                <div>
                  <Label htmlFor="comment">Review Comment</Label>
                  <Textarea
                    id="comment"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Enter your review comment..."
                    rows={3}
                  />
                </div>
              )}

              {selectedItem.status === 'pending' && (
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Close
                  </Button>
                  <Button
                    onClick={() => handleReject(selectedItem.id)}
                    variant="outline"
                    className="text-red-600 hover:bg-red-50"
                  >
                    Reject
                  </Button>
                  <Button onClick={() => handleApprove(selectedItem.id)}>
                    Approve
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
