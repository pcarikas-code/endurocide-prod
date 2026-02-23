"use client";

import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function ContactForm() {
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

  if (hasError) {
    return (
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
    );
  }

  return (
    <div id="prospect-form-5">
      <div className="prospect-form-loading flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    </div>
  );
}
