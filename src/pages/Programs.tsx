import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Wrench } from "lucide-react";
import { motion } from "framer-motion";

const Programs = () => {
  const tracks = [
    {
      icon: GraduationCap,
      title: "Academic Track",
      subtitle: "For College-Bound Students",
      headerBg: "bg-blue-900",
      description:
        "Designed for learners planning to pursue higher education, the Academic Track focuses on developing strong foundations in communication, mathematics, sciences, social sciences, and life skills through structured academic learning.",
    },
    {
      icon: Wrench,
      title: "Technical-Vocational-Livelihood Track",
      subtitle: "Hands-on and Industry-Oriented",
      headerBg: "bg-blue-900", // ✅ changed to match Academic Track
      description:
        "Ideal for hands-on learners, the TVL Track provides practical and industry-aligned training that prepares students for employment, entrepreneurship, certifications, and further skills development.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Senior High School Programs"
        subtitle="Preparing Students for Higher Education and Career Readiness"
      />

      <div className="container mx-auto px-4 py-16 md:py-20">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto mb-14 text-center"
        >
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            BCSI’s Senior High School Department offers well-structured academic
            and technical-vocational programs designed to equip students with
            knowledge, skills, and values for their future.
          </p>
        </motion.div>

        {/* Programs */}
        <div className="grid lg:grid-cols-2 gap-10">
          {tracks.map((track, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -4 }}
            >
              <Card className="border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className={`${track.headerBg} text-white p-6`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <track.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl md:text-2xl font-serif">
                        {track.title}
                      </CardTitle>
                      <p className="text-sm opacity-90">{track.subtitle}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6 bg-white">
                  <p className="text-muted-foreground leading-relaxed">
                    {track.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Why Choose */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 rounded-2xl bg-blue-50 p-12"
        >
          <h3 className="text-2xl md:text-3xl font-serif font-bold text-blue-900 mb-12 text-center">
            Why Choose BCSI for Senior High School?
          </h3>

          <div className="grid sm:grid-cols-3 gap-10 text-center">
            {[
              "Quality Education",
              "Dedicated Faculty",
              "Values Formation",
            ].map((title, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
              >
                <div className="w-12 h-12 bg-blue-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                  {i + 1}
                </div>
                <h4 className="font-semibold text-blue-900 mb-2">
                  {title}
                </h4>
                <p className="text-sm text-blue-700">
                  {title === "Quality Education" &&
                    "Curriculum aligned with DepEd standards"}
                  {title === "Dedicated Faculty" &&
                    "Experienced and committed educators"}
                  {title === "Values Formation" &&
                    "Catholic education rooted in Christian values"}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Programs;
