import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Save, Calendar, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  type: string | null;
  is_active: boolean | null;
  external_url: string | null;
}

const ANNOUNCEMENT_TYPES = [
  "General",
  "Important",
  "Event",
  "Academic",
  "Holiday",
];

const AnnouncementsManager = () => {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    date: format(new Date(), "yyyy-MM-dd"),
    type: "General",
    external_url: "",
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch announcements",
        variant: "destructive",
      });
    } else {
      // ✅ FIX: normalize type AND is_active
      const normalized = (data || []).map((a) => ({
        ...a,
        type: a.type?.trim() || "General",
        is_active: a.is_active !== false, // NULL → true
      }));

      setAnnouncements(normalized as Announcement[]);
    }

    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      date: format(new Date(), "yyyy-MM-dd"),
      type: "General",
      external_url: "",
    });
    setEditingId(null);
  };

  const handleEdit = (announcement: Announcement) => {
    setFormData({
      title: announcement.title,
      content: announcement.content,
      date: announcement.date,
      type: announcement.type || "General",
      external_url: announcement.external_url || "",
    });
    setEditingId(announcement.id);
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.content || !formData.date) {
      toast({
        title: "Error",
        description: "Title, content, and date are required",
        variant: "destructive",
      });
      return;
    }

    if (
      formData.external_url &&
      !formData.external_url.startsWith("https://")
    ) {
      toast({
        title: "Error",
        description: "External URL must start with https://",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      title: formData.title,
      content: formData.content,
      date: formData.date,
      type: formData.type,
      external_url: formData.external_url || null,
      is_active: true, // ✅ FIX: prevent NULL forever
    };

    if (editingId) {
      const { error } = await supabase
        .from("announcements")
        .update(payload)
        .eq("id", editingId);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update announcement",
          variant: "destructive",
        });
      } else {
        toast({ title: "Success", description: "Announcement updated" });
        fetchAnnouncements();
        setDialogOpen(false);
        resetForm();
      }
    } else {
      const { error } = await supabase.from("announcements").insert(payload);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to add announcement",
          variant: "destructive",
        });
      } else {
        toast({ title: "Success", description: "Announcement added" });
        fetchAnnouncements();
        setDialogOpen(false);
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;

    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete announcement",
        variant: "destructive",
      });
    } else {
      toast({ title: "Success", description: "Announcement deleted" });
      fetchAnnouncements();
    }
  };

  // ✅ FIX: deterministic toggle (no NULL logic)
  const toggleActive = async (id: string, currentStatus: boolean | null) => {
    const nextStatus = currentStatus === false ? true : false;

    const { error } = await supabase
      .from("announcements")
      .update({ is_active: nextStatus })
      .eq("id", id);

    if (!error) fetchAnnouncements();
  };

  const getTypeColor = (type: string | null) => {
    switch (type?.trim()) {
      case "Important":
        return "bg-red-100 text-red-800";
      case "Event":
        return "bg-blue-100 text-blue-800";
      case "Academic":
        return "bg-green-100 text-green-800";
      case "Holiday":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Announcements Management</h2>

        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Announcement
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Announcement" : "Add New Announcement"}
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date *</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ANNOUNCEMENT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Content *</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  External Link (Optional)
                </label>
                <Input
                  type="url"
                  value={formData.external_url}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      external_url: e.target.value,
                    })
                  }
                  placeholder="https://..."
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>

                <Button onClick={handleSubmit}>
                  <Save className="mr-2 h-4 w-4" />
                  {editingId ? "Update" : "Add"} Announcement
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Link</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {announcements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No announcements added yet.
                  </TableCell>
                </TableRow>
              ) : (
                announcements.map((announcement) => (
                  <TableRow key={announcement.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {format(
                          new Date(announcement.date),
                          "MMM d, yyyy"
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="font-medium">
                      {announcement.title}
                    </TableCell>

                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                          announcement.type
                        )}`}
                      >
                        {announcement.type}
                      </span>
                    </TableCell>

                    <TableCell>
                      {announcement.external_url ? (
                        <a
                          href={announcement.external_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span className="text-xs">Link</span>
                        </a>
                      ) : (
                        "—"
                      )}
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          toggleActive(
                            announcement.id,
                            announcement.is_active
                          )
                        }
                        className={
                          announcement.is_active
                            ? "text-green-600"
                            : "text-muted-foreground"
                        }
                      >
                        {announcement.is_active ? "Active" : "Inactive"}
                      </Button>
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(announcement)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(announcement.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnnouncementsManager;
