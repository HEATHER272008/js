import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, MapPin } from "lucide-react";
import placeholderPerson from "@/assets/placeholder-person.jpg";
import campusMapImage from "@/assets/campus-map.png";

interface HistoricalPersonnel {
  id: string;
  name: string;
  position: string;
  years: string | null;
  photo_url: string | null;
  category: string;
}

interface AboutContent {
  history: string | null;
  mission_new: string | null;
  vision_new: string | null;
  core_values: { name: string; description: string }[] | null;
  campus_map_url: string | null;
}

const About = () => {
  const [directors, setDirectors] = useState<HistoricalPersonnel[]>([]);
  const [shsPrincipals, setShsPrincipals] = useState<HistoricalPersonnel[]>([]);
  const [content, setContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Fetch historical personnel
    const { data: personnelData } = await supabase
      .from("historical_personnel")
      .select("*")
      .eq("is_active", true)
      .order("display_order");

    if (personnelData) {
      setDirectors(personnelData.filter((p) => p.category === "director"));
      setShsPrincipals(personnelData.filter((p) => p.category === "shs_principal"));
    }

    // Fetch about content
    const { data: aboutData } = await supabase
      .from("about_content")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (aboutData) {
      setContent({
        history: aboutData.history,
        mission_new: aboutData.mission_new,
        vision_new: aboutData.vision_new,
        core_values: aboutData.core_values as { name: string; description: string }[] | null,
        campus_map_url: aboutData.campus_map_url,
      });
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

  const defaultHistory = `Binmaley Catholic School, Inc. was founded with a vision to provide quality Catholic
    education to the youth of Binmaley and surrounding communities. Since our establishment,
    we have remained committed to our founding principles of academic excellence, moral
    integrity, and spiritual growth.`;

  const coreValues = [
    "Authentic Witnessing",
    "Governance and Leadership",
    "Excellence and Relevance",
    "Responsible Stewardship",
    "Communion / Community"
  ];

  const buildingDescriptions = [
    {
      name: "Main Building",
      floors: [
        { floor: "1st Floor", rooms: "8 - St. Gregory the Great, 8 - St. Jerome, 8 - St. Francis de Sales, 9 - St. Stephen, 9 - St. Lorenzo Ruiz, 6 - St. Peter and Paul" },
        { floor: "2nd Floor", rooms: "Guidance Office, Principal's Office (JHS), Library, Prayer Room, Principal's Office (SHS)" }
      ]
    },
    {
      name: "SHS Building",
      floors: [
        { floor: "1st Floor", rooms: "9 - St. Joseph, 10 - St. Leo the Great, 10 - St. Augustine, 10 - St. Thomas Aquinas, 10 - St. Albert the Great, 10 - St. Monica, 10 - St. Rose of Lima, 10 - St. John Vianney, Computer Lab (SHS)" },
        { floor: "2nd Floor", rooms: "CFC, 11 - Diligence, 11 - Wisdom, 11 - Knowledge, 11 - Prudence, 11 - Piety, 11 - Hope, 11 - Fortitude" },
        { floor: "3rd Floor", rooms: "12 - ABM Joy, 12 - STEM Counsel, 12 - STEM Temperance, 12 - STEM Integrity, 12 - HUMSS Peace, 12 - HUMSS Charity, 12 - HUMSS Humility, 12 - HUMSS Faith, 12 - TVL Bread and Pastry" }
      ]
    },
    {
      name: "Academic Building",
      floors: [
        { floor: "1st Floor", rooms: "TVL/Computer Faculty, TLE/MAPEH Faculty, Housekeeping, Home Economics, Food and Beverage Services, Teacher's Canteen" },
        { floor: "2nd Floor", rooms: "Science/Math Faculty, Chemicals Storage Room, Interactive Room, Biology Lab, Chemistry Lab, Physics Lab" }
      ]
    },
    {
      name: "Elementary Building",
      floors: [
        { floor: "1st Floor", rooms: "4 - St. Matthew, 4 - St. Luke, 5 - St. Bartholomew, Guard House, Canteen" },
        { floor: "2nd Floor", rooms: "8 - St. Blasé, 6 - St. Catherine, 8 - St. Bernard, 8 - St. Mary Magdalene" }
      ]
    },
    {
      name: "Annex",
      floors: [
        { floor: "1st Floor", rooms: "Treasurer's Office, Bookkeeper/Registrar/I.T. Office, School Supplies/Coop, Storage Room, Girls' CR" },
        { floor: "2nd Floor", rooms: "Audio Visual Room, Computer Lab (JHS), Science Lab" }
      ]
    },
    {
      name: "Gr. 7 Building",
      floors: [
        { floor: "", rooms: "Boys' CR, School Clinic, 7 - St. Dominic, 7 - St. Benedict, 7 - St. Arnold Jansen, 7 - St. Ignatius of Loyola, 7 - St. Vincent de Paul, 7 - St. Columban, 7 - St. Anthony Claret, 7 - St. Teresa of Avila, 7 - St. John Paul II, Communication & Arts Faculty, SSC Room" }
      ]
    },
    {
      name: "Main Canteen",
      floors: [
        { floor: "", rooms: "HRM, OSA Office, Canteen, Hydration Hub" }
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <PageHeader
        title="About BCSI"
        subtitle="Our History, Mission, and Vision"
      />

      <div className="container mx-auto px-4 py-16 md:py-20">
        {/* History */}
        <section className="mb-16 animate-fade-in">
          <h2 className="text-3xl font-serif font-bold text-primary mb-6">Our History</h2>
          <div className="prose prose-lg max-w-none text-muted-foreground">
            <p className="whitespace-pre-line leading-relaxed">{content?.history || defaultHistory}</p>
          </div>
        </section>

        {/* Former School Directors */}
        {directors.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-serif font-bold text-primary mb-6 animate-fade-in">Former School Directors</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-stagger">
              {directors.map((director) => (
                <Card key={director.id} className="border-0 shadow-md text-center hover-lift">
                  <CardContent className="p-4">
                    <div className="mb-3 img-zoom rounded-full overflow-hidden w-24 h-24 mx-auto">
                      <img
                        src={director.photo_url || placeholderPerson}
                        alt={director.name}
                        className="w-full h-full object-cover border-2 border-primary"
                      />
                    </div>
                    <h4 className="font-semibold text-foreground text-sm">{director.name}</h4>
                    <p className="text-xs text-muted-foreground">{director.years}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Former SHS Principals */}
        {shsPrincipals.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-serif font-bold text-primary mb-6 animate-fade-in">Former SHS Principals</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-stagger">
              {shsPrincipals.map((principal) => (
                <Card key={principal.id} className="border-0 shadow-md text-center hover-lift">
                  <CardContent className="p-4">
                    <div className="mb-3 img-zoom rounded-full overflow-hidden w-20 h-20 mx-auto">
                      <img
                        src={principal.photo_url || placeholderPerson}
                        alt={principal.name}
                        className="w-full h-full object-cover border-2 border-primary"
                      />
                    </div>
                    <h4 className="font-semibold text-foreground text-sm">{principal.name}</h4>
                    <p className="text-xs text-muted-foreground">{principal.years}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Vision and Mission Section */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8 animate-stagger">
            <Card className="border-0 shadow-lg hover-lift">
              <CardContent className="p-8">
                <h3 className="text-2xl font-serif font-bold text-primary mb-4">Vision</h3>
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {content?.vision_new || "In communio, the Archdiocese of Lingayen – Dagupan Catholic Schools form Christ-centered stewards through holistic education and formation."}
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover-lift">
              <CardContent className="p-8">
                <h3 className="text-2xl font-serif font-bold text-primary mb-4">Mission</h3>
                <div className="text-muted-foreground">
                  <p className="mb-4">{content?.mission_new || "To achieve this Vision, ALDCS is committed to the following mission:"}</p>
                  <ul className="space-y-2 list-disc pl-5 text-sm">
                    <li>To establish among member schools a Catholic identity centered on Jesus Christ, and aligned with the teachings of the Church; (Authenticity)</li>
                    <li>To ensure a dynamic school operation through efficient governance; (Leadership)</li>
                    <li>To implement a curriculum enriched with Gospel values through effective instruction and witnessing; (Developmental Learning)</li>
                    <li>To build a harmonious community in the spirit of synodality with respect to diversity; (Community)</li>
                    <li>To promote institutional advancement by establishing partnerships and linkages. (Sustainability)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Philosophy */}
        <section className="mb-16 animate-fade-in">
          <Card className="border-0 shadow-lg hover-lift">
            <CardContent className="p-8">
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Philosophy</h3>
              <p className="text-muted-foreground leading-relaxed">
                We believe that Binmaley Catholic School, Inc. shares in the evangelizing mission of the Church. We believe that learners should receive an education that witnesses to Christian gospel values and be formed as Christian stewards.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Goals and Objectives */}
        <section className="mb-16 animate-fade-in">
          <Card className="border-0 shadow-lg hover-lift">
            <CardContent className="p-8">
              <h3 className="text-2xl font-serif font-bold text-primary mb-4">Goals and Objectives</h3>
              <p className="text-muted-foreground mb-4">
                To carry out Philosophy, Vision and Missions, Binmaley Catholic School, Inc. supports the following goals and objectives:
              </p>
              <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                <li>Provide a well-rounded academic program.</li>
                <li>Maintain a safe and respectful environment.</li>
                <li>Recruit and retain qualified educators.</li>
                <li>Encourage teaching excellence.</li>
                <li>Develop curiosity and creativity.</li>
                <li>Strengthen partnerships with stakeholders.</li>
                <li>Nurture Catholic Christian identity.</li>
              </ol>
            </CardContent>
          </Card>
        </section>

        {/* Core Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-serif font-bold text-primary mb-6 text-center animate-fade-in">Core Values</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 animate-stagger">
            {coreValues.map((value, index) => (
              <Card key={index} className="border-0 shadow-md text-center hover-lift group">
                <CardContent className="p-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-primary-foreground font-bold">{index + 1}</span>
                  </div>
                  <h4 className="font-semibold text-foreground text-sm">{value}</h4>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Campus Map */}
        <section className="animate-fade-in">
          <h2 className="text-3xl font-serif font-bold text-primary mb-4 text-center">Campus Map</h2>
          <p className="text-muted-foreground text-center mb-6 max-w-2xl mx-auto">
            Explore our campus facilities including libraries, science laboratories, computer rooms, prayer room, and sports facilities.
          </p>
          
          <Card className="border-0 shadow-lg overflow-hidden mb-8">
            <CardContent className="p-6">
              <div className="flex justify-center">
                <img 
                  src={campusMapImage} 
                  alt="BCS Campus Map" 
                  className="max-w-md w-full h-auto object-contain rounded-lg" 
                  style={{ maxHeight: '500px' }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Building Descriptions */}
          <h3 className="text-2xl font-serif font-bold text-primary mb-6 text-center flex items-center justify-center gap-2">
            <MapPin className="h-6 w-6" />
            Campus Directory
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-stagger">
            {buildingDescriptions.map((building, index) => (
              <Card key={index} className="border-0 shadow-md hover-lift">
                <CardContent className="p-5">
                  <h4 className="font-serif font-bold text-primary mb-3">{building.name}</h4>
                  <div className="text-sm text-muted-foreground space-y-2">
                    {building.floors.map((floorInfo, idx) => (
                      <p key={idx}>
                        {floorInfo.floor && <strong>{floorInfo.floor}:</strong>} {floorInfo.rooms}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;





