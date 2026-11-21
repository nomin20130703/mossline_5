export interface NavLinkItem {
  id: string;
  analyticsKey: "solutions" | "our_tech" | "company" | "resources";
  label: string;
  targetSectionId?: string;
  targetProgress?: number;
}

export interface HotspotItem {
  id: string;
  analyticsKey:
    | "soil_carbon"
    | "canopy_moisture"
    | "species_index"
    | "microclimate";
  left: string;
  top: string;
  label: string;
  value: string;
}

export interface FeatureRowItem {
  id: string;
  analyticsKey:
    | "observation_system"
    | "atmospheric_monitoring"
    | "algorithmic_processing"
    | "blockchain_traceability"
    | "built_for_scale";
  index: string;
  label: string;
  detail: string;
}

export interface SolutionCardItem {
  id: string;
  analyticsKey:
    | "forest_peatland"
    | "scope3_sourcing"
    | "biodiversity_credits";
  bracket: string;
  titleLines: string[];
  body: string;
  imageUrl: string;
  bgPosition: string;
  bgSize: string;
}

export interface StatItem {
  id: string;
  target: number;
  decimals: number;
  useComma: boolean;
  suffix: string;
  label: string;
}

export interface StoryBeatDefinition {
  name: "hero" | "vision" | "accounting" | "field_station" | "solutions";
  index: 0 | 1 | 2 | 3 | 4;
}

export const STORY_BEATS = {
  hero: { name: "hero", index: 0 },
  vision: { name: "vision", index: 1 },
  accounting: { name: "accounting", index: 2 },
  fieldStation: { name: "field_station", index: 3 },
  solutions: { name: "solutions", index: 4 },
} as const satisfies Record<string, StoryBeatDefinition>;

export const MEDIA_ASSETS = {
  flyInVideoUrl:
    "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261106_025717_906b686d-9a9a-4dea-bab4-ae2454f8390e.mp4",
  heroStillUrl:
    "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261106_031618_8ce6dca1-972d-429d-8d13-bf0691c37848.png&w=2400&q=88",
  islandCutoutUrl:
    "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261106_031657_baaa3380-5ece-482a-a623-a1838fd7653c.png&w=2400&q=90",
  rockSpritesUrl:
    "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261106_025635_82593f6a-1cf7-41c1-94ac-96fb89ebfd1a.png&w=2400&q=85",
  sensorMastStillUrl:
    "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261106_025630_9a37a1e0-2547-4973-8160-c75205993914.png&w=1400&q=82",
  floatingCloudsStillUrl:
    "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20261106_025545_b003e5cc-e68f-4fee-b686-c217a5d81eea.png&w=1400&q=82",
} as const;

