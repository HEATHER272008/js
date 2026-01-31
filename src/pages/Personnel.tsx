import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import placeholderPerson from "@/assets/placeholder-person.jpg";

interface Personnel {
  id: string;
  name: string;
  position: string;
  department: string | null;
  description: string | null;
  photo_url: string | null;
  display_order: number | null;
}

const Personnel = () => {
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPersonnel();
  }, []);

  const fetchPersonnel = async () => {
    const { data } = await supabase
      .from("personnel")
      .select("*")
      .eq("is_active", true)
      .order("display_order");

    if (data) {
      const filteredData = data.filter((p) => {
        const pos = p.position?.toLowerCase() || "";
        const dept = p.department?.toLowerCase() || "";

        if (pos.includes("jhs") || pos.includes("junior high")) return false;
        if (dept.includes("elementary") || dept.includes("junior high")) return false;

        return true;
      });

      setPersonnel(filteredData);
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

  /* ================= GROUPS ================= */
  const administration = personnel.filter((p) => {
    const pos = p.position?.toLowerCase() || "";
    return (
      p.department === "Administration" ||
      pos.includes("director") ||
      (pos.includes("principal") && p.department === "Senior High School")
    );
  });

  const director = administration.find((p) =>
    p.position?.toLowerCase().includes("director")
  );

  const otherAdmins = administration.filter((p) => p !== director);

  const teachingStaff = personnel.filter(
    (p) =>
      p.department &&
      !["Administration", "Office Personnel", "General Services"].includes(
        p.department
      ) &&
      !administration.includes(p)
  );

  const departments = teachingStaff.reduce((acc, person) => {
    const dept = person.department || "Other";
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(person);
    return acc;
  }, {} as Record<string, Personnel[]>);

  const officePersonnel = personnel.filter(
    (p) => p.department === "Office Personnel"
  );

  const generalServices = personnel.filter(
    (p) => p.department === "General Services"
  );

  /* ================= STYLES ================= */
  const cardHover =
    "transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl";

  const photoRing =
    "relative rounded-full overflow-hidden ring-4 ring-primary/30";

  return (
    <div className="min-h-screen">
      <PageHeader
        title="School Personnel"
        subtitle="Meet Our Dedicated Faculty and Staff"
      />

      <div className="container mx-auto px-4 py-16">

        {/* ================= ADMINISTRATION ================= */}
        {administration.length > 0 && (
          <section className="mb-20">
            <h2 className="text-3xl font-serif font-bold text-primary mb-10 text-center">
              Administration
            </h2>

            {director && (
              <div className="flex justify-center mb-12">
                <Card className={`border-0 shadow-xl text-center max-w-sm ${cardHover}`}>
                  <CardContent className="p-8">
                    <div className={`w-40 h-40 mx-auto mb-4 ${photoRing}`}>
                      <img
                        src={director.photo_url || placeholderPerson}
                        alt={director.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-primary">
                      {director.name}
                    </h3>
                    <p className="text-accent font-semibold">
                      {director.position}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {otherAdmins.length > 0 && (
              <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                {otherAdmins.map((person) => (
                  <Card
                    key={person.id}
                    className={`border-0 shadow-lg text-center ${cardHover}`}
                  >
                    <CardContent className="p-6">
                      <div className={`w-32 h-32 mx-auto mb-4 ${photoRing}`}>
                        <img
                          src={person.photo_url || placeholderPerson}
                          alt={person.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-serif font-bold text-primary">
                        {person.name}
                      </h3>
                      <p className="text-accent font-medium">
                        {person.position}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ================= TEACHING FACULTY ================= */}
        {Object.keys(departments).length > 0 && (
          <section className="mb-20">
            <h2 className="text-3xl font-serif font-bold text-primary mb-12 text-center">
              Teaching Faculty
            </h2>

            {Object.entries(departments).map(([deptName, teachers]) => (
              <div key={deptName} className="mb-16">
                <h3 className="text-2xl font-serif font-bold text-primary mb-8 text-center">
                  {deptName}
                </h3>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {teachers.map((teacher) => (
                    <Card
                      key={teacher.id}
                      className={`border-0 shadow-lg text-center ${cardHover}`}
                    >
                      <CardContent className="p-6">
                        <div className={`w-24 h-24 mx-auto mb-4 ${photoRing}`}>
                          <img
                            src={teacher.photo_url || placeholderPerson}
                            alt={teacher.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h4 className="text-sm font-serif font-bold text-primary">
                          {teacher.name}
                        </h4>
                        <p className="text-xs text-accent">
                          {teacher.position}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* ================= OFFICE PERSONNEL ================= */}
        {officePersonnel.length > 0 && (
          <section className="mb-20">
            <h2 className="text-3xl font-serif font-bold text-primary mb-10 text-center">
              Office Personnel
            </h2>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {officePersonnel.map((person) => (
                <Card
                  key={person.id}
                  className={`border-0 shadow-lg text-center ${cardHover}`}
                >
                  <CardContent className="p-6">
                    <div className={`w-24 h-24 mx-auto mb-4 ${photoRing}`}>
                      <img
                        src={person.photo_url || placeholderPerson}
                        alt={person.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-sm font-serif font-bold text-primary">
                      {person.name}
                    </h3>
                    <p className="text-xs text-accent">
                      {person.position}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* ================= GENERAL SERVICES ================= */}
        {generalServices.length > 0 && (
          <section>
            <h2 className="text-3xl font-serif font-bold text-primary mb-10 text-center">
              General Services
            </h2>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {generalServices.map((person) => (
                <Card
                  key={person.id}
                  className={`border-0 shadow-lg text-center ${cardHover}`}
                >
                  <CardContent className="p-6">
                    <div className={`w-24 h-24 mx-auto mb-4 ${photoRing}`}>
                      <img
                        src={person.photo_url || placeholderPerson}
                        alt={person.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-sm font-serif font-bold text-primary">
                      {person.name}
                    </h3>
                    <p className="text-xs text-accent">
                      {person.position}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default Personnel;
