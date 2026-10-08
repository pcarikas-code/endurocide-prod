import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ShieldCheck, AlertTriangle, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import SEO from "@/components/SEO";

export default function Monkeypox() {
  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Monkeypox Infection Control"
        description="Learn how endurocide® antimicrobial curtains help healthcare facilities manage monkeypox and other emerging infectious diseases through environmental hygiene."
        keywords="monkeypox infection control, antimicrobial curtains, healthcare hygiene, infection prevention"
      />
      {/* Hero Section */}
      <section className="relative w-full min-h-[450px] flex items-end pb-8 md:pb-12">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663210229360/BQWQIZGNpJSGHnVi.png" 
            alt="Monkeypox Infection Control Banner" 
            className="w-full h-full object-cover object-top"
          />
          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background"></div>
        </div>
        
        <div className="container relative z-10 px-4 md:px-6" style={{ marginTop: '180px' }}>
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <Badge variant="destructive" className="mb-4">
                Infection Control Alert
              </Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none" style={{ textShadow: '0 0 20px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.5)' }}>
                Understanding Monkeypox Risks & <br className="hidden md:inline" />
                <span className="text-primary">Effective Infection Control</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Protect your facility with Endurocide® Antimicrobial Curtains—proven effective against enveloped viruses like Monkeypox.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/contact">
                <Button size="lg">Request a Quote</Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" size="lg">View Curtains</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What is Monkeypox Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium">
                <AlertTriangle className="mr-2 h-4 w-4 text-yellow-600" />
                Viral Threat
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                What are the risks?
              </h2>
              <p className="text-muted-foreground md:text-lg">
                Monkeypox is an enveloped virus belonging to the Orthopoxvirus genus, similar to smallpox. It can be transmitted through:
              </p>
              <ul className="grid gap-2 py-4">
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>Direct contact with infectious rash, scabs, or body fluids</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>Respiratory secretions during prolonged face-to-face contact</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>Touching items (such as clothing or linens) that previously touched the infectious rash or body fluids</span>
                </li>
              </ul>
              <p className="text-muted-foreground">
                Healthcare facilities must maintain rigorous infection control protocols to prevent transmission.
              </p>
            </div>
            <div className="flex justify-center">
              <Card className="w-full max-w-md border-l-4 border-l-primary shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                    Proven Protection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    Endurocide® Curtains are impregnated with a patented liquid formulation that traps and kills pathogens on contact.
                  </p>
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <p className="font-semibold text-primary">
                      Tested to EN 14476 against Vaccinia virus
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      (Surrogate for Monkeypox and other enveloped viruses)
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              The Endurocide® Solution
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
              Our disposable antimicrobial curtains provide a continuous barrier against infection, working 24/7 to keep patients and staff safe.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  Sporicidal & Virucidal
                </CardTitle>
              </CardHeader>
              <CardContent>
                Effective against spores, bacteria, and enveloped viruses. The patented formulation kills pathogens on the curtain surface, preventing cross-contamination.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  Long-Lasting Efficacy
                </CardTitle>
              </CardHeader>
              <CardContent>
                Independent peer-reviewed hospital studies show that Endurocide® Antimicrobial Curtains remain active for up to 24 months, reducing the need for frequent changes.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  Always Active
                </CardTitle>
              </CardHeader>
              <CardContent>
                Unlike standard curtains that can become contaminated quickly, Endurocide® curtains actively kill pathogens, providing year-round infection control.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
            Upgrade Your Infection Control Today
          </h2>
          <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl mb-8">
            Don't rely on standard curtains. Switch to Endurocide® for proven protection against Monkeypox and other HAIs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Contact Us for a Quote
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                View Product Details
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
