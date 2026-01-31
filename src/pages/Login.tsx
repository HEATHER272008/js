import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";
import bcsiLogo from "@/assets/FB_IMG_1767617453285.png";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  
  // Request form fields
  const [requestName, setRequestName] = useState("");
  const [requestEmail, setRequestEmail] = useState("");
  const [requestReason, setRequestReason] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/admin");
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast({
        title: "Success!",
        description: "Logged in successfully.",
      });
      navigate("/admin");
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

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("admin_requests")
        .insert({
          name: requestName,
          email: requestEmail,
          reason: requestReason || null,
        });

      if (error) {
        if (error.message.includes("duplicate")) {
          throw new Error("A request with this email already exists. Please wait for approval.");
        }
        throw error;
      }

      setRequestSubmitted(true);
      toast({
        title: "Request Submitted!",
        description: "Your admin access request has been submitted. Please wait for approval.",
      });
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

  if (requestSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-primary/80 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Request Submitted!</h2>
            <p className="text-muted-foreground mb-4">
              Your admin access request has been submitted successfully. 
              You will be contacted once your request is reviewed and approved.
            </p>
            <Button onClick={() => {
              setRequestSubmitted(false);
              setShowRequestForm(false);
            }}>
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-primary/80 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <img src={bcsiLogo} alt="BCSI Logo" className="h-20 w-auto" />
          </div>
          <CardTitle className="text-2xl font-serif">
            {showRequestForm ? "Request Admin Access" : "Admin Login"}
          </CardTitle>
          {showRequestForm && (
            <CardDescription>
              Submit your request and wait for approval from an existing admin.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {showRequestForm ? (
            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="requestName">Full Name</Label>
                <Input
                  id="requestName"
                  type="text"
                  placeholder="Your full name"
                  value={requestName}
                  onChange={(e) => setRequestName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="requestEmail">Email</Label>
                <Input
                  id="requestEmail"
                  type="email"
                  placeholder="your.email@bcsi.edu.ph"
                  value={requestEmail}
                  onChange={(e) => setRequestEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="requestReason">Reason for Request (optional)</Label>
                <Textarea
                  id="requestReason"
                  placeholder="Why do you need admin access?"
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Submitting..." : "Submit Request"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setShowRequestForm(false)}
              >
                Back to Login
              </Button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@bcsi.edu.ph"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Loading..." : "Sign In"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setShowRequestForm(true)}
              >
                Need admin access? Request here
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