export const SITE_CONTENT = {
  brandName: "Mossline",
  navLinks: [
    {
      id: "solutions",
      analyticsKey: "solutions",
      label: "Шийдлүүд",
      targetSectionId: "sol",
    },
    {
      id: "tech",
      analyticsKey: "our_tech",
      label: "Манай технологи",
      targetProgress: 0.8,
    },
    {
      id: "company",
      analyticsKey: "company",
      label: "Алсын хараа",
      targetProgress: 0.24,
    },
    {
      id: "resources",
      analyticsKey: "resources",
      label: "Бүртгэл",
      targetProgress: 0.52,
    },
  ] as NavLinkItem[],
  navCtaLabel: "Холбогдох",
  navCtaSymbol: "›",
  menuOpenAriaLabel: "Цэс нээх",
  menuCloseAriaLabel: "Цэс хаах",

  hero: {
    chip: "Planetary intelligence",
    headline: "Measure the living planet",
    stillAlt: "Хөвд болон оймоор бүрхэгдсэн хөвөгч хадан арал",
    cutoutAlt: "Тэргүүн хэсгийн ойм болон хөвдтэй арал",
    rockAlt: "Хөвдтэй хөвөгч чулуу",
    hudChip: "Биологийн олон янз байдал",
    hudCoords: [
      "ӨРГӨРӨГ  34.0922° Х",
      "УРТРАГ   116.2432° Б",
      "ӨНДӨР    842 М",
    ],
    captionLines: [
      "Экосистемийн бодит цагийн мэдээлэл.",
      "Шинжлэх ухаан, блокчэйн болон",
      "ил тод өгөгдөлд тулгуурлав.",
    ],
    scrollHint: "Гүйлгэж үзнэ үү",
  },

  vision: {
    chip: "Бидний алсын хараа",
    lines: [
      "Өгөгдлийн эмх цэгцгүй байдлаас",
      "шинжлэх ухаанд суурилсан",
      "хэрэгжихүйц ойлголт руу",
    ],
    subcopyLines: [
      "Байгаль орчны хэмжилтийн шинэ үеийн нээлт,",
      "бизнес ба үйлдвэрлэлийн хэрэглээнд зориулав.",
    ],
  },

  landscape: {
    accountingText:
      "Манай экосистемийн түвшний бүртгэл нь нарийн төвөгтэй хээрийн судалгааг баталгаажуулж болох, стандартад нийцсэн хэмжигдэхүүн болгон хөрвүүлдэг — ингэснээр та зөвхөн тайлан бус, хэмжигдэхүйц бодит үр дүнг удирдах боломжтой.",
    hotspots: [
      {
        id: "soil-carbon",
        analyticsKey: "soil_carbon",
        left: "12%",
        top: "58%",
        label: "Хөрсний нүүрстөрөгч",
        value: "+3.8 т/га",
      },
      {
        id: "canopy-moisture",
        analyticsKey: "canopy_moisture",
        left: "33%",
        top: "41%",
        label: "Титмийн чийгшил",
        value: "71 % RH",
      },
      {
        id: "species-index",
        analyticsKey: "species_index",
        left: "70%",
        top: "66%",
        label: "Зүйлийн индекс",
        value: "214 зүйл",
      },
      {
        id: "microclimate",
        analyticsKey: "microclimate",
        left: "83%",
        top: "47%",
        label: "Бичил уур амьсгал",
        value: "14.2 °C",
      },
    ] as HotspotItem[],
  },

  station: {
    tag: "× Хээрийн станц 07",
    heading: "Байгууллагын уур амьсгалын үйл ажиллагаанд шинжлэх ухааны найдвартай байдал",
    carbonCard: {
      titleLines: ["Хуримтлагдсан", "нүүрстөрөгчийн тэнцэл"],
      note: "Талбай 07 · 12 сар",
      targetValue: 24,
      unit: "тCO₂э",
      deltaTag: "+2.6 тCO₂э",
      quarters: "1-р улирал · 2-р улирал · 3-р улирал · 4-р улирал",
    },
    features: [
      {
        id: "01",
        analyticsKey: "observation_system",
        index: "01",
        label: "Алтан стандартын ажиглалтын систем",
        detail: "Хөрс, чийгшил болон нарны цацрагийг 15 минутын давтамжтай бүртгэнэ.",
      },
      {
        id: "02",
        analyticsKey: "atmospheric_monitoring",
        index: "02",
        label: "Дэлхийн түвшний агаар мандлын хяналт (AMRV)",
        detail: "Эргүүлгийн ковариацын цамхгаар хийн урсгалыг тасралтгүй хэмжинэ.",
      },
      {
        id: "03",
        analyticsKey: "algorithmic_processing",
        index: "03",
        label: "Нэгдсэн алгоритмын боловсруулалт",
        detail: "Хээрийн болон хиймэл дагуулын өгөгдлийг автоматаар цэвэрлэн шалгана.",
      },
      {
        id: "04",
        analyticsKey: "blockchain_traceability",
        index: "04",
        label: "Блокчэйнээр баталгаажсан мөрдөх чадвар",
        detail: "Хэмжилт бүрийн гарал үүслийг өөрчлөгдөхгүй бүртгэлээр баталгаажуулна.",
      },
      {
        id: "05",
        analyticsKey: "built_for_scale",
        index: "05",
        label: "Том хэмжээ, нарийн бүтцэд зориулав",
        detail: "Олон улсын нийлүүлэлтийн сүлжээ болон өргөн уудам ойд нийцнэ.",
      },
    ] as FeatureRowItem[],
  },

  solutions: {
    chip: "Манай шийдлүүд",
    heading: "Экосистемийн байгалиасаа гүйцэтгэдэг үйл явцыг баталгаажуулах нь",
    body: "Талбайн мэдрэгч, агаар мандлын урсгалын цамхаг болон хиймэл дагуулын өгөгдлийг нэгдсэн, аудит хийх боломжтой бүртгэлд нэгтгэнэ — ингэснээр таны тайлагнасан тонн бүр гарал үүслийн талбайтайгаа шууд холбогдоно.",
    arrowSymbol: "→",
    cards: [
      {
        id: "nature-based",
        analyticsKey: "forest_peatland",
        bracket: "[Байгальд суурилсан шийдэл]",
        titleLines: ["Ой ба хүлэрт намгийн", "нүүрстөрөгчийн төсөл"],
        body: "Тасралтгүй урсгалын хэмжилт нь түүврийн тооцоог орлож, нүүрстөрөгчийн кредит нь газрын бодит шингээлтийг тусгана.",
        imageUrl: MEDIA_ASSETS.sensorMastStillUrl,
        bgPosition: "22% 70%",
        bgSize: "260%",
      },
      {
        id: "supply-chain",
        analyticsKey: "scope3_sourcing",
        bracket: "[Нийлүүлэлтийн сүлжээний шийдэл]",
        titleLines: ["Хамрах хүрээ 3 эх үүсвэрийн", "баталгаажуулалт"],
        body: "Түүхий эдийг ургуулсан талбайтай нь холбон мөрдөж, тээвэрлэлт бүрд ой устгалаас ангид нотолгоог хавсаргана.",
        imageUrl: MEDIA_ASSETS.floatingCloudsStillUrl,
        bgPosition: "50% 50%",
        bgSize: "190%",
      },
      {
        id: "biodiversity",
        analyticsKey: "biodiversity_credits",
        bracket: "[Биологийн олон янз байдлын кредит]",
        titleLines: ["Амьд зүйлийн", "суурь үзүүлэлт"],
        body: "Акустик болон eDNA хяналт нь жил бүр харьцуулан тайлагнах боломжтой биологийн олон янз байдлын суурь үзүүлэлтийг бүрдүүлнэ.",
        imageUrl: MEDIA_ASSETS.sensorMastStillUrl,
        bgPosition: "62% 30%",
        bgSize: "230%",
      },
    ] as SolutionCardItem[],
    stats: [
      {
        id: "sensors",
        target: 1240,
        decimals: 0,
        useComma: true,
        suffix: "",
        label: "Суурилуулсан мэдрэгч",
      },
      {
        id: "countries",
        target: 38,
        decimals: 0,
        useComma: false,
        suffix: "",
        label: "Хянаж буй улс",
      },
      {
        id: "verified",
        target: 2.1,
        decimals: 1,
        useComma: false,
        suffix: "",
        label: "Сая тCO₂э баталгаажсан",
      },
      {
        id: "uptime",
        target: 99.4,
        decimals: 1,
        useComma: false,
        suffix: "%",
        label: "Өгөгдлийн найдвартай ажиллагаа",
      },
    ] as StatItem[],
  },

  footer: {
    copyright: "© 2026 Mossline. Бүх эрх хуулиар хамгаалагдсан.",
    backToTop: "Эхлэл рүү буцах",
  },

  contactModal: {
    chip: "Холбоо барих",
    title: "Талбайн хэмжилтийн зөвлөгөө авах",
    subtitle: "Өөрийн экосистем эсвэл нийлүүлэлтийн сүлжээний төслийн мэдээллийг үлдээнэ үү.",
    closeLabel: "Хаах",
    nameLabel: "Овог нэр",
    namePlaceholder: "Жишээ нь: Б. Тэмүүлэн",
    emailLabel: "Байгууллагын имэйл",
    emailPlaceholder: "temuulen@company.mn",
    topicLabel: "Сонирхож буй чиглэл",
    notesLabel: "Төслийн товч мэдээлэл",
    notesPlaceholder: "Талбайн хэмжээ, байршил эсвэл зорилтот стандартаа бичнэ үү...",
    submitLabel: "Хүсэлт илгээх",
    errorRequired: "Та нэр болон хүчинтэй имэйл хаягаа оруулна уу.",
    successTitle: "Хүсэлтийг хүлээн авлаа",
    successBody: "Манай хээрийн судалгааны баг ажлын 1 өдрийн дотор таны имэйлээр холбогдох болно.",
    successAction: "Хаах",
  },
} as const;
