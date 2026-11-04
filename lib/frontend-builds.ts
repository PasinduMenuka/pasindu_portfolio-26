// Front-end build notes for each detailed case study, keyed by project id.

// AI-assisted design-to-code workflow, shared by every case study.
export const aiWorkflow = {
  tools: [
    { name: "Claude Code", use: "AI coding agent that scaffolds, refactors and tests components in the repo" },
    { name: "Figma MCP server", use: "Feeds frames, variables and tokens straight from Figma into the agent" },
    { name: "shadcn/ui", use: "Open-source component library, copied into the codebase and themed with our tokens" },
  ],
  steps: [
    { title: "Design in Figma", body: "Components and variables are named the same way they will be in code." },
    { title: "Figma MCP reads it", body: "The selected frame’s layout, tokens and assets are passed to the agent as context." },
    { title: "Claude Code builds", body: "It generates typed React components on shadcn/ui primitives, styled with Tailwind." },
    { title: "I review & refine", body: "I check every diff against the design, accessibility and tests before it merges." },
  ],
};

export type FrontendBuild = {
  accent: string;
  intro: string;
  aiNote: string;
  prototypeUrl?: string;
  stack: { group: string; items: { name: string; use: string }[] }[];
  architecture: { title: string; body: string }[];
  snippet: { file: string; caption: string; code: string };
  practices: string[];
};

