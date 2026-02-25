import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, Clock, Send, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import SEO from "@/components/SEO";
import { useState } from "react";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const KLAVIYO_PUBLIC_API_KEY = 'W72Cww';
  const WEB_ENQUIRIES_LIST_ID = 'RnuUrp';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const subscribePayload = {
      data: {
        type: 'subscription',
        attributes: {
          custom_source: 'Contact Us Form',
          profile: {
            data: {
              type: 'profile',
              attributes: {
                email: formData.email,
                first_name: formData.firstName,
                last_name: formData.lastName,
                phone_number: formData.phone || undefined,
                organization: formData.company || undefined,
                properties: {
                  message: formData.message,
                  source: 'Contact Us Form'
                }
              }
            }
          }
        },
        relationships: {
          list: {
            data: {
              type: 'list',
              id: WEB_ENQUIRIES_LIST_ID
            }
          }
        }
      }
    };

    try {
      const response = await fetch(`https://a.klaviyo.com/client/subscriptions/?company_id=${KLAVIYO_PUBLIC_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'revision': '2024-10-15'
        },
        body: JSON.stringify(subscribePayload)
      });

      if (response.ok || response.status === 202) {
        // Push form submit event to GTM dataLayer
        if (window.dataLayer) {
          window.dataLayer.push({
            event: 'form_submit',
            form_name: 'Contact Us Form',
            form_id: 'klaviyo-contact-form'
          });
        }

        setStatus("success");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          company: "",
          message: ""
        });
      } else {
        const text = await response.text();
        console.error('Klaviyo API error:', text);
        throw new Error(`API returned status ${response.status}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again or email us directly.");
    }
  };

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

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-md h-full">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-primary">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                {status === "success" ? (
                  <Alert className="bg-green-50 border-green-200 text-green-800">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>
                      Thank you for your enquiry! We will be in touch shortly.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {status === "error" && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{errorMessage}</AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input 
                          id="firstName" 
                          name="firstName" 
                          value={formData.firstName} 
                          onChange={handleChange} 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input 
                          id="lastName" 
                          name="lastName" 
                          value={formData.lastName} 
                          onChange={handleChange} 
                          required 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          type="tel" 
                          value={formData.phone} 
                          onChange={handleChange} 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input 
                          id="company" 
                          name="company" 
                          value={formData.company} 
                          onChange={handleChange} 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea 
                        id="message" 
                        name="message" 
                        rows={5} 
                        value={formData.message} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>

                    <Button type="submit" className="w-full md:w-auto" disabled={status === "submitting"}>
                      {status === "submitting" ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span> Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" /> Send Enquiry
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
