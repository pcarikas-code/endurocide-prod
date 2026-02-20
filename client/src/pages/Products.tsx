import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Products() {
  const products = [
    {
      id: "standard-curtain",
      title: "Standard Curtain",
      description: "Designed for suspended ceiling tracks. 100% polypropylene with patented antimicrobial technology.",
      features: ["Height: 2.0m", "Widths: 3.75m, 5.5m, 7.5m", "Patented 'Trap & Kill' technology"],
      colors: [
        { name: "Medical Blue", hex: "#0073bc" },
        { name: "Teal", hex: "#008080" },
        { name: "Grey", hex: "#808080" }
      ],
      image: "/images/endurocide_standard.webp",
      tag: "Best Seller"
    },
    {
      id: "mesh-curtain",
      title: "Mesh Top Curtain",
      description: "Designed for ceiling-fixed tracks. Features a 0.55m mesh top compliant with NFPA 13 for sprinkler systems.",
      features: ["Height: 2.55m (incl. mesh)", "Widths: 3.75m, 5.5m, 7.5m", "Enhanced airflow & safety"],
      colors: [
        { name: "Medical Blue", hex: "#0073bc" },
        { name: "Teal", hex: "#008080" },
        { name: "Grey", hex: "#808080" }
      ],
      image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663210229360/kKrHcMSMnwTdrFYn.jpg",
      tag: "Safety Compliant"
    },
    {
      id: "long-drop-curtain",
      title: "Long Drop Curtain",
      description: "Extra length curtains designed for high ceilings and ceiling-fixed tracks. Maintains full antimicrobial protection.",
      features: ["Height: 2.6m", "Widths: 3.75m, 5.5m, 7.5m", "Ideal for high ceilings"],
      colors: [
        { name: "Medical Blue", hex: "#0073bc" },
        { name: "Teal", hex: "#008080" },
        { name: "Grey", hex: "#808080" }
      ],
      image: "/images/endurocide_longdrop.jpg",
      tag: "Specialist"
    }
  ];

  return (
    <div className="py-12 bg-muted/30 min-h-screen">
      <SEO 
        title="Antimicrobial Hospital Curtains | Product Range"
        description="Browse our range of endurocide® antimicrobial curtains. Available in standard, special, and printed designs. Effective against bacteria, fungi, and spores."
        keywords="hospital curtains, antimicrobial curtains, medical curtains, disposable curtains, endurocide products"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "itemListElement": products.map((product, index) => ({
            "@type": "Product",
            "position": index + 1,
            "name": product.title,
            "description": product.description,
            "image": `https://endurocide.nz${product.image}`,
            "brand": {
              "@type": "Brand",
              "name": "endurocide"
            },
            "offers": {
              "@type": "Offer",
              "availability": "https://schema.org/InStock",
              "priceCurrency": "NZD"
            }
          }))
        }}
      />
      <div className="container max-w-[1000px] mx-auto px-4 md:px-8">
        <div className="max-w-[1000px] mx-auto text-center mb-16 space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">endurocide® Antimicrobial Curtain Product Range</h1>
          <p className="text-lg text-muted-foreground">
            Explore our range of infection control solutions designed for modern healthcare facilities. Need help choosing? <Link href="/contact" className="text-primary hover:underline">Contact our team</Link> for assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-64 overflow-hidden">
                <div className="absolute top-4 right-4 z-10">
                  <Badge variant="secondary" className="font-semibold shadow-sm">
                    {product.tag}
                  </Badge>
                </div>
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl font-bold text-primary">{product.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 space-y-6">
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
                
                <ul className="space-y-2 mb-6">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground/80">
                      <div className="h-5 w-5 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 text-secondary" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Standard Colors</span>
                  <div className="flex gap-2">
                    {product.colors.map((color) => (
                      <div 
                        key={color.name}
                        className="h-6 w-6 rounded-full border border-border shadow-sm ring-offset-background transition-transform hover:scale-110 cursor-help"
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="pt-4 pb-6 flex flex-col gap-3">
                <Link href="/contact" className="w-full">
                  <Button className="w-full" variant="outline">Request Info</Button>
                </Link>
                <a href="/documents/endurocide-brochure.pdf" target="_blank" rel="noopener noreferrer" download className="w-full">
                  <Button className="w-full" variant="ghost">Download Brochure</Button>
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Sizes Card */}
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden mb-12">
          <div className="p-6 border-b bg-muted/30">
            <h3 className="text-2xl font-bold text-primary">Sizes</h3>
            <p className="text-muted-foreground mt-2">Available dimensions for all curtain types.</p>
          </div>
          <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[200px]">Dimension</TableHead>
                  <TableHead className="text-center font-bold text-primary">Standard</TableHead>
                  <TableHead className="text-center font-bold text-primary">Mesh Top</TableHead>
                  <TableHead className="text-center font-bold text-primary">Long Drop</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Height</TableCell>
                  <TableCell className="text-center">2.0m</TableCell>
                  <TableCell className="text-center">2.55m</TableCell>
                  <TableCell className="text-center">2.6m</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Full Width</TableCell>
                  <TableCell className="text-center">7.5m</TableCell>
                  <TableCell className="text-center">7.5m</TableCell>
                  <TableCell className="text-center">7.5m</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Medium Width</TableCell>
                  <TableCell className="text-center">5.55m</TableCell>
                  <TableCell className="text-center">5.55m</TableCell>
                  <TableCell className="text-center">5.55m</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Half Width</TableCell>
                  <TableCell className="text-center">3.75m</TableCell>
                  <TableCell className="text-center">3.75m</TableCell>
                  <TableCell className="text-center">3.75m</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden mb-12">
          <div className="p-6 border-b bg-muted/30">
            <h3 className="text-2xl font-bold text-primary">Product Comparison</h3>
            <p className="text-muted-foreground mt-2">Find the right curtain for your facility's needs. View our <Link href="/guides" className="text-primary hover:underline">installation guides</Link> for more details.</p>
          </div>
          <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
            <Table className="min-w-[600px]">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[200px]">Feature</TableHead>
                  <TableHead className="text-center font-bold text-primary">Standard Curtain</TableHead>
                  <TableHead className="text-center font-bold text-primary">Mesh Top Curtain</TableHead>
                  <TableHead className="text-center font-bold text-primary">Long Drop Curtain</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Antimicrobial Action</TableCell>
                  <TableCell className="text-center">Trap & Kill</TableCell>
                  <TableCell className="text-center">Trap & Kill</TableCell>
                  <TableCell className="text-center">Trap & Kill</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Sprinkler Compliant</TableCell>
                  <TableCell className="text-center"><X className="h-4 w-4 mx-auto text-muted-foreground" /></TableCell>
                  <TableCell className="text-center"><Check className="h-4 w-4 mx-auto text-secondary" /></TableCell>
                  <TableCell className="text-center"><X className="h-4 w-4 mx-auto text-muted-foreground" /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Airflow Permeability</TableCell>
                  <TableCell className="text-center">Standard</TableCell>
                  <TableCell className="text-center">High (Mesh Top)</TableCell>
                  <TableCell className="text-center">Standard</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Ideal Ceiling Height</TableCell>
                  <TableCell className="text-center">Standard (2.4m - 2.7m)</TableCell>
                  <TableCell className="text-center">Standard (2.4m - 2.7m)</TableCell>
                  <TableCell className="text-center">High (&gt;3m)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Privacy Level</TableCell>
                  <TableCell className="text-center">Full</TableCell>
                  <TableCell className="text-center">Partial (Mesh Top)</TableCell>
                  <TableCell className="text-center">Full</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Durability</TableCell>
                  <TableCell className="text-center">Up to 2 years</TableCell>
                  <TableCell className="text-center">Up to 2 years</TableCell>
                  <TableCell className="text-center">Up to 2 years</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Global Color Options */}
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden mb-20">
          <div className="p-6 border-b bg-muted/30">
            <h3 className="text-2xl font-bold text-primary">Available Color Options</h3>
            <p className="text-muted-foreground mt-2">All <strong>endurocide®</strong> curtains are available in these color options.</p>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Standard Colors */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg border-b pb-2">Standard Colors</h4>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: "Medical Blue", hex: "#0073bc" },
                    { name: "Teal", hex: "#008080" },
                    { name: "Grey", hex: "#808080" }
                  ].map((color) => (
                    <div key={color.name} className="flex items-center gap-3">
                      <div 
                        className="h-12 w-12 shrink-0 rounded-full border border-border shadow-sm"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-sm font-medium">{color.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Order Colors */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg border-b pb-2">Special Order</h4>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: "Pastel Blue", hex: "#AEC6CF" },
                    { name: "Pastel Yellow", hex: "#FDFD96" },
                    { name: "Latte", hex: "#C5A085" }
                  ].map((color) => (
                    <div key={color.name} className="flex items-center gap-3">
                      <div 
                        className="h-12 w-12 shrink-0 rounded-full border border-border shadow-sm"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-sm font-medium">{color.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Printed Options */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg border-b pb-2">Printed</h4>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { name: "Dotty on White", image: "/images/dotty-pattern.jpg", border: true }
                  ].map((color) => (
                    <div key={color.name} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
                      <div 
                        className={`h-48 w-24 shrink-0 rounded-md shadow-sm overflow-hidden ${color.border ? 'border border-gray-300' : ''}`}
                      >
                        <img 
                          src={color.image} 
                          alt={color.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-sm font-medium mt-2 sm:mt-0">{color.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}
