import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "@/components/theme-provider";
import Layout from "@/components/Layout";
import ScrollToTop from "@/components/ScrollToTop";
import { CanonicalUrl } from "@/components/CanonicalUrl";
import GTMTracking from "@/components/GTMTracking";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Technology from "./pages/Technology";
import ProductGuides from "./pages/ProductGuides";
import ClinicalStudies from "./pages/ClinicalStudies";
import News from "@/pages/News";
import Article from "@/pages/Article";
import Monkeypox from "@/pages/Monkeypox";

import About from "./pages/About";
import Contact from "./pages/Contact";
import ThankYou from "./pages/ThankYou";

function Router() {
  return (
    <Layout>
      <ScrollToTop />
      <CanonicalUrl />
      <GTMTracking />
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
