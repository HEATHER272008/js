import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Loader2, Users, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Organization {
  id: string;
  name: string;
  type: string;
  description: string | null;
  teacher_in_charge: string | null;
}

const OrganizationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchOrganization();
    }
  }, [id]);

  const fetchOrganization = async () => {
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (!error && data) {
      setOrganization(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Organization Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The organization you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/organizations">
            <Button className="hover-lift">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Student Life
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        title={organization.name}
        subtitle={organization.type}
      />

      <div className="container mx-auto px-4 py-12">
        <Link to="/organizations">
          <Button variant="outline" className="mb-8 hover-lift">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Student Life
          </Button>
        </Link>

        {/* Organization Info */}
        <Card className="mb-12 border-0 shadow-lg animate-fade-in">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-serif font-bold text-primary mb-4">About</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {organization.description || "No description available."}
                </p>
              </div>
              <div>
                {organization.teacher_in_charge && (
                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Teacher-in-Charge</p>
                          <p className="text-xl font-semibold text-primary">
                            {organization.teacher_in_charge}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activities Section - TO FOLLOW */}
        <div className="text-center py-12 bg-secondary rounded-xl animate-fade-in">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-serif font-bold text-primary mb-4">Activities and Programs</h3>
          <Alert className="max-w-md mx-auto border-primary/20 bg-white">
            <Info className="h-4 w-4 text-primary" />
            <AlertDescription className="text-muted-foreground">
              <strong>TO FOLLOW</strong> – Check back for updates on activities and events.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetail;
