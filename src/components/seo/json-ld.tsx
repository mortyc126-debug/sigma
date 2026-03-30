export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Sigma Models",
    alternateName: "Сигма Моделс",
    url: "https://sigma-model.com",
    logo: "https://sigma-model.com/models/hero-1-new.jpg",
    description:
      "Премиальное модельное агентство России. Закрытый пул, строгий кастинг, карьерное кураторство. Москва и шесть городов присутствия.",
    foundingDate: "2015",
    areaServed: {
      "@type": "Country",
      name: "Россия",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Москва",
      addressCountry: "RU",
    },
    sameAs: [],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["Russian", "English"],
    },
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      minValue: 50,
      maxValue: 250,
    },
    knowsAbout: [
      "модельный бизнес",
      "кастинг моделей",
      "fashion",
      "коммерческая съёмка",
      "beauty-съёмка",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Sigma Models",
    alternateName: "Сигма Моделс",
    url: "https://sigma-model.com",
    inLanguage: "ru",
    publisher: {
      "@type": "Organization",
      name: "Sigma Models",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FAQJsonLd({
  questions,
}: {
  questions: { question: string; answer: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function LocalBusinessJsonLd({
  name,
  city,
}: {
  name: string;
  city: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://sigma-model.com/branches#${city.toLowerCase()}`,
    name: `${name} — ${city}`,
    url: "https://sigma-model.com/branches",
    address: {
      "@type": "PostalAddress",
      addressLocality: city,
      addressCountry: "RU",
    },
    parentOrganization: {
      "@type": "Organization",
      name: "Sigma Models",
      url: "https://sigma-model.com",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
