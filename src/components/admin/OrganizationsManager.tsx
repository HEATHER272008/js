import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Save, Users, ChevronDown, ChevronUp, Upload, Loader2 } from "lucide-react";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Organization {
  id: string;
  name: string;
  type: string;
  description: string | null;
  teacher_in_charge: string | null;
  display_order: number | null;
  is_active: boolean | null;
  logo_url: string | null;
}

interface OrganizationMember {
  id: string;
  organization_id: string;
  name: string;
  position: string | null;
  photo_url: string | null;
  display_order: number | null;
  member_category: string | null;
  department: string | null;
}

const ORG_TYPES = ["SSC", "PGO", "Subject Organization", "School Organization"];

const MEMBER_CATEGORIES = [
  "Officers",
  "Grade Level Representatives", 
  "Department Heads",
  "Faculty",
  "Staff",
  "Student Leaders",
  "Members"
];

const DEPARTMENTS = [
  "Registrar",
  "Finance",
  "Guidance",
  "Campus Ministry",
  "Library",
  "IT/Computer Lab",
  "Canteen",
  "Maintenance",
  "Security",
  "Other"
];

const OrganizationsManager = () => {
  const { toast } = useToast();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [members, setMembers] = useState<Record<string, OrganizationMember[]>>({});
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [expandedOrgs, setExpandedOrgs] = useState<Set<string>>(new Set());
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    teacher_in_charge: "",
    logo_url: "",
  });

  const [memberFormData, setMemberFormData] = useState({
    name: "",
    position: "",
    member_category: "Members",
    department: "",
  });

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploadingLogo(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `org-logo-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('organization-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('organization-photos')
        .getPublicUrl(filePath);

      setFormData({ ...formData, logo_url: publicUrl });
      toast({
        title: "Success",
        description: "Logo uploaded successfully",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload logo",
        variant: "destructive",
      });
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) {
        logoInputRef.current.value = '';
      }
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch organizations",
        variant: "destructive",
      });
    } else {
      setOrganizations(data || []);
      // Fetch members for each organization
      for (const org of data || []) {
        fetchMembers(org.id);
      }
    }
    setLoading(false);
  };

  const fetchMembers = async (orgId: string) => {
    const { data } = await supabase
      .from("organization_members")
      .select("*")
      .eq("organization_id", orgId)
      .order("display_order", { ascending: true });

    if (data) {
      setMembers(prev => ({ ...prev, [orgId]: data }));
    }
  };

  const resetForm = () => {
    setFormData({ name: "", type: "", description: "", teacher_in_charge: "", logo_url: "" });
    setEditingId(null);
  };

  const resetMemberForm = () => {
    setMemberFormData({ name: "", position: "", member_category: "Members", department: "" });
    setEditingMemberId(null);
  };

  const handleEdit = (org: Organization) => {
    setFormData({
      name: org.name,
      type: org.type,
      description: org.description || "",
      teacher_in_charge: org.teacher_in_charge || "",
      logo_url: org.logo_url || "",
    });
    setEditingId(org.id);
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.type) {
      toast({
        title: "Error",
        description: "Name and type are required",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      name: formData.name,
      type: formData.type,
      description: formData.description || null,
      teacher_in_charge: formData.teacher_in_charge || null,
      logo_url: formData.logo_url || null,
      display_order: editingId ? undefined : organizations.length + 1,
    };

    if (editingId) {
      const { error } = await supabase
        .from("organizations")
        .update(payload)
        .eq("id", editingId);

      if (error) {
        toast({ title: "Error", description: "Failed to update organization", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Organization updated" });
        fetchOrganizations();
        setDialogOpen(false);
        resetForm();
      }
    } else {
      const { error } = await supabase.from("organizations").insert(payload);

      if (error) {
        toast({ title: "Error", description: "Failed to add organization", variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Organization added" });
        fetchOrganizations();
        setDialogOpen(false);
        resetForm();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will also delete all members.")) return;

    const { error } = await supabase.from("organizations").delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete organization", variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Organization deleted" });
      fetchOrganizations();
    }
  };

  const openMemberDialog = (orgId: string, member?: OrganizationMember) => {
    setSelectedOrgId(orgId);
    if (member) {
      setMemberFormData({
        name: member.name,
        position: member.position || "",
        member_category: member.member_category || "Members",
        department: member.department || "",
      });
      setEditingMemberId(member.id);
    }
    setMemberDialogOpen(true);
  };

  const handleMemberSubmit = async () => {
    if (!memberFormData.name || !selectedOrgId) {
      toast({ title: "Error", description: "Name is required", variant: "destructive" });
      return;
    }

    const payload = {
      organization_id: selectedOrgId,
      name: memberFormData.name,
      position: memberFormData.position || null,
      member_category: memberFormData.member_category || "Members",
      department: memberFormData.department || null,
      display_order: editingMemberId ? undefined : (members[selectedOrgId]?.length || 0) + 1,
    };

    if (editingMemberId) {
      const { error } = await supabase
        .from("organization_members")
        .update(payload)
        .eq("id", editingMemberId);

      if (!error) {
        toast({ title: "Success", description: "Member updated" });
        fetchMembers(selectedOrgId);
        setMemberDialogOpen(false);
        resetMemberForm();
      }
    } else {
      const { error } = await supabase.from("organization_members").insert(payload);

      if (!error) {
        toast({ title: "Success", description: "Member added" });
        fetchMembers(selectedOrgId);
        setMemberDialogOpen(false);
        resetMemberForm();
      }
    }
  };

  const handleDeleteMember = async (memberId: string, orgId: string) => {
    if (!confirm("Delete this member?")) return;

    const { error } = await supabase.from("organization_members").delete().eq("id", memberId);

    if (!error) {
      toast({ title: "Success", description: "Member deleted" });
      fetchMembers(orgId);
    }
  };

  const toggleExpand = (orgId: string) => {
    setExpandedOrgs(prev => {
      const next = new Set(prev);
      if (next.has(orgId)) {
        next.delete(orgId);
      } else {
        next.add(orgId);
      }
      return next;
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Organizations Management</h2>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Organization
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Organization" : "Add New Organization"}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Organization name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type *</label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ORG_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Teacher-in-Charge</label>
                <Input
                  value={formData.teacher_in_charge}
                  onChange={(e) => setFormData({ ...formData, teacher_in_charge: e.target.value })}
                  placeholder="Adviser name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Organization description..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Organization Logo</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    ref={logoInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploadingLogo}
                  >
                    {uploadingLogo ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Logo
                      </>
                    )}
                  </Button>
                  {formData.logo_url && (
                    <div className="flex items-center gap-2">
                      <img 
                        src={formData.logo_url} 
                        alt="Logo preview" 
                        className="h-12 w-12 object-contain border rounded"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData({ ...formData, logo_url: "" })}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  <Save className="mr-2 h-4 w-4" />
                  {editingId ? "Update" : "Add"} Organization
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Member Dialog */}
      <Dialog open={memberDialogOpen} onOpenChange={(open) => {
        setMemberDialogOpen(open);
        if (!open) resetMemberForm();
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingMemberId ? "Edit Member" : "Add New Member"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name *</label>
              <Input
                value={memberFormData.name}
                onChange={(e) => setMemberFormData({ ...memberFormData, name: e.target.value })}
                placeholder="Member name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Position</label>
              <Input
                value={memberFormData.position}
                onChange={(e) => setMemberFormData({ ...memberFormData, position: e.target.value })}
                placeholder="e.g., President, Vice President"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Member Category</label>
              <Select
                value={memberFormData.member_category}
                onValueChange={(value) => setMemberFormData({ ...memberFormData, member_category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {MEMBER_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Department/Office (optional)</label>
              <Select
                value={memberFormData.department || "none"}
                onValueChange={(value) => setMemberFormData({ ...memberFormData, department: value === "none" ? "" : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setMemberDialogOpen(false); resetMemberForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleMemberSubmit}>
                <Save className="mr-2 h-4 w-4" />
                {editingMemberId ? "Update" : "Add"} Member
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Organizations List */}
      <div className="space-y-4">
        {organizations.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No organizations added yet. Click "Add Organization" to get started.
            </CardContent>
          </Card>
        ) : (
          organizations.map((org) => (
            <Collapsible
              key={org.id}
              open={expandedOrgs.has(org.id)}
              onOpenChange={() => toggleExpand(org.id)}
            >
              <Card>
                <CardHeader className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                          {expandedOrgs.has(org.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <div>
                        <CardTitle className="text-lg">{org.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {org.type} • {members[org.id]?.length || 0} members
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openMemberDialog(org.id)}>
                        <Users className="mr-2 h-4 w-4" />
                        Add Member
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(org)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(org.id)} className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    {org.description && (
                      <p className="text-sm text-muted-foreground mb-4">{org.description}</p>
                    )}
                    {org.teacher_in_charge && (
                      <p className="text-sm mb-4">
                        <strong>Teacher-in-Charge:</strong> {org.teacher_in_charge}
                      </p>
                    )}
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Position</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(members[org.id] || []).length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                              No members yet
                            </TableCell>
                          </TableRow>
                        ) : (
                          (members[org.id] || []).map((member) => (
                            <TableRow key={member.id}>
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                  {member.photo_url ? (
                                    <img
                                      src={member.photo_url}
                                      alt={member.name}
                                      className="w-8 h-8 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs">
                                      {member.name.charAt(0)}
                                    </div>
                                  )}
                                  {member.name}
                                </div>
                              </TableCell>
                              <TableCell>{member.position || "-"}</TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openMemberDialog(org.id, member)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteMember(member.id, org.id)}
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
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))
        )}
      </div>
    </div>
  );
};

export default OrganizationsManager;
