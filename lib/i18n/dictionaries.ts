import 'server-only';

import type { Locale, Messages } from '@/lib/i18n/config';

const dictionaries: Record<Locale, Messages> = {
  it: {
    meta: {
      siteTitle: 'Nutella Index',
      siteDescription: 'Monitoraggio globale dei prezzi Nutella con mappa interattiva e ranking dinamici.',
      siteOgDescription: 'Confronta i prezzi Nutella nel mondo con mappa live e classifiche aggiornate.',
    },
    nav: {
      title: 'Nutella Index',
      openMenuAria: 'Apri menu di navigazione',
      links: {
        ranking: 'Ranking',
        submit: 'Inviaci i tuoi dati',
        info: 'Info',
        worldMap: 'Mappa del Mondo',
      },
    },
    common: {
      footer: {
        rights: 'Tutti i diritti riservati.',
        builtWith: 'Creato con passione per dati, viaggi e Nutella.',
      },
    },
    about: {
      heading: 'Chi siamo',
      intro: {
        title: 'Come nasce il progetto',
        paragraph1:
          'Ciao! Sono Andrea, un ingegnere informatico con un background in Web Information and Data Engineering. Mi è sempre piaciuto lavorare con i dati, il web e progetti concreti, quelli che trasformano una curiosita in qualcosa di tangibile.',
        paragraph2:
          'Ogni lunedì guardo HumanSafari e le sue avventure in giro per il mondo. Se hai visto i suoi video, sai che spesso esplora supermercati locali ed ha una passione per ricercare i prezzi della Nutella nei diversi paesi. Il nome "Nutela Index" deriva proprio da lì e ad un certo punto mi sono chiesto:',
        quote: 'Perche non trasformare questa idea in un progetto concreto che vada oltre un semplice foglio Excel?',
      },
      technical: {
        title: 'Per i curiosi e i geek',
        intro:
          'Ecco una panoramica più tecnica di come questo dataset è nato, visto che ovviamente non potevo riguardare migliaia di ore di video per estrarre i dati manualmente:',
        bullets: {
          transcripts: 'Tutto è iniziato con lo scraping delle trascrizioni di tutti i video di Nicolò.',
          regex: 'Ho usato una semplice regex su "Nutella" per individuare i passaggi rilevanti.',
          contextWindow: 'Per ogni match ho estratto una finestra di contesto e cercato riferimenti vicini a prezzi e pesi.',
          normalize: 'Ho normalizzato i dati usando delle altre espressioni regolari per estrarre peso, prezzo locale e valuta.',
          inferCountry: 'Quando possibile, ho inferito il paese dal titolo del video.',
          aiLabeling: 'Poi ho usato l\'AI per etichettare ogni voce in categorie: pronta, dato mancante, ambigua, falso positivo.',
          manualReview: 'Infine, ho revisionato tutto manualmente, spesso tornando al punto esatto del video citato nella trascrizione.',
        },
      },
      result: {
        title: 'Il risultato',
        paragraph1:
          'Potrei aver perso qualche voce lungo la strada, ma sono riuscito a costruire un dataset pulito e utilizzabile senza dover guardare migliaia di ore di filmati.',
        paragraph2:
          'E soprattutto, ho trasformato una bella idea in qualcosa che puoi esplorare, confrontare e, magari, migliorare con il tuo contributo!',
      },
      closing:
        'Se questo progetto ti piace anche solo lontanamente quanto e piaciuto a me costruirlo, per me e gia una vittoria 🙂',
      backToInfo: 'Torna alle info',
    },
    map: {
      loading: 'Connessione al satellite in corso...',
      openDetailsAria: 'Apri dettagli',
      unknownLocation: 'Sconosciuto',
      closeDetailsAria: 'Chiudi dettagli',
      averagePrice: 'Prezzo medio',
      notAvailable: 'N/D',
      entries: 'Lista Paesi',
      swipeDownToClose: 'Swipe down per chiudere',
      swipeUpToOpen: 'Swipe up per aprire la lista',
      clickRowToZoom: 'Clicca una riga per zoomare sulla mappa',
      toggleEntriesAria: 'Apri o chiudi pannello entries',
      listAveragePrefix: 'Media',
      listLatestPrefix: 'Ultimo aggiornamento',
    },
    ranking: {
      heading: 'Ranking Globale Nutella',
      subtitle: 'Classifica paesi basata sul prezzo medio in EUR/100g.',
      howToReadTitle: 'Come leggere questa classifica',
      howToReadText:
        'La tabella ordina i paesi in base al prezzo medio della Nutella normalizzato a 100g (EUR/100g). Il valore medio permette un confronto coerente tra formati diversi (peso e confezioni). La colonna "Campioni" indica quante rilevazioni sono state usate per il calcolo e "Ultimo update" mostra la freschezza dei dati.',
      intro: {
        question: 'Dove costa di più la Nutella nel mondo? E dove conviene acquistarla?',
        paragraph1:
          'Questa classifica globale confronta il prezzo della Nutella tra i vari paesi usando una metrica standardizzata: EUR per 100 grammi (EUR/100g). Normalizzando i prezzi in questo modo, è possibile confrontare confezioni di dimensioni e valute diverse in modo coerente.',
        paragraph2:
          'Che tu sia un viaggiatore, una persona curiosa o semplicemente un amante della Nutella, questa pagina offre una fotografia chiara di come i prezzi cambiano nel mondo.',
      },
      guide: {
        title: 'Come leggere questa classifica',
        intro: 'Ogni paese è ordinato in base al prezzo medio della Nutella per 100g in euro.',
        points: {
          metricLabel: 'EUR/100g',
          metricText:
            'Metrica principale: converte i prezzi locali in euro e li normalizza per formato, cosi i valori sono direttamente confrontabili.',
          samplesLabel: 'Campioni',
          samplesText:
            'Numero di osservazioni raccolte per quel paese. In generale, più campioni significano una media più affidabile.',
          latestLabel: 'Ultimo aggiornamento',
          latestText:
            'Indica quanto sono recenti i dati, per capire rapidamente la freschezza delle informazioni.',
        },
        detailsIntro: 'Dentro ogni paese trovi il dettaglio completo delle rilevazioni, con:',
        detailsList: {
          size: 'Formato del prodotto (es. 200g, 750g)',
          localPrice: 'Prezzo locale e valuta',
          eurValue: 'Valore calcolato in EUR/100g',
          collectedDate: 'Data della rilevazione',
          source: 'Fonte del dato',
        },
      },
      insights: {
        title: 'Cosa mostra la classifica',
        paragraph:
          'I prezzi della Nutella possono variare in modo marcato da un paese all\'altro. Costi di importazione, domanda locale, tassazione e distribuzione influenzano il risultato finale.',
        premiumPoint:
          'Alcuni paesi risultano in alto in classifica con prezzi premium, dove la Nutella viene percepita come prodotto più "di lusso".',
        affordablePoint:
          'Altri paesi offrono prezzi sorprendentemente convenienti, spesso grazie a maggiore disponibilita locale o costi logistici più bassi.',
      },
      inspiration: {
        title: 'Ispirato dai viaggi reali',
        paragraph1:
          'Questo progetto prende ispirazione da HumanSafari (Nicolo Balini), travel creator noto per l esplorazione dei supermercati locali nel mondo. Durante i suoi viaggi ha iniziato a tracciare i prezzi della Nutella in modo informale, trasformando una curiosita in un confronto globale.',
        paragraph2:
          'Il dataset iniziale nasce proprio dai suoi video e speriamo continui a crescere con nuovi contributi e aggiornamenti.',
      },
      freshness: {
        title: 'Tienilo aggiornato',
        paragraph:
          'La classifica viene aggiornata continuamente con nuovi dati: prezzi, cambi e copertura geografica evolvono nel tempo.',
        cta: 'Usa gli ordinamenti per esplorare:',
      },
      tableAria: 'Tabella ranking prezzi medi Nutella per paese',
      columns: {
        country: 'Paese',
        average: 'Media (EUR/100g)',
        samples: 'Campioni',
        latestUpdate: 'Ultimo update',
      },
      sortLabels: {
        expensive: 'Più costosi',
        cheap: 'Più economiche',
        recent: 'Aggiornate di recente',
      },
      metadata: {
        titlePrefix: 'Ranking Nutella Globale',
        description:
          'Classifica dinamica dei prezzi Nutella nel mondo: confronta paesi per costo medio, volatilita e aggiornamenti recenti.',
        ogDescription:
          'Esplora la classifica globale dei prezzi Nutella e scopri dove costa di più o di meno.',
        twitterDescription: 'Classifica aggiornata dei prezzi medi Nutella per 100g nel mondo.',
      },
      details: {
        headingPrefix: 'Entries da',
        enteriesCount: 'rilevazioni',
        viewEntries: 'Vedi dettagli',
        entryTable: {
          weight: 'Peso',
          localPrice: 'Prezzo locale',
          eurPrice: 'EUR/100g',
          collectedAt: 'Data',
          provider: 'Fonte',
        },
      },
    },
    entries: {
      heading: 'Rilevazioni da',
      backToRanking: 'Torna al ranking',
      totalEntries: 'rilevazioni totali',
      noEntries: 'Nessuna rilevazione trovata',
    },
    info: {
      heading: 'Info',
      intro: 'In questa sezione trovi informazioni sul progetto, sui dati e sugli aspetti legali essenziali.',
      links: {
        aboutUs: 'Chi siamo',
        dataInfo: 'Informazioni sui dati',
        termsIp: 'Termini e proprieta intellettuale',
        docs: 'Docs',
      },
      aboutUs: {
        heading: 'Chi siamo',
        paragraph1:
          'Il Nutella Index nasce per raccontare le differenze di prezzo nel mondo in modo trasparente, leggibile e aggiornabile.',
        paragraph2:
          'Il progetto unisce rilevazioni sul campo, normalizzazione dei dati e visualizzazione interattiva su mappa.',
      },
      dataInfo: {
        heading: 'Informazioni sui dati',
        intro: 'Informazioni sui dati e disclaimer',
        source: {
          title: 'Da dove arrivano i dati',
          paragraph1:
            'Il dataset di questo progetto nasce da una fonte non convenzionale ma molto divertente: i video YouTube di HumanSafari (Nicolo Balini).',
          paragraph2:
            'Abbiamo analizzato le trascrizioni per estrarre le citazioni dei prezzi Nutella nel mondo, combinando automazione e verifica manuale per trasformare menzioni informali in dati strutturati.',
        },
        community: {
          title: 'Contributi della community',
          intro:
            'Alcune rilevazioni possono essere state aggiunte da utenti che hanno voluto contribuire con prezzi raccolti durante viaggi o nella propria area.',
          bullets: {
            review: 'Tutti i dati inviati dagli utenti vengono revisionati e approvati da un admin prima della pubblicazione.',
            consistency: 'Cerchiamo di mantenere coerenza di formato e completezza informativa su ogni entry.',
          },
        },
        accuracy: {
          title: 'Disclaimer sull\'accuratezza',
          intro:
            'Facciamo del nostro meglio per mantenere il dataset pulito e affidabile, ma il progetto si basa su prezzi citati nei video, contributi utenti e processi di conversione/normalizzazione.',
          bullets: {
            approximate: 'Alcuni prezzi possono essere approssimativi o non aggiornati.',
            inaccuracies: 'Possono essere presenti piccole imprecisioni o incoerenze.',
            factors: 'Disponibilita locale, promozioni e contesto possono influenzare molto il prezzo reale.',
          },
        },
        responsibility: {
          title: 'Responsabilita',
          paragraph1:
            'Questo sito è fornito esclusivamente a scopo informativo e di intrattenimento.',
          paragraph2:
            'Non garantiamo accuratezza, completezza o affidabilita assoluta dei dati e non siamo responsabili di decisioni o azioni basate su queste informazioni.',
          note:
            'Se noti anomalie, segnalale o contribuisci con un aggiornamento: migliorare il dataset insieme è parte del progetto.',
        },
        closing: 'Grazie per la comprensione e per far parte della community.',
      },
      legal: {
        heading: 'Termini e proprieta intellettuale',
        intro: 'Termini di utilizzo e proprieta intellettuale',
        generalUse: {
          title: '1. Uso generale',
          paragraph1:
            'Accedendo e utilizzando questo sito, accetti di usarlo solo per scopi personali, informativi e non commerciali.',
          paragraph2:
            'I contenuti sono forniti a fini di intrattenimento e interesse generale e non devono essere considerati vincolanti o legalmente esaustivi.',
        },
        noAffiliation: {
          title: '2. Nessuna affiliazione',
          paragraph1:
            'Questo progetto è indipendente e non è affiliato, sponsorizzato o approvato da Ferrero S.p.A., azienda produttrice di Nutella.',
          paragraph2:
            'Nutella è un marchio registrato di Ferrero S.p.A.; tutti i diritti relativi al brand e ai contenuti associati appartengono ai rispettivi titolari. Le citazioni nel sito sono usate esclusivamente per:',
          bullets: {
            identification: 'identificazione del prodotto',
            analysis: 'analisi comparativa',
            commentary: 'commento informativo',
          },
        },
        dataContent: {
          title: '3. Dati e contenuti',
          intro: 'I dati mostrati sul sito:',
          bullets: {
            source: 'provengono da fonti pubbliche (es. video e contributi utenti)',
            processing: 'sono elaborati e organizzati in modo indipendente',
            quality: 'possono non essere completi, accurati o aggiornati',
          },
          note:
            'Non rivendichiamo diritti su contenuti di terze parti, marchi o materiali coperti da copyright citati nel sito.',
        },
        intellectualProperty: {
          title: '4. Proprieta intellettuale',
          intro: 'Salvo diversa indicazione, appartengono a questo progetto:',
          owned: {
            heading: 'Di nostra proprieta:',
            bullets: {
              structure: 'struttura e design del sito',
              dataset: 'dataset compilato come raccolta e organizzazione',
              text: 'testi originali e spiegazioni',
            },
          },
          allowed: {
            heading: 'Puoi:',
            bullet: 'consultare e usare i contenuti per uso personale',
          },
          forbidden: {
            heading: 'Non puoi:',
            bullets: {
              redistribute: 'riprodurre, ridistribuire o ripubblicare parti sostanziali del sito o del dataset',
              commercial: 'usare i contenuti per scopi commerciali senza autorizzazione',
            },
          },
        },
        liability: {
          title: '5. Limitazione di responsabilita',
          intro: 'Questo sito e fornito "cosi com è", senza garanzie di alcun tipo. Non siamo responsabili per:',
          bullets: {
            inaccuracies: 'eventuali inesattezze nei dati',
            decisions: 'decisioni prese sulla base delle informazioni pubblicate',
            damages: 'danni diretti o indiretti derivanti dall utilizzo del sito',
          },
        },
        changes: {
          title: '6. Modifiche',
          paragraph:
            'Questi termini possono essere aggiornati in qualsiasi momento senza preavviso. L\'uso continuato del sito implica l\'accettazione della versione corrente.',
        },
        contact:
          'Per segnalazioni su proprieta intellettuale o contenuti, scrivici a info.nutellaindex@gmail.com: prenderemo in carico la richiesta con tempestivita.',
      },
    },
    submit: {
      heading: 'Inviaci i tuoi dati',
      description: 'Condividi un rilevamento locale: lo revisioniamo e, se valido, lo promuoviamo nel dataset principale.',
      form: {
        labels: {
          submitterName: 'Nome',
          submitterEmail: 'Email',
          country: 'Paese',
          countryPlaceholder: 'Seleziona un paese',
          city: 'Città (opzionale)',
          weight: 'Peso (g)',
          price: 'Prezzo locale',
          currency: 'Valuta',
          currencyPlaceholder: 'Seleziona una valuta',
          photo: 'Foto della confezione',
        },
        hints: {
          weight: 'Solo numeri, maggiore di 0',
          price: 'Solo numeri, 0 o maggiore',
          currency: 'Codice valuta, es. EUR, USD',
          photo: 'Foto chiara che mostra chiaramente il prezzo e il peso sulla confezione. JPG, PNG o WebP (max 5MB)',
        },
        actions: {
          submit: 'Invia segnalazione',
          submitting: 'Invio in corso...',
          reset: 'Pulisci',
        },
      },
      validation: {
        required: 'Campo obbligatorio',
        invalidEmail: 'Inserisci un indirizzo email valido',
        minWeight: 'Il peso deve essere maggiore di 0',
        minPrice: 'Il prezzo deve essere 0 o maggiore',
        invalidImage: 'La foto non è valida. Assicurati che sia JPG, PNG o WebP e inferiore a 5MB.',
        imageUploadError: 'Errore nel caricamento della foto. Riprova.',
      },
      success: {
        heading: 'Grazie, segnalazione ricevuta',
        message: 'Il tuo contributo e in revisione con stato pending.',
      },
      error: {
        generic: 'Non siamo riusciti a inviare la segnalazione. Riprova tra poco.',
      },
    },
  },
  en: {
    meta: {
      siteTitle: 'The Nutella Index',
      siteDescription: 'Global Nutella price tracking with an interactive map and dynamic rankings.',
      siteOgDescription: 'Compare Nutella prices worldwide with a live map and updated rankings.',
    },
    nav: {
      title: 'Nutella Index',
      openMenuAria: 'Open navigation menu',
      links: {
        ranking: 'Ranking',
        submit: 'Submit your data',
        info: 'Info',
        worldMap: 'World Map',
      },
    },
    common: {
      footer: {
        rights: 'All rights reserved.',
        builtWith: 'Built with passion for data, travel, and Nutella.',
      },
    },
    about: {
      heading: 'About us',
      intro: {
        title: 'About This Project',
        paragraph1:
          'Hi, I am Andrea. I am a software engineer from Italy with a background in Web Information and Data Engineering. I have always been passionate about data, the web, and building small projects that turn curiosity into something tangible.',
        paragraph2:
          'Every Monday, I enjoy watching HumanSafari and his adventures around the world. If you have seen his videos, you know he has a habit of exploring local supermarkets and, at some point, he started casually mentioning Nutella prices in different countries.',
        quote: 'Why not build a simple data pipeline to analyze all his videos and extract every Nutella price he has ever mentioned?',
      },
      technical: {
        title: 'For the curious and the geeks',
        intro: 'Here is a more technical breakdown of how this dataset came to life:',
        bullets: {
          transcripts: 'It all started with scraping transcripts from Nicolò’s videos.',
          regex: 'I used a simple regex search for "Nutella" to identify relevant mentions.',
          contextWindow: 'For each match, I extracted a context window and checked for nearby references to prices and weights.',
          normalize: 'I normalized the data using regex patterns to extract weight, local price, and currency.',
          inferCountry: 'When possible, I inferred the country from the video title.',
          aiLabeling: 'Then I used AI to label each entry into ready, missing data, ambiguous, or false positive.',
          manualReview: 'After that, I manually reviewed everything, often going back to the exact moment in the video referenced by the transcript.',
        },
      },
      result: {
        title: 'The result',
        paragraph1:
          'I may have missed a few entries here and there, but I managed to build a clean and usable dataset without watching thousands of hours of footage.',
        paragraph2:
          'More importantly, I turned a fun idea into something you can explore, compare, and maybe even contribute to.',
      },
      closing: 'If you enjoy this project even half as much as I enjoyed building it, that is already a win 🙂',
      backToInfo: 'Back to info',
    },
    map: {
      loading: 'Connecting to the satellite...',
      openDetailsAria: 'Open details',
      unknownLocation: 'Unknown',
      closeDetailsAria: 'Close details',
      averagePrice: 'Average price',
      notAvailable: 'N/A',
      entries: 'Countries List',
      swipeDownToClose: 'Swipe down to close',
      swipeUpToOpen: 'Swipe up to open the list',
      clickRowToZoom: 'Click a row to zoom on the map',
      toggleEntriesAria: 'Open or close entries panel',
      listAveragePrefix: 'Average',
      listLatestPrefix: 'Latest update',
    },
    ranking: {
      heading: 'Global Nutella Ranking',
      subtitle: 'Country ranking based on average EUR/100g price.',
      howToReadTitle: 'How to read this ranking',
      howToReadText:
        'The table sorts countries by average Nutella price normalized to 100g (EUR/100g). The average value enables consistent comparison across different package sizes. The "Samples" column shows how many observations were used and "Latest update" shows data freshness.',
      intro: {
        question: 'Where is Nutella the most expensive in the world? And where can you get it for the best price?',
        paragraph1:
          'This global ranking compares Nutella prices across countries using a standardized metric: EUR per 100 grams (EUR/100g). By normalizing prices this way, we make it easy to compare jars of different sizes and currencies on a like-for-like basis.',
        paragraph2:
          'Whether you are a traveler, a curious foodie, or just someone who loves Nutella, this ranking gives a clear snapshot of how prices vary worldwide.',
      },
      guide: {
        title: 'How to read this ranking',
        intro: 'Each country is ranked based on the average Nutella price per 100g in euros.',
        points: {
          metricLabel: 'EUR/100g',
          metricText:
            'Core metric: local prices are converted to euros and normalized by package size, so values are directly comparable.',
          samplesLabel: 'Samples',
          samplesText:
            'Number of collected observations for that country. More samples generally mean a more reliable average.',
          latestLabel: 'Latest update',
          latestText:
            'Shows how recent the data is, so you can quickly judge data freshness.',
        },
        detailsIntro: 'Inside each country, you can inspect detailed entries including:',
        detailsList: {
          size: 'Product size (e.g. 200g, 750g)',
          localPrice: 'Local price and currency',
          eurValue: 'Calculated EUR/100g value',
          collectedDate: 'Date of collection',
          source: 'Data source',
        },
      },
      insights: {
        title: 'What this ranking shows',
        paragraph:
          'Nutella prices can vary dramatically from country to country. Import costs, local demand, taxes, and distribution all play a role.',
        premiumPoint:
          'Some countries rank near the top with premium pricing, where Nutella is positioned as more of a luxury item.',
        affordablePoint:
          'Others offer surprisingly affordable prices, often due to stronger local availability or lower logistics costs.',
      },
      inspiration: {
        title: 'Inspired by real-world travel',
        paragraph1:
          'This project takes inspiration from HumanSafari (Nicolo Balini), a travel creator known for exploring local supermarkets around the world. During his trips, he started casually tracking Nutella prices across countries, turning a simple curiosity into a global comparison.',
        paragraph2:
          'The initial dataset comes directly from his videos and continues to grow with new contributions and updated observations.',
      },
      freshness: {
        title: 'Keep it fresh',
        paragraph:
          'This ranking is continuously updated with new data points from around the world. Prices change, currencies fluctuate, and new samples improve accuracy over time.',
        cta: 'Use the sorting options to explore:',
      },
      tableAria: 'Ranking table of average Nutella prices by country',
      columns: {
        country: 'Country',
        average: 'Average (EUR/100g)',
        samples: 'Samples',
        latestUpdate: 'Latest update',
      },
      sortLabels: {
        expensive: 'Most expensive',
        cheap: 'Most affordable',
        recent: 'Recently updated',
      },
      metadata: {
        titlePrefix: 'Global Nutella Ranking',
        description:
          'Dynamic ranking of Nutella prices worldwide: compare countries by average cost, volatility, and recency.',
        ogDescription:
          'Explore the global Nutella price ranking and discover where it costs more or less.',
        twitterDescription: 'Updated ranking of average Nutella prices per 100g worldwide.',
      },
      details: {
        headingPrefix: 'Entries from',
        enteriesCount: 'observations',
        viewEntries: 'View details',
        entryTable: {
          weight: 'Weight',
          localPrice: 'Local price',
          eurPrice: 'EUR/100g',
          collectedAt: 'Date',
          provider: 'Source',
        },
      },
    },
    entries: {
      heading: 'Observations from',
      backToRanking: 'Back to ranking',
      totalEntries: 'total observations',
      noEntries: 'No observations found',
    },
    info: {
      heading: 'Info',
      intro: 'This section includes project details, data notes, and key legal information.',
      links: {
        aboutUs: 'About us',
        dataInfo: 'Data info',
        termsIp: 'Terms and intellectual property',
        docs: 'Docs',
      },
      aboutUs: {
        heading: 'About us',
        paragraph1:
          'The Nutella Index was created to explain global price differences in a transparent, readable, and updatable way.',
        paragraph2:
          'The project combines field observations, data normalization, and interactive map visualization.',
      },
      dataInfo: {
        heading: 'Data info',
        intro: 'Data information and disclaimer',
        source: {
          title: 'Where does the data come from?',
          paragraph1:
            'The dataset behind this project started from an unconventional (and fun) source: YouTube videos from HumanSafari (Nicolo Balini).',
          paragraph2:
            'We analyzed video transcripts to extract mentions of Nutella prices around the world. This involved a mix of automated techniques and manual validation to turn casual mentions into structured data. Over time, the dataset expanded beyond that initial source.',
        },
        community: {
          title: 'Community contributions',
          intro:
            'Some entries may have been added by users who wanted to contribute prices from their own countries or travels.',
          bullets: {
            review: 'All user-submitted data is reviewed and approved by an admin before publication.',
            consistency: 'We try to maintain consistency in format and completeness across published entries.',
          },
        },
        accuracy: {
          title: 'Accuracy disclaimer',
          intro:
            'We do our best to keep the dataset clean and reliable, but the project is based on manually mentioned prices in videos, user-contributed entries, and currency normalization.',
          bullets: {
            approximate: 'Prices may be approximate or outdated.',
            inaccuracies: 'Some entries may contain minor inaccuracies or inconsistencies.',
            factors: 'Availability, promotions, and local market factors can significantly affect real-world prices.',
          },
        },
        responsibility: {
          title: 'Responsibility',
          paragraph1:
            'This website is provided for informational and entertainment purposes only.',
          paragraph2:
            'We do not guarantee the absolute accuracy, completeness, or reliability of the presented data, and we are not responsible for decisions made based on this information.',
          note:
            'If you notice something off, feel free to report it or contribute an update. We are always happy to improve the dataset.',
        },
        closing: 'Thanks for understanding and for being part of the project.',
      },
      legal: {
        heading: 'Terms and intellectual property',
        intro: 'Terms of use and intellectual property',
        generalUse: {
          title: '1. General use',
          paragraph1:
            'By accessing and using this website, you agree to use it for personal, informational, and non-commercial purposes only.',
          paragraph2:
            'Content is provided for entertainment and general interest and should not be considered authoritative or legally binding.',
        },
        noAffiliation: {
          title: '2. No affiliation',
          paragraph1:
            'This project is an independent initiative and is not affiliated with, endorsed by, or sponsored by Ferrero S.p.A., the company that produces Nutella.',
          paragraph2:
            'Nutella is a registered trademark of Ferrero S.p.A., and all related rights belong to their respective owners. Any mention on this website is purely for:',
          bullets: {
            identification: 'identification purposes',
            analysis: 'comparative analysis',
            commentary: 'commentary',
          },
        },
        dataContent: {
          title: '3. Data and content',
          intro: 'All data presented on this website:',
          bullets: {
            source: 'is collected from publicly available sources (e.g. videos, user contributions)',
            processing: 'is processed and organized independently',
            quality: 'may not be complete, accurate, or up to date',
          },
          note:
            'We do not claim ownership over third-party content, trademarks, or copyrighted material referenced on the site.',
        },
        intellectualProperty: {
          title: '4. Intellectual property',
          intro: 'Unless otherwise stated, the following are the property of this project:',
          owned: {
            heading: 'Owned by this project:',
            bullets: {
              structure: 'website structure and design',
              dataset: 'compiled dataset as a collection and organization',
              text: 'original text content and explanations',
            },
          },
          allowed: {
            heading: 'You may:',
            bullet: 'view and use the content for personal use',
          },
          forbidden: {
            heading: 'You may not:',
            bullets: {
              redistribute: 'reproduce, redistribute, or republish substantial parts of the dataset or website',
              commercial: 'use the content for commercial purposes without permission',
            },
          },
        },
        liability: {
          title: '5. Limitation of liability',
          intro: 'This website is provided "as is", without warranties of any kind. We are not liable for:',
          bullets: {
            inaccuracies: 'inaccuracies in the data',
            decisions: 'decisions made based on the provided information',
            damages: 'any direct or indirect damages resulting from the use of this website',
          },
        },
        changes: {
          title: '6. Changes',
          paragraph:
            'These terms may be updated at any time without prior notice. Continued use of the website implies acceptance of the current version.',
        },
        contact:
          'For intellectual property or content reports, please contact us at info.nutellaindex@gmail.com and we will handle the request promptly.',
      },
    },
    submit: {
      heading: 'Submit your data',
      description: 'Share a local observation: we review it and, if valid, promote it to the main dataset.',
      form: {
        labels: {
          submitterName: 'Name',
          submitterEmail: 'Email',
          country: 'Country',
          countryPlaceholder: 'Select a country',
          city: 'City (optional)',
          weight: 'Weight (g)',
          price: 'Local price',
          currency: 'Currency',
          currencyPlaceholder: 'Select a currency',
          photo: 'Package photo',
        },
        hints: {
          weight: 'Numbers only, greater than 0',
          price: 'Numbers only, 0 or greater',
          currency: 'Currency code, e.g. EUR, USD',
          photo: 'Clear photo showing the price and weight clearly on the package. JPG, PNG or WebP (max 5MB)',
        },
        actions: {
          submit: 'Submit observation',
          submitting: 'Submitting...',
          reset: 'Reset',
        },
      },
      validation: {
        required: 'This field is required',
        invalidEmail: 'Please enter a valid email address',
        minWeight: 'Weight must be greater than 0',
        minPrice: 'Price must be 0 or greater',
        invalidImage: 'The photo is not valid. Make sure it is JPG, PNG or WebP and under 5MB.',
        imageUploadError: 'Error uploading the photo. Please try again.',
      },
      success: {
        heading: 'Thanks, submission received',
        message: 'Your contribution is now pending review.',
      },
      error: {
        generic: 'We could not submit your observation. Please try again shortly.',
      },
    },
  },
};

export async function getDictionary(locale: Locale): Promise<Messages> {
  return dictionaries[locale];
}
