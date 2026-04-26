export const LOCALES = ['it', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

export type Messages = {
  meta: {
    siteTitle: string;
    siteDescription: string;
    siteOgDescription: string;
  };
  nav: {
    title: string;
    openMenuAria: string;
    links: {
      ranking: string;
      submit: string;
      info: string;
      worldMap: string;
    };
  };
  common: {
    footer: {
      rights: string;
      builtWith: string;
    };
  };
  about: {
    heading: string;
    intro: {
      title: string;
      paragraph1: string;
      paragraph2: string;
      quote: string;
    };
    technical: {
      title: string;
      intro: string;
      bullets: {
        transcripts: string;
        regex: string;
        contextWindow: string;
        normalize: string;
        inferCountry: string;
        aiLabeling: string;
        manualReview: string;
      };
    };
    result: {
      title: string;
      paragraph1: string;
      paragraph2: string;
    };
    closing: string;
    backToInfo: string;
  };
  map: {
    loading: string;
    openDetailsAria: string;
    unknownLocation: string;
    closeDetailsAria: string;
    averagePrice: string;
    notAvailable: string;
    entries: string;
    swipeDownToClose: string;
    swipeUpToOpen: string;
    clickRowToZoom: string;
    toggleEntriesAria: string;
    listAveragePrefix: string;
    listLatestPrefix: string;
  };
  ranking: {
    heading: string;
    subtitle: string;
    howToReadTitle: string;
    howToReadText: string;
    intro: {
      question: string;
      paragraph1: string;
      paragraph2: string;
    };
    guide: {
      title: string;
      intro: string;
      points: {
        metricLabel: string;
        metricText: string;
        samplesLabel: string;
        samplesText: string;
        latestLabel: string;
        latestText: string;
      };
      detailsIntro: string;
      detailsList: {
        size: string;
        localPrice: string;
        eurValue: string;
        collectedDate: string;
        source: string;
      };
    };
    insights: {
      title: string;
      paragraph: string;
      premiumPoint: string;
      affordablePoint: string;
    };
    inspiration: {
      title: string;
      paragraph1: string;
      paragraph2: string;
    };
    freshness: {
      title: string;
      paragraph: string;
      cta: string;
    };
    tableAria: string;
    columns: {
      country: string;
      average: string;
      samples: string;
      latestUpdate: string;
    };
    sortLabels: {
      expensive: string;
      cheap: string;
      recent: string;
    };
    metadata: {
      titlePrefix: string;
      description: string;
      ogDescription: string;
      twitterDescription: string;
    };
    details: {
      headingPrefix: string;
      enteriesCount: string;
      viewEntries: string;
      entryTable: {
        weight: string;
        localPrice: string;
        eurPrice: string;
        collectedAt: string;
        provider: string;
      };
    };
  };
  entries: {
    heading: string;
    backToRanking: string;
    totalEntries: string;
    noEntries: string;
  };
  info: {
    heading: string;
    intro: string;
    links: {
      aboutUs: string;
      dataInfo: string;
      termsIp: string;
      docs: string;
    };
    aboutUs: {
      heading: string;
      paragraph1: string;
      paragraph2: string;
    };
    dataInfo: {
      heading: string;
      intro: string;
      source: {
        title: string;
        paragraph1: string;
        paragraph2: string;
      };
      community: {
        title: string;
        intro: string;
        bullets: {
          review: string;
          consistency: string;
        };
      };
      accuracy: {
        title: string;
        intro: string;
        bullets: {
          approximate: string;
          inaccuracies: string;
          factors: string;
        };
      };
      responsibility: {
        title: string;
        paragraph1: string;
        paragraph2: string;
        note: string;
      };
      closing: string;
    };
    legal: {
      heading: string;
      intro: string;
      generalUse: {
        title: string;
        paragraph1: string;
        paragraph2: string;
      };
      noAffiliation: {
        title: string;
        paragraph1: string;
        paragraph2: string;
        bullets: {
          identification: string;
          analysis: string;
          commentary: string;
        };
      };
      dataContent: {
        title: string;
        intro: string;
        bullets: {
          source: string;
          processing: string;
          quality: string;
        };
        note: string;
      };
      intellectualProperty: {
        title: string;
        intro: string;
        owned: {
          heading: string;
          bullets: {
            structure: string;
            dataset: string;
            text: string;
          };
        };
        allowed: {
          heading: string;
          bullet: string;
        };
        forbidden: {
          heading: string;
          bullets: {
            redistribute: string;
            commercial: string;
          };
        };
      };
      liability: {
        title: string;
        intro: string;
        bullets: {
          inaccuracies: string;
          decisions: string;
          damages: string;
        };
      };
      changes: {
        title: string;
        paragraph: string;
      };
      contact: string;
    };
  };
  submit: {
    heading: string;
    description: string;
    form: {
      labels: {
        submitterName: string;
        submitterEmail: string;
        country: string;
        countryPlaceholder: string;
        city: string;
        weight: string;
        price: string;
        currency: string;
        currencyPlaceholder: string;
        photo: string;
      };
      hints: {
        weight: string;
        price: string;
        currency: string;
        photo: string;
      };
      actions: {
        submit: string;
        submitting: string;
        reset: string;
      };
    };
    validation: {
      required: string;
      invalidEmail: string;
      minWeight: string;
      minPrice: string;
      invalidImage: string;
      imageUploadError: string;
    };
    success: {
      heading: string;
      message: string;
    };
    error: {
      generic: string;
    };
  };
};

export const DEFAULT_LOCALE: Locale = 'en';

export function hasLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function getPreferredLocale(acceptLanguage: string | null): Locale {
  const primaryLanguage = acceptLanguage?.split(',')[0]?.trim().toLowerCase() ?? '';
  return primaryLanguage.startsWith('it') ? 'it' : 'en';
}
