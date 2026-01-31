import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Heart } from "lucide-react";

const Scholarships = () => {
  const scholarships = [
    {
      icon: GraduationCap,
      title: "SHS – Government Funded Voucher Program",
      description:
        "Government-funded voucher program for Senior High School students.",
      coverage:
        "₱17,500.00 (from public schools) / ₱14,000.00 (from private schools)",
      requirements: [],
    },
    {
      icon: Heart,
      title: "Fr. Benecke's Scholarship Foundation",
      description:
        "Alumni Funded Scholarship Grant (financial assistance varies).",
      coverage: "Financial assistance varies based on need",
      requirements: [],
    },
  ];

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Scholarship Opportunities"
        subtitle="Financial Assistance for Deserving SHS Students"
      />

      <div className="container mx-auto px-4 py-16 md:py-20">
        <div className="max-w-4xl mx-auto mb-12 text-center animate-fade-in">
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            At BCSI, we believe that quality Catholic education should be
            accessible to all deserving students. We offer various scholarship
            programs and financial assistance options to help Senior High School
            students achieve their academic dreams.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto animate-stagger">
          {scholarships.map((scholarship, index) => (
            <Card key={index} className="border-0 shadow-lg hover-lift">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <scholarship.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl md:text-2xl font-serif">
                  {scholarship.title}
                </CardTitle>
                <p className="text-muted-foreground">
                  {scholarship.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h4 className="font-semibold text-primary mb-2">Coverage:</h4>
                  <p className="text-muted-foreground">
                    {scholarship.coverage}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How to Apply */}
        <div className="mt-16 bg-blue-50 rounded-xl p-8 animate-fade-in">
          <h3 className="text-2xl font-serif font-bold text-primary mb-4 text-center">
            How to Apply
          </h3>
          <div className="max-w-3xl mx-auto space-y-4 text-muted-foreground">
            <p>
              <strong>1. Complete the Application Form:</strong> Fill out the
              scholarship application form from the Registrar's Office or our
              website.
            </p>
            <p>
              <strong>2. Gather Requirements:</strong> Prepare all necessary
              documents including report cards, certificates, and proof of
              financial need (if applicable).
            </p>
            <p>
              <strong>3. Submit Documents:</strong> Submit your complete
              application to the Scholarship Committee before the deadline.
            </p>
            <p>
              <strong>4. Wait for Evaluation:</strong> Applications will be
              reviewed and qualified applicants will be notified.
            </p>
            <p className="pt-4 text-center text-sm">
              For more information, please contact our Registrar's Office or
              visit during office hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scholarships;
