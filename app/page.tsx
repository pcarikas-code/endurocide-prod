import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ShieldCheck, Clock, Recycle, FileText, ArrowRight, Zap, Droplets, Microscope } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import TextCarousel from "@/components/TextCarousel";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-primary/5 to-background overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <Image
            src="/images/hero-curtain-flipped.webp"
            alt="Hospital Environment"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <Badge variant="outline" className="w-fit text-primary border-primary/20 bg-primary/5">
                  The World's First Sporicidal Curtain
                </Badge>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-foreground">
                  Advanced Infection Control <br />
                  <span className="text-primary">Disposable Curtains</span>
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  endurocide® curtains are impregnated with a patented liquid that traps and kills pathogens on contact, providing continuous protection for up to 24 months.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/products">
                  <Button size="lg" className="w-full min-[400px]:w-auto">
                    View Products
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg" className="w-full min-[400px]:w-auto">
                    Request Quote
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4">
                <div className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Sporicidal</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Bactericidal</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Fungicidal</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Virucidal</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-[500px] aspect-video rounded-xl overflow-hidden shadow-2xl border bg-background/50 backdrop-blur-sm p-2">
                <div className="relative w-full h-full rounded-lg overflow-hidden bg-muted">
                  <Image
                    src="/images/endurocide_standard.webp"
                    alt="Endurocide Curtain Technology"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                    <p className="font-semibold">Patented Technology</p>
                    <p className="text-sm opacity-80">Traps & Kills Pathogens on Contact</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Why Choose Endurocide®?</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our curtains offer superior protection compared to standard disposable curtains, actively reducing the risk of Healthcare Associated Infections (HAIs).
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
            <Card className="border-none shadow-md bg-background/60 backdrop-blur-sm">
              <CardHeader>
                <ShieldCheck className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Comprehensive Protection</CardTitle>
                <CardDescription>
                  Effective against spores, bacteria, fungi, and enveloped viruses including H1N1, C.difficile, and MRSA.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-none shadow-md bg-background/60 backdrop-blur-sm">
              <CardHeader>
                <Clock className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Long-Lasting Efficacy</CardTitle>
                <CardDescription>
                  Remains effective for up to 24 months, significantly reducing change-over frequency and costs.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-none shadow-md bg-background/60 backdrop-blur-sm">
              <CardHeader>
                <Recycle className="h-10 w-10 text-primary mb-2" />
                <CardTitle>100% Recyclable</CardTitle>
                <CardDescription>
                  Made from polypropylene, our curtains are fully recyclable and can be repurposed into new products.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2 items-center">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit">Innovative Science</Badge>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                How It Works: Trap & Kill
              </h2>
              <p className="text-muted-foreground md:text-lg">
                Unlike standard antimicrobial curtains that only inhibit growth (biostatic), endurocide® is biocidal. The patented liquid formulation on the fabric creates a hostile environment for pathogens.
              </p>
              <ul className="grid gap-4 py-4">
                <li className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Trap</h3>
                    <p className="text-sm text-muted-foreground">Pathogens are trapped on the fabric surface.</p>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Droplets className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Kill</h3>
                    <p className="text-sm text-muted-foreground">The liquid formulation penetrates the cell wall, killing the pathogen.</p>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Microscope className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Proven</h3>
                    <p className="text-sm text-muted-foreground">Independently tested to international standards.</p>
                  </div>
                </li>
              </ul>
              <Link href="/technology">
                <Button variant="outline">Learn More About Technology</Button>
              </Link>
            </div>
            <div className="relative aspect-square lg:aspect-auto lg:h-[500px] rounded-xl overflow-hidden shadow-xl">
              <Image
                src="/images/dotty-pattern.jpg"
                alt="Microscopic view of Endurocide technology"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials / Carousel */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tighter mb-12">Trusted by Healthcare Professionals</h2>
          <TextCarousel items={[
            "Proven to reduce HAIs by up to 99.9%",
            "Trusted by leading hospitals worldwide",
            "Cost-effective and environmentally friendly",
            "Easy to install and maintain"
          ]} className="text-xl md:text-2xl font-medium text-muted-foreground" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Upgrade Your Infection Control?
              </h2>
              <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl">
                Contact us today for a quote, samples, or to discuss how endurocide® can fit into your facility's protocols.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/contact">
                <Button size="lg" variant="secondary" className="w-full min-[400px]:w-auto font-semibold">
                  Get in Touch
                </Button>
              </Link>
              <Link href="/guides">
                <Button size="lg" variant="outline" className="w-full min-[400px]:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                  Download Guides
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
