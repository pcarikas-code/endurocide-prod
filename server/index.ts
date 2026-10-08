import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_URL = "https://endurocide.nz";

interface FaqItem {
  question: string;
  answer: string;
}

interface RouteMeta {
  title: string;
  description: string;
  canonical: string;
  bodyContent: string;
  breadcrumb?: string;
  robots?: "index, follow" | "noindex, follow";
  faq?: FaqItem[];
}

const HOME_FAQ: FaqItem[] = [
  {
    question: "How do Endurocide® curtains work?",
    answer:
      "The fabric is treated with a biocide that remains active for the lifetime of the curtain. When pathogens come into contact with the fabric, the biocide penetrates the cell wall, disrupting its function and killing the microorganism.",
  },
  {
    question: "Are they effective against COVID-19?",
    answer:
      "Yes, Endurocide® curtains have been independently tested and proven effective against enveloped viruses, including H1N1 and surrogates for SARS-CoV-2.",
  },
  {
    question: "Are the curtains recyclable?",
    answer:
      "Yes, our curtains are made from 100% polypropylene and are fully recyclable. We are committed to sustainability and reducing medical waste in New Zealand landfills.",
  },
  {
    question: "Do they meet fire safety standards?",
    answer:
      "Absolutely. All Endurocide® curtains are flame retardant and meet international fire safety standards, including BS 5867 Part 2 Type C.",
  },
];

const GUIDES_FAQ: FaqItem[] = [
  {
    question: "How often should curtains be changed?",
    answer:
      "endurocide® curtains are designed to remain effective for up to 24 months. However, they should be replaced immediately if visibly soiled, damaged, or in accordance with your facility's specific infection control protocols.",
  },
  {
    question: "Are the curtains fire retardant?",
    answer:
      "Yes, all endurocide® curtains are treated with flame retardant and meet international fire safety standards including NFPA 701 and BS 5867 Part 2 Type C.",
  },
  {
    question: "How do I dispose of the curtains?",
    answer:
      "endurocide® curtains are 100% recyclable polypropylene. However, if contaminated with infectious material, they should be disposed of as clinical waste according to local regulations.",
  },
];

