import { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Bell, AlertCircle, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  type: string | null;
  is_active: boolean | null;
  external_url: string | null;
}

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("announcements")
        .select("*")
        .eq("is_active", true)
        .order("date", { ascending: true });

      if (data) setAnnouncements(data as Announcement[]);
      setLoading(false);
    };

    fetchData();
  }, []);

  /* ===============================
     IMPORTANT ANNOUNCEMENTS
  =============================== */
  const derivedImportantDates = announcements.filter(
    (a) => a.type?.toLowerCase() === "important"
  );

  const parseImportantContent = (content: string) => {
    const lines = content.split("\n");
    return {
      dateInfo: lines.find((l) => l.includes("📅"))?.replace("📅", "").trim(),
      venue: lines.find((l) => l.includes("📍"))?.replace("📍", "").trim(),
      time: lines.find((l) => l.includes("🕒"))?.replace("🕒", "").trim(),
    };
  };

  /* ===============================
     TYPE HELPERS (FIXED)
  =============================== */
  const getTypeLabel = (type: string | null) => {
    switch (type?.toLowerCase()) {
      case "important":
        return "Important";
      case "event":
        return "Event";
      case "academic":
        return "Academic";
      case "holiday":
        return "Holiday";
      case "general":
      default:
        return "General";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "important":
        return <AlertCircle className="h-5 w-5" />;
      case "event":
        return <Calendar className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "important":
        return {
          badge: "bg-destructive/10 text-destructive border-destructive/20",
          icon: "bg-destructive text-destructive-foreground",
          border: "border-l-destructive",
        };
      case "event":
        return {
          badge: "bg-accent/20 text-accent-foreground border-accent/30",
          icon: "bg-accent text-accent-foreground",
          border: "border-l-accent",
        };
      case "academic":
        return {
          badge: "bg-blue-100 text-blue-700 border-blue-200",
          icon: "bg-blue-600 text-white",
          border: "border-l-blue-600",
        };
      case "holiday":
        return {
          badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
          icon: "bg-emerald-600 text-white",
          border: "border-l-emerald-600",
        };
      default:
        return {
          badge: "bg-primary/10 text-primary border-primary/20",
          icon: "bg-primary text-primary-foreground",
          border: "border-l-primary",
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Announcements"
        subtitle="Stay Updated with School News and Events"
      />

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* MAIN ANNOUNCEMENTS */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-serif font-bold flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Recent Updates
            </h3>

            {announcements
              .filter((a) => a.type?.toLowerCase() !== "important")
              .map((announcement) => {
                const styles = getTypeStyles(
                  announcement.type?.toLowerCase() || "general"
                );

                return (
                  <Card
                    key={announcement.id}
                    className={`border-0 shadow-md border-l-4 ${styles.border}`}
                  >
                    <CardContent className="p-5">
                      <div className="flex gap-4">
                        <div
                          className={`hidden sm:flex w-12 h-12 items-center justify-center rounded-xl ${styles.icon}`}
                        >
                          {getIcon(
                            announcement.type?.toLowerCase() || "general"
                          )}
                        </div>

                        <div className="flex-1 space-y-2">
                          {/* DATE */}
                          <span className="text-xs text-muted-foreground">
                            {new Date(announcement.date).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>

                          {/* TITLE */}
                          <h4 className="text-lg font-semibold">
                            {announcement.title}
                          </h4>

                          {/* TYPE BADGE */}
                          <Badge
                            variant="outline"
                            className={`${styles.badge} w-fit text-xs`}
                          >
                            {getTypeLabel(announcement.type)}
                          </Badge>

                          {/* CONTENT */}
                          <p className="text-sm text-muted-foreground whitespace-pre-line">
                            {announcement.content}
                          </p>

                          {announcement.external_url && (
                            <a
                              href={announcement.external_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button variant="outline" size="sm">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View More
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>

          {/* IMPORTANT DATES */}
          <div>
            <Card className="border-0 shadow-lg sticky top-24 overflow-hidden">
              <div className="bg-primary p-4">
                <h3 className="text-xl font-serif font-bold text-primary-foreground flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Important Dates
                </h3>
              </div>

              <CardContent className="p-0">
                <ul className="divide-y">
                  {derivedImportantDates.map((item) => {
                    const parsed = parseImportantContent(item.content);

                    const dateInfo =
                      parsed.dateInfo ||
                      new Date(item.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      });

                    return (
                      <li
                        key={item.id}
                        className="p-4 space-y-1 hover:bg-muted/50"
                      >
                        <h4 className="font-semibold text-sm">
                          {item.title}
                        </h4>

                        <p className="text-xs text-muted-foreground">
                          📅 {dateInfo}
                        </p>

                        {parsed.venue && (
                          <p className="text-xs text-muted-foreground">
                            📍 {parsed.venue}
                          </p>
                        )}

                        {parsed.time && (
                          <p className="text-xs text-muted-foreground">
                            🕒 {parsed.time}
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
