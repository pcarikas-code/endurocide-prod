import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, Clock, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import "../crm-form.css";

export default function Contact() {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Load Prospect CRM form #5 (Contact Form)
    const script5 = document.createElement("script");
    script5.src = "https://userresources.prospect365.com/forms/QXZhbiBNZWR2ZWRldkFudvUt0fK4t19xECQqo5SOegDfVln3lg==/5/form.js";
    script5.defer = true;
    script5.onerror = () => {
      setHasError(true);
      console.error("Failed to load Prospect CRM form #5 script");
    };
    document.body.appendChild(script5);

    return () => {
      if (document.body.contains(script5)) document.body.removeChild(script5);
    };
  }, []);

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


            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-primary">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                  {/* Address removed as per request */}
                
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

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-primary">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                {hasError ? (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      Unable to load the contact form. Please try refreshing the page, or contact us directly via email or phone.
                      <div className="mt-4">
                        <Button variant="outline" asChild>
                          <a href="mailto:info@endurocide.nz">Email Us Directly</a>
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div id="prospect-form-5">
                    <div className="prospect-form-loading flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