const ROUTE_META: Record<string, RouteMeta> = {
  "/": {
    title: "endurocide® NZ | Antimicrobial Hospital Curtains",
    description:
      "Endurocide® NZ provides patented antimicrobial hospital curtains that kill pathogens on contact. Proven infection control for New Zealand healthcare.",
    canonical: `${BASE_URL}/`,
    bodyContent: `<main><h1>endurocide® NZ | Antimicrobial Hospital Curtains</h1><p>Endurocide® NZ provides patented antimicrobial hospital curtains that kill pathogens on contact. Proven infection control for New Zealand healthcare.</p><section><h2>Proven Infection Control</h2><p>Our disposable curtains are impregnated with a patented liquid formulation that traps and kills bacteria, fungi, and spores on the fabric surface.</p></section><section><h2>Frequently Asked Questions</h2>${HOME_FAQ.map((faq) => `<h3>${faq.question}</h3><p>${faq.answer}</p>`).join("")}</section><p><a href="/products">Explore antimicrobial hospital curtains</a> · <a href="/studies">Read clinical studies</a> · <a href="/contact">Contact endurocide® New Zealand</a></p></main>`,
    faq: HOME_FAQ,
  },
  "/products": {
    title: "Antimicrobial Hospital Curtains | Products | endurocide® NZ",
    description:
      "Browse the full range of endurocide® disposable antimicrobial and sporicidal hospital curtains. Proven effective against MRSA, C. difficile, and H1N1.",
    canonical: `${BASE_URL}/products`,
    bodyContent:
      "<main><h1>Antimicrobial Hospital Curtains</h1><p>Browse the full range of endurocide® disposable antimicrobial and sporicidal hospital curtains. Proven effective against MRSA, C. difficile, and H1N1.</p></main>",
    breadcrumb: "Products",
  },
  "/technology": {
    title: "Trap & Kill Technology | endurocide® NZ",
    description:
      "Learn how endurocide®'s patented Trap & Kill technology works to eliminate bacteria, fungi, and spores on contact and protect patients 24/7.",
    canonical: `${BASE_URL}/technology`,
    bodyContent:
      "<main><h1>Trap &amp; Kill Technology</h1><p>Learn how endurocide®'s patented Trap &amp; Kill technology works to eliminate bacteria, fungi, and spores on contact and protect patients 24/7.</p></main>",
    breadcrumb: "Technology",
  },
  "/guides": {
    title: "Product Guides & Resources | endurocide® NZ",
    description:
      "Download endurocide® product guides, installation instructions, and technical data sheets for antimicrobial hospital curtains.",
    canonical: `${BASE_URL}/guides`,
    bodyContent: `<main><h1>Product Guides &amp; Resources</h1><p>Download endurocide® product guides, installation instructions, and technical data sheets for antimicrobial hospital curtains.</p><section><h2>Frequently Asked Questions</h2>${GUIDES_FAQ.map((faq) => `<h3>${faq.question}</h3><p>${faq.answer}</p>`).join("")}</section></main>`,
    breadcrumb: "Guides",
    faq: GUIDES_FAQ,
  },
  "/studies": {
    title: "Clinical Studies & Test Reports | endurocide® NZ",
    description:
      "Independent clinical studies and laboratory test reports proving endurocide® curtains reduce bacterial load by over 98% in real hospital environments.",
    canonical: `${BASE_URL}/studies`,
    bodyContent:
      "<main><h1>Clinical Studies &amp; Test Reports</h1><p>Independent clinical studies and laboratory test reports proving endurocide® curtains reduce bacterial load by over 98% in real hospital environments.</p></main>",
    breadcrumb: "Clinical Studies",
  },
  "/news": {
    title: "News & Insights | endurocide® NZ",
    description:
      "Latest news, research insights, and infection control updates from endurocide® New Zealand.",
    canonical: `${BASE_URL}/news`,
    bodyContent:
      "<main><h1>News &amp; Insights</h1><p>Latest news, research insights, and infection control updates from endurocide® New Zealand.</p></main>",
    breadcrumb: "News",
  },
  "/about": {
    title: "About endurocide® New Zealand | Kenco Ltd",
    description:
      "endurocide® New Zealand is distributed by Kenco Ltd. Learn about our mission to reduce healthcare-associated infections across New Zealand.",
    canonical: `${BASE_URL}/about`,
    bodyContent:
      "<main><h1>About endurocide® New Zealand</h1><p>endurocide® New Zealand is distributed by Kenco Ltd. Learn about our mission to reduce healthcare-associated infections across New Zealand.</p></main>",
    breadcrumb: "About",
  },
  "/contact": {
    title: "Contact endurocide® New Zealand | Request a Quote",
    description:
      "Get in touch with endurocide® New Zealand for quotes, samples, or technical inquiries. Call +64 21 029 66718 or email info@endurocide.nz.",
    canonical: `${BASE_URL}/contact`,
    bodyContent:
      "<main><h1>Contact endurocide® New Zealand</h1><p>Get in touch with endurocide® New Zealand for quotes, samples, or technical inquiries. Call +64 21 029 66718 or email info@endurocide.nz.</p></main>",
    breadcrumb: "Contact",
  },
  "/monkeypox-infection-control": {
    title: "Monkeypox Infection Control | endurocide® NZ",
    description:
      "How endurocide® antimicrobial curtains help healthcare facilities manage monkeypox and other emerging infectious diseases through environmental hygiene.",
    canonical: `${BASE_URL}/monkeypox-infection-control`,
    bodyContent:
      "<main><h1>Monkeypox Infection Control</h1><p>How endurocide® antimicrobial curtains help healthcare facilities manage monkeypox and other emerging infectious diseases through environmental hygiene.</p></main>",
    breadcrumb: "Monkeypox Infection Control",
  },
  "/thank-you": {
    title: "Thank You | endurocide® NZ",
    description:
      "Thank you for contacting endurocide® New Zealand. We will be in touch shortly.",
    canonical: `${BASE_URL}/thank-you`,
    bodyContent:
      "<main><h1>Thank You</h1><p>Thank you for contacting endurocide® New Zealand. We will be in touch shortly.</p></main>",
    breadcrumb: "Thank You",
    robots: "noindex, follow",
  },
  "/news/overlooked-vector-mitigating-hais": {
    title:
      "The Overlooked Vector: Mitigating HAIs with Advanced Privacy Curtains | endurocide® NZ",
    description:
      "Privacy curtains are often an overlooked high-touch surface. Traditional textile curtains can harbour dangerous pathogens including MRSA, VRE, and C. difficile within a week of laundering.",
    canonical: `${BASE_URL}/news/overlooked-vector-mitigating-hais`,
    bodyContent:
      "<main><h1>The Overlooked Vector: Mitigating HAIs with Advanced Privacy Curtains</h1><p>Privacy curtains are often an overlooked high-touch surface. Traditional textile curtains can harbour dangerous pathogens including MRSA, VRE, and C. difficile within a week of laundering.</p></main>",
    breadcrumb: "The Overlooked Vector",
  },
  "/news/clinical-evidence-data-driven-approach": {
    title:
      "Clinical Evidence: A Data-Driven Approach to Curtain Hygiene | endurocide® NZ",
    description:
      "A study in Infection Prevention in Practice found bacterial load on curtains dropped from 32.6 to just 0.56 CFU/cm² after installing endurocide® antimicrobial curtains.",
    canonical: `${BASE_URL}/news/clinical-evidence-data-driven-approach`,
    bodyContent:
      "<main><h1>Clinical Evidence: A Data-Driven Approach to Curtain Hygiene</h1><p>A study in Infection Prevention in Practice found bacterial load on curtains dropped from 32.6 to just 0.56 CFU/cm² after installing endurocide® antimicrobial curtains.</p></main>",
    breadcrumb: "Clinical Evidence",
  },
  "/news/beyond-bacteria-importance-sporicidal-action": {
    title:
      "Beyond Bacteria: The Importance of Sporicidal Action | endurocide® NZ",
    description:
      "C. difficile spores can survive on surfaces for months. endurocide®'s patented sporicidal technology penetrates the spore's protective coats and causes lethal DNA damage.",
    canonical: `${BASE_URL}/news/beyond-bacteria-importance-sporicidal-action`,
    bodyContent:
      "<main><h1>Beyond Bacteria: The Importance of Sporicidal Action</h1><p>C. difficile spores can survive on surfaces for months. endurocide®'s patented sporicidal technology penetrates the spore's protective coats and causes lethal DNA damage.</p></main>",
    breadcrumb: "Beyond Bacteria",
  },
  "/news/operational-efficiency-strategic-advantage": {
    title:
      "Operational Efficiency: A Strategic Advantage in Infection Control | endurocide® NZ",
    description:
      "endurocide® disposable antimicrobial curtains eliminate the need for laundering with a two-year active lifespan, reducing labour, utility, and inventory costs for healthcare facilities.",
    canonical: `${BASE_URL}/news/operational-efficiency-strategic-advantage`,
    bodyContent:
      "<main><h1>Operational Efficiency: A Strategic Advantage in Infection Control</h1><p>endurocide® disposable antimicrobial curtains eliminate the need for laundering with a two-year active lifespan, reducing labour, utility, and inventory costs for healthcare facilities.</p></main>",
    breadcrumb: "Operational Efficiency",
  },
  "/news/layered-defence-integrating-curtains": {
    title:
      "A Layered Defence: Integrating Curtains into Infection Control | endurocide® NZ",
    description:
      "endurocide® antimicrobial curtains provide a continuous, passive layer of defence, working 24/7 to kill pathogens deposited on their surface between scheduled cleanings.",
    canonical: `${BASE_URL}/news/layered-defence-integrating-curtains`,
    bodyContent:
      "<main><h1>A Layered Defence: Integrating Curtains into Infection Control</h1><p>endurocide® antimicrobial curtains provide a continuous, passive layer of defence, working 24/7 to kill pathogens deposited on their surface between scheduled cleanings.</p></main>",
    breadcrumb: "Layered Defence",
  },
  "/news/long-term-value-clinical-financial-case": {
    title:
      "Long-Term Value: The Clinical and Financial Case | endurocide® NZ",
    description:
      "A comprehensive analysis reveals a strong ROI for endurocide® curtains. Eliminating laundering costs and reducing HAIs delivers significant clinical and financial value.",
    canonical: `${BASE_URL}/news/long-term-value-clinical-financial-case`,
    bodyContent:
      "<main><h1>Long-Term Value: The Clinical and Financial Case</h1><p>A comprehensive analysis reveals a strong ROI for endurocide® curtains. Eliminating laundering costs and reducing HAIs delivers significant clinical and financial value.</p></main>",
    breadcrumb: "Long-Term Value",
  },
};

