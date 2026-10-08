import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ArrowRight, FileText, Home } from "lucide-react";
import { Link } from "wouter";
import SEO from "@/components/SEO";

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-muted/30 py-20">
      <SEO
        title="Thank You"
        description="Thank you for contacting endurocide® New Zealand. We will be in touch shortly."
        robots="noindex, follow"
      />
      <div className="container max-w-3xl">
        <Card className="border-none shadow-lg text-center py-12">
          <CardHeader className="space-y-6">
            <div className="mx-auto bg-green-100 p-4 rounded-full w-fit">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-foreground">
              Thank You for Reaching Out
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-2 text-muted-foreground max-w-lg mx-auto">
              <p className="text-lg">
                We have received your enquiry and a member of our team will be in touch shortly.
              </p>
              <p>
                In the meantime, feel free to explore our technical resources or return to the homepage.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/">
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  <Home className="h-4 w-4" />
                  Return Home
                </Button>
              </Link>
              <Link href="/guides">
                <Button className="gap-2 w-full sm:w-auto">
                  <FileText className="h-4 w-4" />
                  View Technical Guides
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
