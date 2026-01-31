import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Clock, Trash2 } from "lucide-react";

interface AdminRequest {
  id: string;
  email: string;
  name: string;
  reason: string | null;
  status: string;
  created_at: string;
  reviewed_at: string | null;
}

const AdminRequestsManager = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("admin_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (request: AdminRequest) => {
    try {
      // First create the user account
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: request.email,
        email_confirm: true,
        password: Math.random().toString(36).slice(-12), // Temporary password
      });

      if (authError) {
        // If user already exists, we can still approve
        if (!authError.message.includes("already exists")) {
          throw authError;
        }
      }

      // Update request status
      const { error: updateError } = await supabase
        .from("admin_requests")
        .update({
          status: "approved",
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", request.id);

      if (updateError) throw updateError;

      toast({
        title: "Request Approved",
        description: `${request.name} has been approved. They will receive an email to set their password.`,
      });

      fetchRequests();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleReject = async (request: AdminRequest) => {
    try {
      const { error } = await supabase
        .from("admin_requests")
        .update({
          status: "rejected",
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", request.id);

      if (error) throw error;

      toast({
        title: "Request Rejected",
        description: `${request.name}'s request has been rejected.`,
      });

      fetchRequests();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("admin_requests")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Deleted",
        description: "Request has been deleted.",
      });

      fetchRequests();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case "approved":
        return <Badge className="gap-1 bg-green-600"><Check className="h-3 w-3" /> Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="gap-1"><X className="h-3 w-3" /> Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading requests...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Admin Access Requests</h3>
        <Badge variant="outline">{requests.filter(r => r.status === "pending").length} pending</Badge>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No admin requests yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{request.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{request.email}</p>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
              </CardHeader>
              <CardContent>
                {request.reason && (
                  <p className="text-sm mb-3 p-2 bg-muted rounded">{request.reason}</p>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    Requested: {new Date(request.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    {request.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(request)}
                        >
                          <X className="h-4 w-4 mr-1" /> Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(request)}
                        >
                          <Check className="h-4 w-4 mr-1" /> Approve
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(request.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminRequestsManager;
