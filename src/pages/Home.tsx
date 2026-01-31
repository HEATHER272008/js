import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Heart, Users, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import heroImageFallback from "@/assets/school-building.jpg";
import studentsImage from "@/assets/ahah.jpg";

interface HomeContent {
  hero_title: string;
  hero_subtitle: string | null;
  hero_image_url: string | null;
  why_choose_title: string;
}

const Home = () => {
  const [content, setContent] = useState<HomeContent | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase
        .from("home_content")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (data) setContent(data);
    };

    fetchContent();
  }, []);

  const highlights = [
    {
      icon: GraduationCap,
      title: "Academic Excellence",
      description:
        "Comprehensive Senior High School programs with proven track record.",
    },
    {
      icon: Heart,
      title: "Catholic Values",
      description:
        "Faith-centered education that nurtures spiritual growth and moral development.",
    },
    {
      icon: Users,
      title: "Active Community",
      description:
        "Vibrant student organizations and extracurricular activities for holistic development.",
    },
    {
      icon: BookOpen,
      title: "Well-Equipped Facilities",
      description:
        "Libraries, science laboratories, computer rooms, prayer room, and sports facilities.",
    },
  ];

  const heroTitle =
    content?.hero_title ||
    "Binmaley Catholic School, Inc.\nSenior High School Department";
  const heroSubtitle =
    content?.hero_subtitle ||
    "Nurturing minds, hearts, and souls through excellence in Catholic education.";
  const heroImage = content?.hero_image_url || heroImageFallback;
  const whyChooseTitle = content?.why_choose_title || "Why Choose BCSI?";

  return (
    <div className="min-h-screen">
      {/* ================= HERO SECTION ================= */}
      <section className="relative h-[520px] md:h-[580px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="BCSI Campus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/80" />
        </div>

        <div className="relative z-10 text-center text-primary-foreground px-4 max-w-4xl">
          <p className="text-sm md:text-base mb-2 opacity-90">Welcome to</p>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-4 leading-tight whitespace-pre-line">
            {heroTitle}
          </h1>

          <p className="text-base sm:text-lg md:text-xl mb-8 opacity-90">
            {heroSubtitle}
          </p>

          {/* ✅ FIXED HERO BUTTONS */}
          <div className="flex justify-center gap-4">
            <Link to="/enrollment">
              <Button
                size="lg"
                className="rounded-full bg-white text-primary border border-white/70 hover:bg-white/90 transition"
              >
                Enroll Now
              </Button>
            </Link>

            <Link to="/about">
              <Button
                size="lg"
                className="rounded-full bg-transparent text-white border border-white/80 hover:bg-white/10 transition"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* ================= END HERO ================= */}

      {/* Welcome Message */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                Excellence in Catholic Education
              </h2>
              <p className="text-base md:text-lg text-muted-foreground mb-4">
                Binmaley Catholic School, Inc. (BCSI) is a leading Catholic
                educational institution committed to providing quality education
                grounded in Christian values.
              </p>
              <p className="text-base md:text-lg text-muted-foreground mb-6">
                With a rich history of academic excellence and a dedicated
                community of educators, we prepare our students for success in
                higher education and life beyond the classroom.
              </p>
              <Link to="/about">
                <Button>Discover Our Story</Button>
              </Link>
            </div>

            <div className="rounded-lg shadow-lg overflow-hidden">
              <img
                src={studentsImage}
                alt="Students at BCSI"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16 md:py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary text-center mb-12">
            {whyChooseTitle}
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {highlights.map((highlight, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
                    <highlight.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-serif font-bold mb-3 text-primary">
                    {highlight.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {highlight.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-16 md:py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Join the BCSI Family Today
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Start your journey towards academic excellence and spiritual growth. Enrollment for the upcoming School Year 2026–2027 is now open. 
          </p>

          {/* ✅ FIXED CTA BUTTONS */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/enrollment">
              <Button
                size="lg"
                className="rounded-full bg-white text-primary border border-white/70 hover:bg-white/90"
              >
                View Enrollment Process
              </Button>
            </Link>

            <Link to="/contact">
              <Button
                size="lg"
                className="rounded-full bg-transparent text-white border border-white/80 hover:bg-white/10"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