export const frontendBuilds: Record<string, FrontendBuild> = {
  // HVAC IoT Work Order Management (mobile app + web)
  "1": {
    accent: "#069999",
    intro:
      "I also built the front end, so the Figma components went into code with the same names and tokens. The field app is React Native and the manager dashboard is Next.js. Both share one TypeScript domain model and one set of Tailwind-based design tokens.",
    aiNote:
      "Claude Code with the Figma MCP server turned zone cards, priority badges and work-order forms into shadcn/ui-based components in hours, leaving me more time for offline sync and live data.",
    stack: [
      {
        group: "Framework",
        items: [
          { name: "React Native + Expo", use: "iOS & Android field app" },
          { name: "Next.js (App Router)", use: "Web dashboard for managers" },
          { name: "TypeScript", use: "Shared types for zones, units & orders" },
        ],
      },
      {
        group: "Styling & UI",
        items: [
          { name: "Tailwind CSS", use: "Utility styling from design tokens" },
          { name: "NativeWind", use: "The same Tailwind classes on mobile" },
          { name: "shadcn/ui", use: "Accessible web primitives" },
        ],
      },
      {
        group: "Data & state",
        items: [
          { name: "TanStack Query", use: "Caching, retries & background refetch" },
          { name: "WebSockets", use: "Live zone temperature & alerts" },
          { name: "Zustand", use: "Filters, session & offline queue" },
        ],
      },
      {
        group: "Forms, charts & quality",
        items: [
          { name: "React Hook Form + Zod", use: "Work-order forms & validation" },
          { name: "Recharts / Victory Native", use: "Performance charts (1H–1D)" },
          { name: "Jest + Testing Library", use: "Component & hook tests" },
        ],
      },
    ],
    architecture: [
      { title: "One token source", body: "Colours, spacing and radii live in one Tailwind preset. NativeWind uses it for mobile and the web reads the same file, so dark mode and the teal accent match on both." },
      { title: "Offline-first work orders", body: "Status changes in basements with no signal are queued in Zustand and synced when the device reconnects. The UI updates straight away." },
      { title: "Live telemetry", body: "A WebSocket stream writes zone readings into the TanStack Query cache, so cards and charts update without polling." },
      { title: "Atomic components", body: "Atoms, molecules and organisms follow the Figma library: priority badges, zone cards and the bottom navigation, each typed and documented." },
    ],
    snippet: {
      file: "hooks/use-zone-telemetry.ts",
      caption: "Live zone readings are pushed into the query cache",
      code: `export function useZoneTelemetry(zoneId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const ws = new WebSocket(\`\${WS_URL}/zones/\${zoneId}\`);
    ws.onmessage = (e) => {
      const reading: ZoneReading = JSON.parse(e.data);
      queryClient.setQueryData(["zone", zoneId], (prev?: Zone) =>
        prev ? { ...prev, ...reading } : prev
      );
    };
    return () => ws.close();
  }, [zoneId, queryClient]);

  return useQuery({ queryKey: ["zone", zoneId], queryFn: () => getZone(zoneId) });
}`,
    },
    practices: [
      "48 px touch targets & haptics",
      "WCAG 2.1 AA contrast in dark mode",
      "Skeleton loading states",
      "Typed API client from OpenAPI",
      "ESLint, Prettier & strict TS",
      "Design-to-code handoff in Storybook",
    ],
  },

  // SES Portal Revamp (enterprise web dashboard)
  "7": {
    accent: "#069999",
    intro:
      "I built the dashboard in Next.js using the same atomic structure as the Figma library. Every component in the design maps to a typed React component, and Tailwind tokens carry the Slate Mono theme into code for both dark and light mode.",
    aiNote:
      "The Figma MCP server gave Claude Code the 80+ component library and Slate Mono variables, so tables, wizards and badges came out on shadcn/ui already matching the design system.",
    stack: [
      {
        group: "Framework",
        items: [
          { name: "Next.js (App Router)", use: "Routing, layouts & server components" },
          { name: "React", use: "Component model" },
          { name: "TypeScript", use: "Typed sites, zones, devices & incidents" },
        ],
      },
      {
        group: "Styling & UI",
        items: [
          { name: "Tailwind CSS", use: "Slate Mono tokens & responsive layouts" },
          { name: "shadcn/ui + Radix UI", use: "Dialogs, menus, tabs & tooltips" },
          { name: "next-themes", use: "System-aware dark / light toggle" },
        ],
      },
      {
        group: "Data & tables",
        items: [
          { name: "TanStack Query", use: "Server state & live refetch" },
          { name: "TanStack Table", use: "Sortable, filterable incident tables" },
          { name: "Zustand", use: "Quick filters & selected site" },
        ],
      },
      {
        group: "Forms, charts & motion",
        items: [
          { name: "React Hook Form + Zod", use: "4-step site & 7-step zone wizards" },
          { name: "Recharts", use: "Temperature trends & KPI charts" },
          { name: "Framer Motion", use: "Panel & wizard transitions" },
        ],
      },
    ],
    architecture: [
      { title: "Atomic design in code", body: "The folders mirror the Figma library (atoms, molecules, organisms, templates), so designers and engineers use the same words for the same component." },
      { title: "Severity as a variant", body: "P1 (red), P2 (amber), work orders (blue) and healthy (teal) are cva variants on one Badge component, so colour-coding can’t drift between screens." },
      { title: "Server-first pages", body: "Site lists and summaries render as server components. Only interactive islands such as charts, filters and wizards ship JavaScript." },
      { title: "Wizard engine", body: "Site and zone creation share one step engine with per-step Zod schemas, a progress rail and resumable drafts." },
    ],
    snippet: {
      file: "components/atoms/severity-badge.tsx",
      caption: "Severity colours live in one typed variant map",
      code: `const severity = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      level: {
        p1: "bg-red-500/15 text-[#fb2c36]",
        p2: "bg-amber-500/15 text-[#E5A800]",
        workOrder: "bg-blue-500/15 text-blue-400",
        healthy: "bg-[#069999]/15 text-[#069999]",
      },
    },
  }
);

export function SeverityBadge({ level, children }: BadgeProps) {
  return <span className={severity({ level })}>{children}</span>;
}`,
    },
    practices: [
      "Keyboard-navigable tables & dialogs",
      "Responsive desktop → tablet layouts",
      "Code-split charts with next/dynamic",
      "Storybook for every atom",
      "Playwright smoke tests on wizards",
      "Strict TypeScript & ESLint",
    ],
  },

  // Infinity Gift Card Revamp 2.0 (e-commerce website)
  "8": {
    accent: "#CE0E2D",
    prototypeUrl: "https://ivory-quartz-56664070.figma.site",
    intro:
      "I turned the Figma UI kit into a production front end with Next.js and Tailwind CSS. Catalogue pages are pre-rendered for speed and SEO, and the Design-a-card wizard, cart and wallet run as small client-side islands that share one typed store.",
    aiNote:
      "I built the advanced interactive prototype with AI. Claude Code read all 29 screens through the Figma MCP server and assembled the Design-a-card wizard, cart drawer and wallet from shadcn/ui components, so testers could click through a real flow and not just static frames.",
    stack: [
      {
        group: "Framework",
        items: [
          { name: "Next.js (App Router)", use: "Static & ISR catalogue pages, SEO" },
          { name: "React", use: "Component model" },
          { name: "TypeScript", use: "Typed cards, orders & recipients" },
        ],
      },
      {
        group: "Styling & UI",
        items: [
          { name: "Tailwind CSS", use: "Crimson tokens & mobile-first breakpoints" },
          { name: "shadcn/ui + Radix UI", use: "Wizard dialog, cart sheet, accordions" },
          { name: "Embla Carousel", use: "Hero & category rails with swipe" },
        ],
      },
      {
        group: "Data & state",
        items: [
          { name: "Zustand (persisted)", use: "Cart & wizard draft survive reloads" },
          { name: "TanStack Query", use: "Wallet, orders & transactions" },
          { name: "Intl API", use: "LKR / USD / GBP / AED / AUD / EUR pricing" },
        ],
      },
      {
        group: "Forms, motion & media",
        items: [
          { name: "React Hook Form + Zod", use: "Validation for each wizard step" },
          { name: "Framer Motion", use: "Step transitions & cart drawer" },
          { name: "next/image", use: "Responsive card art, lazy loaded" },
        ],
      },
    ],
    architecture: [
      { title: "Wizard as a state machine", body: "Each of the four steps has its own Zod schema. The draft is saved to a persisted Zustand store, so a buyer who closes the modal can pick up where they left off." },
      { title: "Guest-first checkout", body: "The cart, bag and wizard need no session. Auth (email or Google) appears only at payment, and the guest cart merges into the account." },
      { title: "Fast catalogue", body: "Occasion and experience pages are pre-rendered and revalidated on a timer. Filters update the URL, so results can be shared and the back button works." },
      { title: "Tokens from Figma", body: "Crimson, blush and ink, the radii and the Poppins type scale sit in tailwind.config, so the design and the code use the same names." },
    ],
    snippet: {
      file: "features/design-a-card/schema.ts",
      caption: "Each wizard step is validated by its own Zod schema",
      code: `export const recipientStep = z.object({
  name: z.string().min(2, "Who is this gift for?"),
  email: z.string().email(),
  mobile: z.string().regex(/^\\+?\\d{9,15}$/).optional(),
  delivery: z.discriminatedUnion("when", [
    z.object({ when: z.literal("now") }),
    z.object({ when: z.literal("later"), sendAt: z.coerce.date().min(new Date()) }),
  ]),
});

export const channelStep = z.object({
  channel: z.enum(["email", "whatsapp", "both"]),
});

export type CardDraft = z.infer<typeof recipientStep> & z.infer<typeof channelStep>;`,
    },
    practices: [
      "Mobile-first, 44 px tap targets",
      "Focus-trapped, labelled dialogs",
      "URL-synced filters",
      "Lazy images & code-split wizard",
      "Core Web Vitals monitoring",
      "Strict TypeScript & ESLint",
    ],
  },
  // BloomingBox Revamp (responsive web + iOS)
  "9": {
    accent: "#B4646B",
    intro:
      "I built the redesigned storefront with Next.js, Tailwind CSS and shadcn/ui. Category and product pages are rendered on the server for speed and SEO, while the bag, add-ons and checkout run as client islands that share one typed store.",
    aiNote:
      "Claude Code read the Figma file through the Figma MCP server and turned the product card, option chips, bottom bar and checkout steps into shadcn/ui-based components, using the same names and tokens as the design. I reviewed every diff and spent the saved time on delivery-slot logic and RTL.",
    stack: [
      {
        group: "Framework",
        items: [
          { name: "Next.js (App Router)", use: "Server-rendered catalogue & SEO" },
          { name: "React", use: "Component model" },
          { name: "TypeScript", use: "Typed products, options & orders" },
        ],
      },
      {
        group: "Styling & UI",
        items: [
          { name: "Tailwind CSS", use: "Blush & ink tokens, RTL-aware utilities" },
          { name: "shadcn/ui + Radix UI", use: "Sheets, dialogs, tabs & selects" },
          { name: "Embla Carousel", use: "Product galleries & rails" },
        ],
      },
      {
        group: "Data & state",
        items: [
          { name: "Zustand (persisted)", use: "Bag & checkout draft" },
          { name: "TanStack Query", use: "Stock, slots & pricing per emirate" },
          { name: "next-intl", use: "English & Arabic, AED formatting" },
        ],
      },
      {
        group: "Forms, motion & media",
        items: [
          { name: "React Hook Form + Zod", use: "Receiver, card & slot validation" },
          { name: "Framer Motion", use: "Sheets, chips & countdown" },
          { name: "next/image", use: "Responsive, lazy product images" },
        ],
      },
    ],
    architecture: [
      { title: "Delivery city as context", body: "The selected emirate lives in a cookie and a React context. Server components read it to price and filter stock, so the page never shows a product that can’t be delivered." },
      { title: "Checkout as small steps", body: "Greeting card, receiver, slot and payment each have their own Zod schema. The draft is persisted, so a sender who leaves can come back to the same step." },
      { title: "Theme layer for partners", body: "Collaboration pages set a data-theme attribute. Tailwind reads CSS variables, so Netflix or Mercedes-Benz skins need no component changes." },
      { title: "Tokens from Figma", body: "Ink, blush, petal and rose, the radii, blur and type scale sit in tailwind.config, matching the Figma variables one to one." },
    ],
    snippet: {
      file: "features/checkout/receiver-schema.ts",
      caption: "The receiver step covers delivery, pickup and surprise gifts",
      code: `export const receiverStep = z.discriminatedUnion("method", [
  z.object({
    method: z.literal("delivery"),
    name: z.string().min(2, "Who is this gift for?"),
    mobile: z.string().regex(/^\\+971\\d{8,9}$/),
    // Surprise gifts: we call the receiver for the address
    address: z.union([addressSchema, z.literal("call-receiver")]),
  }),
  z.object({
    method: z.literal("pickup"),
    store: z.string(),
  }),
]);

export const slotStep = z.object({
  type: z.enum(["free", "priority"]),
  date: z.coerce.date().min(startOfToday()),
  window: z.string(),
});`,
    },
    practices: [
      "Mobile-first, 48 px tap targets",
      "Arabic RTL from day one",
      "Server-rendered catalogue",
      "Focus-trapped sheets & dialogs",
      "Lazy images & code-split checkout",
      "Strict TypeScript & ESLint",
    ],
  },
  // SalesPlay POS Revamp (Android tablet + phone)
  "10": {
    accent: "#007AFF",
    intro:
      "The POS is a native Android app, so the handoff went to Jetpack Compose with Material 3. I set up the design tokens and the shared components (payment buttons, quick-amount chips, split rows and the snackbar), so tablet and phone layouts are built from the same pieces.",
    aiNote:
      "Claude Code read the payment and onboarding frames through the Figma MCP server and drafted Compose components and previews for each state, such as surcharge, dual price and offline. I checked every diff against the design and the payment rules before it merged.",
    stack: [
      {
        group: "Platform",
        items: [
          { name: "Kotlin", use: "App language" },
          { name: "Jetpack Compose", use: "Declarative UI for tablet & phone" },
          { name: "Material 3", use: "Theming, dialogs & snackbars" },
        ],
      },
      {
        group: "Layout",
        items: [
          { name: "Window size classes", use: "Two panels on tablet, one column on phone" },
          { name: "Compose previews", use: "Every payment state reviewed in isolation" },
          { name: "Design tokens", use: "Colour, type & spacing from Figma variables" },
        ],
      },
      {
        group: "Data & state",
        items: [
          { name: "ViewModel + StateFlow", use: "One payment state per ticket" },
          { name: "Room", use: "Offline sales, synced later" },
          { name: "Kotlin coroutines", use: "Card terminal & sync calls" },
        ],
      },
      {
        group: "Quality",
        items: [
          { name: "Compose UI tests", use: "Cash, card & split paths" },
          { name: "Screenshot tests", use: "Catch visual regressions per state" },
          { name: "TalkBack checks", use: "Labels on every payment action" },
        ],
      },
    ],
    architecture: [
      { title: "Payment as a state machine", body: "A ticket moves through Due → Method → Confirm → Paid. Split payments are a list of the same state, so cash, card and split share one set of rules." },
      { title: "Rules as modifiers", body: "Surcharge, dual price, rounding and currency each change the amount due in one place, and the UI only reads the result." },
      { title: "Offline first", body: "Sales are saved locally and synced when the connection returns. The snackbar tells the cashier which state they are in." },
      { title: "One snackbar host", body: "Type, size, title and dismissable are parameters on one component, so all 32 variants come from the same code." },
    ],
    snippet: {
      file: "payment/PaymentState.kt",
      caption: "One state model drives cash, card and split",
      code: `sealed interface PaymentStep {
  data object Due : PaymentStep
  data class Method(val type: PayType) : PaymentStep
  data class Confirm(val amount: Money, val surcharge: Money?) : PaymentStep
  data class Paid(val change: Money) : PaymentStep
}

data class SplitLine(
  val type: PayType,
  val amount: Money,
  val step: PaymentStep = PaymentStep.Due,
)

// Rules change the amount due in one place
fun Money.applyRules(rules: PriceRules): Money =
  rules.dualPrice(this).let(rules::round).let(rules::toCurrency)`,
    },
    practices: [
      "48 dp touch targets",
      "Confirm before every charge",
      "Offline-first sales",
      "Snackbars for every failure",
      "Screenshot tests per state",
      "TalkBack labels",
    ],
  },
};
