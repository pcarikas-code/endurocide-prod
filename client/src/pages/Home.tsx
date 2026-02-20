import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import TextCarousel from "@/components/TextCarousel";
import { CheckCircle2, ArrowRight, ShieldCheck, Clock, Droplets, Leaf, Shield, Microscope } from "lucide-react";
import { Link } from "wouter";
import SEO from "@/components/SEO";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <SEO 
        title="Hospital Curtains & Infection Control Solutions"
        description="endurocide® provides patented antimicrobial disposable curtains that kill bacteria on contact. Proven infection control for hospitals and healthcare facilities in New Zealand."
        keywords="antimicrobial curtains, hospital curtains, infection control, disposable curtains, endurocide, healthcare hygiene"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "endurocide New Zealand",
          "url": "https://endurocide.nz",
          "logo": "https://endurocide.nz/logo.webp",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+64-21-029-66718",
            "contactType": "customer service",
            "areaServed": "NZ"
          },
          "sameAs": [
            "https://www.linkedin.com/company/kenco-ltd"
          ]
        }}
      />
      
      {/* Hero Section - Optimized & Simplified */}
      <section className="w-full bg-muted flex justify-center overflow-hidden">
        <div className="relative w-full max-w-[1000px] min-h-[600px] flex items-center">
          
          {/* Background Image - Strictly constrained to max-w-[1000px] */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/images/hero-curtain-flipped.webp" 
              alt="endurocide® Antimicrobial Curtains in a hospital room" 
              className="w-full h-full object-cover opacity-90 object-[75%_center] md:object-center"
            />
            {/* Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-white/95 via-white/80 to-transparent/20 md:from-white/90 md:via-white/60 md:to-transparent"></div>
          </div>
          
          {/* Content Container - Added padding as requested */}
          <div className="relative z-10 w-full px-8 py-10 md:py-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary font-medium text-sm border border-secondary/20 bg-white/50 backdrop-blur-sm">
                <Shield className="h-4 w-4" />
                <span>Proven Infection Control</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight flex flex-col gap-4">
                <img src="/logo.webp" alt="endurocide® NZ Logo" className="h-12 md:h-16 w-auto self-start" />
                <span>endurocide® Antimicrobial Curtains - The Future of <span className="text-primary">Hospital Hygiene</span></span>
                  <TextCarousel 
                    items={[
                      "Kills bacteria on contact",
                      "Up to 24 months efficacy",
                      "Proven pathogen reduction",
                      "Cost-effective solution"
                    ]} 
                    interval={2000}
                    className="text-2xl md:text-3xl font-medium text-muted-foreground/80 h-[1.5em]"
                  />
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-[90%] md:max-w-none">
                <strong>endurocide®</strong> disposable antimicrobial curtains are impregnated with a patented liquid formulation that traps and kills bacteria on contact.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link href="/products" className="w-full sm:w-auto">
                  <Button size="lg" className="text-base px-8 h-14 shadow-lg shadow-primary/20 w-full sm:w-auto">
                    View Products
                  </Button>
                </Link>
                <Link href="/technology" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="text-base px-8 h-14 bg-white/80 backdrop-blur hover:bg-white w-full sm:w-auto">
                    How It Works
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-24 bg-background">
        <div className="container max-w-[1000px] mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose endurocide®?</h2>
            <p className="text-muted-foreground text-lg">
              Our patented technology offers continuous protection against pathogens, reducing the risk of Hospital Acquired Infections (HAIs).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-8 px-8 pb-8 text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Microscope className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Dual-Action Technology</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Traps and kills bacteria, fungi, and spores on the fabric surface, preventing re-transmission. <Link href="/clinical-studies" className="text-primary hover:underline">View clinical studies</Link>.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-8 px-8 pb-8 text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-6">
                  <Clock className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Long-Lasting Protection</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Remains effective for up to 2 years, significantly reducing changeover frequency and costs. <Link href="/guides" className="text-primary hover:underline">Download maintenance guide</Link>.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-8 px-8 pb-8 text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-6">
                  <Leaf className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground">100% Recyclable</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Made from 100% polypropylene, our curtains are fully recyclable.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Highlight */}
      <section className="py-24 bg-muted overflow-hidden">
        <div className="container max-w-[1000px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute -inset-4 bg-primary/5 rounded-3xl transform -rotate-2"></div>
              <img 
                src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663210229360/fwTOCJovBQrSFSxg.jpg" 
                alt="Microscopic view of antimicrobial barrier" 
                className="relative rounded-2xl shadow-2xl w-full"
              />
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Scientifically Proven Efficacy
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                <strong>endurocide®</strong> curtains have been independently tested against international standards. Our unique formulation creates a "trap and kill" mechanism that works instantly.
              </p>
              
              <ul className="space-y-4">
                {[
                  "Kills >99.9% of bacteria including MRSA & E.coli",
                  "Effective against C.difficile spores",
                  "Tested to ISO 20743 & ISO 22196 standards",
                  "Flame retardant to BS 5867 Part 2 Type C"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-secondary shrink-0" />
                    <span className="text-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/technology">
                <Button className="mt-4" size="lg">Learn More About Technology</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container max-w-[1000px] mx-auto px-4 md:px-8 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to Upgrade Your Infection Control?</h2>
          <p className="text-xl text-blue-100 leading-relaxed">
            Contact us today to request a sample or discuss how <strong>endurocide®</strong> can improve safety in your facility.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="h-14 px-8 text-lg font-semibold">
                Request a Quote
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg bg-transparent border-white text-white hover:bg-white hover:text-primary">
                View Catalog
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
