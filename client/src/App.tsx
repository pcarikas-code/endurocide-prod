import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "@/components/theme-provider";
import Layout from "@/components/Layout";
import ScrollToTop from "@/components/ScrollToTop";
import { CanonicalUrl } from "@/components/CanonicalUrl";
import LegacyRedirects from "@/components/LegacyRedirects";
import GTMTracking from "@/components/GTMTracking";
import Home from "./pages/Home";

// Keep the homepage in the entry bundle for LCP, while loading secondary
// content only when a visitor requests it.
const Products = lazy(() => import("./pages/Products"));
const Technology = lazy(() => import("./pages/Technology"));
const ProductGuides = lazy(() => import("./pages/ProductGuides"));
const ClinicalStudies = lazy(() => import("./pages/ClinicalStudies"));
const News = lazy(() => import("@/pages/News"));
const Article = lazy(() => import("@/pages/Article"));
const Monkeypox = lazy(() => import("@/pages/Monkeypox"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const ThankYou = lazy(() => import("./pages/ThankYou"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function Router() {
  return (
    <Layout>
      <ScrollToTop />
      <CanonicalUrl />
      <LegacyRedirects />
      <GTMTracking />
      <Suspense fallback={<main className="min-h-[40vh]" aria-busy="true" />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/products" component={Products} />
          <Route path="/technology" component={Technology} />
          <Route path="/guides" component={ProductGuides} />
          <Route path="/studies" component={ClinicalStudies} />
          <Route path="/news" component={News} />
          <Route path="/news/:slug" component={Article} />
          <Route path="/monkeypox-infection-control" component={Monkeypox} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/thank-you" component={ThankYou} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