const NOT_FOUND_META: RouteMeta = {
  title: "Page Not Found | endurocide® NZ",
  description: "The page you requested could not be found.",
  canonical: `${BASE_URL}/404`,
  bodyContent:
    "<main><h1>Page Not Found</h1><p>The page you requested could not be found. <a href=\"/\">Return to the endurocide® NZ homepage</a>.</p></main>",
  robots: "noindex, follow",
};

const LEGACY_REDIRECTS: Record<string, string> = {
  "/index.html": "/",
  "/product-info-endurocide-hospital-curtains": "/products",
  "/the-facts-hospital-acquired-infections": "/studies",
  "/clinical-studies": "/studies",
  "/monkeypox": "/monkeypox-infection-control",
  "/contact-us": "/contact",
  "/about-us": "/about",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getStructuredData(routePath: string, meta: RouteMeta): Record<string, unknown>[] {
  const schemas: Record<string, unknown>[] = [];

  if (meta.faq) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: meta.faq.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  if (meta.breadcrumb) {
    const items: Record<string, unknown>[] = [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
    ];

    if (routePath.startsWith("/news/")) {
      items.push({
        "@type": "ListItem",
        position: 2,
        name: "News",
        item: `${BASE_URL}/news`,
      });
    }

    items.push({
      "@type": "ListItem",
      position: items.length + 1,
      name: meta.breadcrumb,
      item: meta.canonical,
    });

    schemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items,
    });
  }

  return schemas;
}

