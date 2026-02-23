import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import "../crm-form.css";

export default function Contact() {
  return (
    <div className="min-h-screen bg-muted/30 py-12">
      <SEO 
        title="Contact endurocide® New Zealand | Request a Quote"
        description="Get in touch with endurocide® New Zealand for quotes, samples, or technical inquiries. Call us at +64 21 029 66718 or email info@endurocide.nz."
        keywords="contact endurocide, request quote, hospital curtain suppliers, infection control contact"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "mainEntity": {
            "@type": "Organization",
            "name": "endurocide New Zealand",
            "telephone": "+64-21-029-66718",
            "email": "info@endurocide.nz",
            "url": "https://endurocide.nz"
          }
        }}
      />
      <div className="container max-w-[1000px] mx-auto px-4 md:px-8">
        <div className="max-w-[1000px] mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">Contact endurocide® New Zealand</h1>
          <p className="text-lg text-muted-foreground">
            Have questions about <strong>endurocide®</strong>? Our team is here to help you find the right infection control solution.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="border-none shadow-md h-full">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-primary">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="flex items-start gap-4">
                  <Phone className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">Phone</h4>
                    <p className="text-sm text-muted-foreground">+64 (0)21 029 66718</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">Email</h4>
                    <p className="text-sm text-muted-foreground">info@endurocide.nz</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">Business Hours</h4>
                    <p className="text-sm text-muted-foreground">Mon - Fri: 9:00 AM - 5:00 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form Replacement */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-md h-full">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-primary">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Mail className="h-12 w-12 text-primary" />
                </div>
                <div className="max-w-md space-y-2">
                  <h3 className="text-lg font-semibold">We'd love to hear from you</h3>
                  <p className="text-muted-foreground">
                    Whether you have a question about features, trials, pricing, or anything else, our team is ready to answer all your questions.
                  </p>
                </div>
                <Button size="lg" className="gap-2" asChild>
                  <a href="mailto:info@endurocide.nz?subject=Inquiry from Endurocide Website">
                    <Send className="h-4 w-4" />
                    Email Us Directly
                  </a>
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Or call us at <a href="tel:+642102966718" className="text-primary hover:underline font-medium">+64 (0)21 029 66718</a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
