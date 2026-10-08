import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlaskConical, CheckCircle2, FileText, TrendingDown, ShieldCheck, Microscope, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import SEO from "@/components/SEO";
import { pathogenData } from "@/data/pathogenData";
import { Link } from "wouter";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function ClinicalStudies() {
  return (
    <div className="min-h-screen bg-background py-12">
      <SEO 
        title="Clinical Studies & Independent Testing Reports"
        description="Review independent laboratory reports and clinical studies validating endurocide's efficacy against MRSA, C.difficile, E.coli, and other pathogens."
        keywords="clinical studies, antimicrobial testing, hospital curtain efficacy, independent lab reports, infection control data"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "MedicalDevice",
              "name": "Endurocide Antimicrobial Curtains",
              "manufacturer": {
                "@type": "Organization",
                "name": "Endurocide"
              },
              "description": "Patented antimicrobial hospital curtains proven to kill bacteria, spores, and viruses on contact.",
              "medicalSpecialty": "Infection Control"
            },
            {
              "@type": "TechArticle",
              "headline": "Clinical Studies & Independent Testing Reports",
              "description": "Independent laboratory reports validating Endurocide's efficacy against MRSA, C.difficile, E.coli, and other pathogens.",
              "author": {
                "@type": "Organization",
                "name": "Endurocide NZ"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Endurocide NZ",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://endurocide.nz/images/endurocide-logo.png"
                }
              }
            }
          ]
        }}
      />
      <div className="container max-w-[1000px] mx-auto px-4 md:px-8">
        <Breadcrumbs items={[{ label: "Clinical Studies", href: "/studies" }]} />
        <div className="max-w-[1000px] mx-auto text-center mb-16 space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Clinical Studies & Independent Testing Reports</h1>
          <p className="text-lg text-muted-foreground">
            <strong>endurocide®</strong> curtains are backed by independent laboratory testing and peer-reviewed clinical studies demonstrating proven efficacy against hospital-acquired infections. <Link href="/products" className="text-primary hover:underline">View our product range</Link> to see available options.
          </p>
        </div>

        {/* Mechanism of Action Section */}
        <div className="max-w-4xl mx-auto mb-20 space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our patented liquid formulation provides a dual-action defense system that traps and kills pathogens on contact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-blue-50/50 border-blue-100">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ShieldCheck className="h-6 w-6 text-blue-700" />
                  </div>
                  <CardTitle className="text-xl text-blue-900">Bacteriostatic & Sporistatic</CardTitle>
                </div>
                <CardDescription className="text-blue-700/80 font-medium">
                  Traps pathogens & inhibits growth
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-4">
                <p>
                  Prevents pathogens from reproducing on the fabric surface. Tested to <strong>ISO 20645</strong>, <strong>AATCC 147</strong>, and <strong>CG 147</strong> standards.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Inhibits respiration & cell metabolism</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>Prevents re-transmission to other surfaces</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-red-50/50 border-red-100">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Microscope className="h-6 w-6 text-red-700" />
                  </div>
                  <CardTitle className="text-xl text-red-900">Bactericidal & Sporicidal</CardTitle>
                </div>
                <CardDescription className="text-red-700/80 font-medium">
                  Actively kills pathogens
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-4">
                <p>
                  Destroys pathogens on the curtain surface. Tested to <strong>ISO 20743</strong>, <strong>AATCC 100</strong>, and <strong>JIS Z 2801</strong> standards.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                    <span>Ruptures cell membranes & viral envelopes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                    <span>Causes lethal DNA damage to spores</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-50 border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-slate-600" />
                Patented Liquid Formulation
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>
                At the manufacturing stage, our polypropylene fabric is impregnated with the unique <strong>endurocide® Curtain Liquid</strong>. This creates a permanent polymer layer with dual 'static' (trapping) and 'cidal' (killing) action that remains effective for up to 24 months.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tested Pathogens List */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Independently Tested Pathogens</h2>
            <p className="text-lg text-muted-foreground">
              Validated against international standards for a broad spectrum of healthcare-associated pathogens.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pathogenData.map((pathogen, i) => (
              <Popover key={i}>
                <PopoverTrigger asChild>
                  <div className="flex items-center gap-3 p-3 bg-white border rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer group active:scale-95">
                    <div className={`h-2 w-2 rounded-full shrink-0 ${
                      pathogen.type === 'Spore' ? 'bg-red-500' :
                      pathogen.type === 'Virus' ? 'bg-purple-500' :
                      pathogen.type === 'Fungus' ? 'bg-orange-500' :
                      'bg-green-500'
                    }`} />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-primary transition-colors">{pathogen.name}</span>
                    <Info className="h-3 w-3 text-muted-foreground ml-auto opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="p-3 max-w-[250px]">
                  <div className="space-y-1">
                    <p className="font-semibold text-xs uppercase tracking-wider opacity-70">{pathogen.type}</p>
                    <p className="font-medium">{pathogen.result}</p>
                    <p className="text-xs opacity-80">Standard: {pathogen.standard}</p>
                  </div>
                </PopoverContent>
              </Popover>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" /> <span>Bacteria</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500" /> <span>Spores</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-500" /> <span>Viruses</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-orange-500" /> <span>Fungi</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <Microscope className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-2xl">Sporicidal</CardTitle>
              <CardDescription>Effective against spores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-2">&gt;99.9%</div>
              <p className="text-sm text-muted-foreground mb-4">Reduction in C. difficile spores</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Tested to EN 13704 standard</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Effective even after 2 years in-situ</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <ShieldCheck className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle className="text-2xl">Bactericidal</CardTitle>
              <CardDescription>Broad spectrum protection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-2">Log 5</div>
              <p className="text-sm text-muted-foreground mb-4">Reduction in MRSA, E. coli, VRE</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Tested to ISO 20743 & AATCC 147</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Kills bacteria on contact</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardHeader>
              <FlaskConical className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle className="text-2xl">Virucidal</CardTitle>
              <CardDescription>Effective against viruses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 mb-2">Proven</div>
              <p className="text-sm text-muted-foreground mb-4">Against H1N1 & Coronavirus</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>Tested to EN 14476 standard</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>Reduces viral transmission risk</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-12 max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-border flex-1"></div>
            <h2 className="text-2xl font-bold text-foreground">Published Research</h2>
            <div className="h-px bg-border flex-1"></div>
          </div>

          {/* Study 1 */}
          <Card className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="bg-muted/50 p-8 md:w-1/3 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r">
                <div className="text-4xl font-bold text-primary mb-2">96%</div>
                <div className="text-sm font-medium text-muted-foreground">Pathogen Reduction</div>
                <div className="mt-6 inline-flex items-center px-3 py-1 rounded-full bg-white border text-xs font-medium shadow-sm">
                  USA Study, 2023
                </div>
              </div>
              <div className="p-8 md:w-2/3">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Peer Reviewed</Badge>
                </div>
                <h3 className="text-xl font-bold mb-3">Impact of Antimicrobial Curtains on Bacterial Contamination</h3>
                <p className="text-muted-foreground mb-6">
                  A multi-center study published in the American Journal of Infection Control demonstrating significant reduction in bacterial load on privacy curtains in high-acuity settings.
                </p>
                <div className="flex gap-4">
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <a href="https://www.sciencedirect.com/science/article/pii/S2590088923000240" target="_blank" rel="noopener noreferrer">
                      <FileText className="h-4 w-4" />
                      Read Abstract
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Study 2 */}
          <Card className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="bg-muted/50 p-8 md:w-1/3 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r">
                <div className="text-4xl font-bold text-primary mb-2">24</div>
                <div className="text-sm font-medium text-muted-foreground">Months Efficacy</div>
                <div className="mt-6 inline-flex items-center px-3 py-1 rounded-full bg-white border text-xs font-medium shadow-sm">
                  Longitudinal Study
                </div>
              </div>
              <div className="p-8 md:w-2/3">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Lab Report</Badge>
                </div>
                <h3 className="text-xl font-bold mb-3">Long-term Sporicidal Activity Assessment</h3>
                <p className="text-muted-foreground mb-6">
                  Independent laboratory testing confirming that <strong>endurocide®</strong> curtains maintain their sporicidal efficacy against C. difficile spores for up to 24 months of use.
                </p>
                <div className="flex gap-4">
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <a href="https://lateralmedical.com/wp-content/uploads/2020/07/2-year-Testing-of-Endurocide-Curtain-.pdf" target="_blank" rel="noopener noreferrer">
                      <FileText className="h-4 w-4" />
                      View Data
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Study 3 */}
          <Card className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="bg-muted/50 p-8 md:w-1/3 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r">
                <TrendingDown className="h-12 w-12 text-primary mb-2" />
                <div className="text-sm font-medium text-muted-foreground">Cost Analysis</div>
                <div className="mt-6 inline-flex items-center px-3 py-1 rounded-full bg-white border text-xs font-medium shadow-sm">
                  NHS Trust Trial
                </div>
              </div>
              <div className="p-8 md:w-2/3">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Case Study</Badge>
                </div>
                <h3 className="text-xl font-bold mb-3">Operational Efficiency & Cost Reduction</h3>
                <p className="text-muted-foreground mb-6">
                  Comparative analysis in a UK NHS Trust revealing a 40% reduction in curtain changeover frequency and significant savings on laundry logistics and replacement costs.
                </p>
                <div className="flex gap-4">
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <a href="https://endurocide.com/wp-content/uploads/2023/10/NHS-Curtain-Evaluation-2013.pdf" target="_blank" rel="noopener noreferrer">
                      <FileText className="h-4 w-4" />
                      Download Report
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