function serialiseJsonLd(data: Record<string, unknown>[]): string {
  return data
    .map((item, index) => {
      const json = JSON.stringify(item).replace(/</g, "\\u003c");
      return `<script id="initial-route-schema-${index}" type="application/ld+json">${json}</script>`;
    })
    .join("\n");
}

/**
 * Supplies route-specific initial HTML for crawlers and users before the SPA
 * bundle takes over. This avoids identical raw HTML across public URLs.
 */
function injectRouteMeta(html: string, routePath: string, meta: RouteMeta): string {
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);
  const canonical = escapeHtml(meta.canonical);
  const robots = meta.robots ?? "index, follow";

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${description}" />`,
  );
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${canonical}" />`,
  );
  html = html.replace(
    /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/,
    `<meta name="robots" content="${robots}" />`,
  );
  html = html.replace(
    /(<meta\s+property="og:title"\s+content=")[^"]*(")/,
    `$1${title}$2`,
  );
  html = html.replace(
    /(<meta\s+property="og:description"\s+content=")[^"]*(")/,
    `$1${description}$2`,
  );
  html = html.replace(
    /(<meta\s+property="og:url"\s+content=")[^"]*(")/,
    `$1${canonical}$2`,
  );
  html = html.replace(
    /(<meta\s+property="twitter:title"\s+content=")[^"]*(")/,
    `$1${title}$2`,
  );
  html = html.replace(
    /(<meta\s+property="twitter:description"\s+content=")[^"]*(")/,
    `$1${description}$2`,
  );
  html = html.replace(
    /(<meta\s+property="twitter:url"\s+content=")[^"]*(")/,
    `$1${canonical}$2`,
  );
  html = html.replace(
    "<!-- ROUTE_STRUCTURED_DATA -->",
    serialiseJsonLd(getStructuredData(routePath, meta)),
  );
  html = html.replace("<!-- ROUTE_IDENTIFIER -->", `<!-- route: ${routePath} -->`);
  html = html.replace(
    /(<div id="root">)[\s\S]*?(<script type="module" src="\/src\/main\.tsx"><\/script>)/,
    `$1\n      <!-- Fallback content for non-JS crawlers -->\n      ${meta.bodyContent}\n    </div>\n    $2`,
  );

  return html;
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use((_req, res, next) => {
    res.setHeader(
      "Content-Security-Policy",
      "upgrade-insecure-requests; default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' data: https:; connect-src 'self' https:;",
    );
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    next();
  });

  app.use((req, res, next) => {
    const host = (req.get("host") ?? "").split(":")[0].toLowerCase();
    const normalizedPath =
      req.path.length > 1 && req.path.endsWith("/")
        ? req.path.slice(0, -1)
        : req.path;
    const canonicalPath = LEGACY_REDIRECTS[normalizedPath] ?? normalizedPath;
    const query = req.originalUrl.slice(req.path.length);

    if (host === "www.endurocide.nz" || canonicalPath !== req.path) {
      const location =
        host === "www.endurocide.nz"
          ? `${BASE_URL}${canonicalPath}${query}`
          : `${canonicalPath}${query}`;
      res.redirect(301, location);
      return;
    }

    next();
  });

  // Deliberately disable the static index fallback so every document route
  // passes through the SEO injector below. Assets continue to be cached normally.
  app.use(express.static(staticPath, { index: false }));

  app.get("*", (req, res) => {
    const indexPath = path.join(staticPath, "index.html");
    const routePath = req.path === "/" ? "/" : req.path.replace(/\/$/, "");
    const meta = ROUTE_META[routePath] ?? NOT_FOUND_META;
    const status = ROUTE_META[routePath] ? 200 : 404;

    fs.readFile(indexPath, "utf-8", (err, html) => {
      if (err) {
        res.status(500).send("Internal Server Error");
        return;
      }

      res
        .status(status)
        .type("html")
        .send(injectRouteMeta(html, routePath, meta));
    });
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
