import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Box, Cluster, Container, Section, Stack } from "@/components/layout";
import { RenderIcon } from "@/components/render-icon";
import { Typography } from "@/components/typography";
import {
  ArrowRight,
  ClockIcon,
  FlameIcon,
  HeartIcon,
  MapPinIcon,
  UtensilsIcon,
} from "@/components/icons";

const highlights = [
  { icon: ClockIcon, label: "Open 7 days a week" },
  { icon: FlameIcon, label: "Hot steam table, all day" },
  { icon: HeartIcon, label: "Original recipes" },
];

// Textile weave motif used as a faint texture overlay.
const weavePattern =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cpath d='M24 2 L46 24 L24 46 L2 24 Z' fill='none' stroke='white' stroke-width='1.2'/%3E%3Cpath d='M24 12 L36 24 L24 36 L12 24 Z' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E\")";

export default function Hero() {
  return (
    // No `variant` → transparent base; the warm brand gradient is applied as a
    // decorative layer below (see the documented exception in AGENTS.md).
    <Section spacing="24" className="relative isolate overflow-hidden">
      {/*
       * Decorative background. The design system has no gradient/glow tokens
       * (DESIGN.md §5), so these layers are an intentional, documented
       * exception. Only `var(--…)` CSS variables (semantic-token roots) are
       * used — never raw hex/oklch.
       */}
      <Box
        aria-hidden="true"
        className="absolute inset-0 -z-30"
        style={{
          background:
            "linear-gradient(150deg, var(--chart-5) 0%, var(--sidebar-primary) 38%, var(--primary) 78%, var(--chart-3) 100%)",
        }}
      />

      {/* Tertiary-yellow lantern glow (semantic utility, no var()) */}
      <Box
        aria-hidden="true"
        className="absolute -top-40 -left-40 -z-20 size-136 rounded-full bg-tertiary/40 blur-[120px]"
      />

      {/* Rose depth glow (semantic utility, no var()) */}
      <Box
        aria-hidden="true"
        className="absolute right-[-12rem] bottom-[-16rem] -z-20 size-[40rem] rounded-full bg-chart-1/30 blur-[130px]"
      />

      {/* Guatemalan-textile diamond weave overlay */}
      <Box
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.07]"
        style={{ backgroundImage: weavePattern, backgroundSize: "48px 48px" }}
      />

      {/* Bottom vignette to anchor content */}
      <Box
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-2/3"
        style={{
          background:
            "linear-gradient(to top, color-mix(in oklch, var(--chart-5) 55%, transparent), transparent)",
        }}
      />

      <Container size="2xl" spacing="6">
        <Stack
          align="center"
          gap="8"
          className="text-center text-primary-foreground"
        >
          {/* Status badge */}
          <Badge className="h-7 gap-1.5 border-primary-foreground/20 bg-primary-foreground/10 px-3 text-xs font-medium tracking-wide backdrop-blur-md [a]:hover:bg-primary-foreground/15">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-tertiary/75" />
              <span className="relative inline-flex size-2 rounded-full bg-tertiary" />
            </span>
            Open Now · Steam Table Running
          </Badge>

          {/* Spanish eyebrow */}
          <Typography
            variant="text-sm"
            transform="uppercase"
            weight="semibold"
            align="center"
            className="tracking-[0.32em] text-primary-foreground/75"
          >
            Auténtica Cocina Guatemalteca y Centroamericana
          </Typography>

          {/* Headline */}
          <Typography
            variant="h1"
            weight="bold"
            align="center"
            className="drop-shadow-sm [text-wrap:balance]"
          >
            El Quetzalito
            <span className="block text-tertiary">
              Restaurante Guatemalteco
            </span>
          </Typography>

          {/* Lead copy */}
          <Typography
            variant="text-xl"
            align="center"
            className="mx-auto max-w-2xl text-primary-foreground/85 [text-wrap:pretty]"
          >
            Our steam table is open seven days a week for you to enjoy the most
            delicious Guatemalan and Central American dishes all day long. Our
            original recipes are jealously guarded by our expert cooks, who put
            soul and heart into every plate.
          </Typography>

          {/* CTAs — on-system variants (no !important, no custom colors) */}
          <Cluster justify="center" wrap gap="3">
            <Button
              variant="secondary"
              size="lg"
              className="gap-2 shadow-lg shadow-black/20"
            >
              <RenderIcon icon={UtensilsIcon} size={20} />
              Explore the Menu
              <RenderIcon icon={ArrowRight} size={18} />
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <RenderIcon icon={MapPinIcon} size={20} />
              Get Directions
            </Button>
          </Cluster>

          {/* Highlights strip */}
          <Cluster justify="center" wrap gap="4" className="pt-6">
            {highlights.map(({ icon, label }) => (
              <Box
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/5 px-4 py-2 text-sm text-primary-foreground/80 backdrop-blur-sm"
              >
                <RenderIcon icon={icon} size={16} className="text-tertiary" />
                {label}
              </Box>
            ))}
          </Cluster>
        </Stack>
      </Container>

      {/* Decorative hairline divider into the next section */}
      <Box
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary-foreground/30 to-transparent"
      />
    </Section>
  );
}
