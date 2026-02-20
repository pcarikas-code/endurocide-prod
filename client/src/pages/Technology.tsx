import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, FileText, Beaker, Award, Leaf } from "lucide-react";
import { Link } from "wouter";
import SEO from "@/components/SEO";

export default function Technology() {
  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Patented Antimicrobial Technology | How It Works"
        description="Learn about endurocide's patented liquid formulation that traps and kills bacteria on contact. Independently tested and proven effective for up to 2 years."
        keywords="antimicrobial technology, sporicidal curtains, infection control science, hospital hygiene technology"
      />
      {/* Header */}
      <div className="bg-primary py-20 text-primary-foreground">
        <div className="container max-w-[1000px] mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Patented Protection</h1>
          <p className="text-xl text-blue-100 leading-relaxed">
            <strong>endurocide®</strong> isn't just a curtain—it's a sophisticated medical device designed to break the chain of infection. With a patented water-based formula, it remains effective for up to two years.
          </p>
        </div>
      </div>

      <div className="container max-w-[1000px] mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sidebar Navigation for Tech Specs */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-muted/50 p-6 rounded-xl border">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Key Certifications
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center justify-between border-b pb-2">
                  <span className="text-muted-foreground">Antibacterial</span>
                  <span className="font-medium">ISO 20743</span>
                </li>
                <li className="flex items-center justify-between border-b pb-2">
                  <span className="text-muted-foreground">Sporicidal</span>
                  <span className="font-medium">ISO 20743</span>
                </li>
                <li className="flex items-center justify-between border-b pb-2">
                  <span className="text-muted-foreground">Flame Retardant</span>
                  <span className="font-medium">BS 5867</span>
                </li>
                <li className="flex items-center justify-between border-b pb-2">
                  <span className="text-muted-foreground">Fungi/Mold</span>
                  <span className="font-medium">AATCC 30</span>
                </li>
                <li className="flex items-center justify-between pt-1">
                  <span className="text-muted-foreground">Sprinkler</span>
                  <span className="font-medium">NFPA 13</span>
                </li>
              </ul>
            </div>

            <div className="bg-secondary/5 p-6 rounded-xl border border-secondary/20">
              <h3 className="font-bold text-lg mb-4 text-secondary-foreground flex items-center gap-2">
                <Award className="h-5 w-5 text-secondary" />
                International Awards
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Recognized globally for innovation in infection prevention and control.
              </p>
              <div className="flex gap-2">
                <div className="h-12 w-12 bg-white rounded-full shadow-sm flex items-center justify-center text-xs font-bold text-secondary border border-secondary/20">
                  2023
                </div>
                <div className="h-12 w-12 bg-white rounded-full shadow-sm flex items-center justify-center text-xs font-bold text-secondary border border-secondary/20">
                  2024
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="mechanism" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="mechanism">Mechanism</TabsTrigger>
                <TabsTrigger value="efficacy">Efficacy Data</TabsTrigger>
                <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
              </TabsList>
              
              <TabsContent value="mechanism" className="space-y-8 animate-in fade-in-50 duration-500">
                <div className="prose max-w-none text-muted-foreground">
                  <h2 className="text-2xl font-bold text-foreground mb-4">How It Works</h2>
                  <p className="mb-6">
                    Unlike standard antimicrobial treatments that only work when bacteria are wet, <strong>endurocide®</strong> uses a patented "Trap & Kill" technology that remains active even on dry surfaces. Our water-based formula creates a durable defense layer that lasts for up to two years.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="mb-4 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <span className="font-bold text-primary">1</span>
                        </div>
                        <h4 className="font-bold text-foreground mb-2">Attraction</h4>
                        <p className="text-sm">Pathogens are electrostatically attracted to the curtain surface.</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="mb-4 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <span className="font-bold text-primary">2</span>
                        </div>
                        <h4 className="font-bold text-foreground mb-2">Destruction</h4>
                        <p className="text-sm">The active ingredient penetrates the cell wall, destroying the pathogen instantly.</p>
                      </CardContent>
                    </Card>
                  </div>

                  <img 
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663210229360/fwTOCJovBQrSFSxg.jpg" 
                    alt="Microscopic action" 
                    className="w-full rounded-xl shadow-lg mb-6"
                  />
                </div>
              </TabsContent>

              <TabsContent value="efficacy" className="space-y-8 animate-in fade-in-50 duration-500">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-foreground">Tested Pathogens</h2>
                  <p className="text-muted-foreground">
                    <strong>endurocide®</strong> has been tested against a wide range of hospital-acquired pathogens.
                  </p>

                  <div className="overflow-hidden rounded-xl border overflow-x-auto">
                    <table className="w-full text-sm text-left min-w-[300px]">
                      <thead className="bg-muted text-foreground font-semibold">
                        <tr>
                          <th className="p-4">Pathogen</th>
                          <th className="p-4">Type</th>
                          <th className="p-4">Reduction Rate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr className="bg-white">
                          <td className="p-4 font-medium">MRSA</td>
                          <td className="p-4 text-muted-foreground">Bacteria</td>
                          <td className="p-4 text-secondary font-bold">&gt; 99.9%</td>
                        </tr>
                        <tr className="bg-white">
                          <td className="p-4 font-medium">E. coli</td>
                          <td className="p-4 text-muted-foreground">Bacteria</td>
                          <td className="p-4 text-secondary font-bold">&gt; 99.9%</td>
                        </tr>
                        <tr className="bg-white">
                          <td className="p-4 font-medium">C. difficile</td>
                          <td className="p-4 text-muted-foreground">Spore</td>
                          <td className="p-4 text-secondary font-bold">&gt; 99.9%</td>
                        </tr>
                        <tr className="bg-white">
                          <td className="p-4 font-medium">Candida auris</td>
                          <td className="p-4 text-muted-foreground">Fungus</td>
                          <td className="p-4 text-secondary font-bold">&gt; 99.9%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-3">
                    <Beaker className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">
                      Full laboratory reports are available upon request for healthcare procurement teams.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="sustainability" className="space-y-8 animate-in fade-in-50 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Eco-Friendly Design</h2>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      We believe infection control shouldn't cost the earth. Our curtains are designed with the full lifecycle in mind.
                    </p>
                    <ul className="space-y-4">
                      <li className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center">
                          <Leaf className="h-4 w-4 text-secondary" />
                        </div>
                        <span className="font-medium">100% Recyclable Polypropylene</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-secondary" />
                        </div>
                        <span className="font-medium">Water-based formula (Environmentally Conscious)</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-secondary" />
                        </div>
                        <span className="font-medium">Lower Carbon Footprint than Laundry</span>
                      </li>
                    </ul>
                  </div>
                  <img 
                    src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663210229360/IafCDKGAFfIDmWtZ.jpg" 
                    alt="Eco friendly icon" 
                    className="rounded-xl shadow-lg"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Download Section */}
      <section className="bg-muted py-16">
        <div className="container max-w-[1000px] mx-auto px-4 md:px-8 text-center">
          <h2 className="text-2xl font-bold mb-8">Technical Resources</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" className="bg-white">
              <FileText className="mr-2 h-4 w-4" />
              Download Technical Brochure
            </Button>
            <Button variant="outline" className="bg-white">
              <FileText className="mr-2 h-4 w-4" />
              View Safety Data Sheet (SDS)
            </Button>
            <Link href="/contact">
              <Button>Request Full Validation Pack</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
