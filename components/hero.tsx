import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cluster, Container, Stack } from "@/components/layout";
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

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Warm brand gradient base — burgundy to rose, evoking Guatemalan warmth */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30"
        style={{
          background:
            "linear-gradient(150deg, var(--chart-5) 0%, var(--sidebar-primary) 38%, var(--primary) 78%, var(--chart-3) 100%)",
        }}
      />

      {/* Soft tertiary-yellow glow, upper left — like lantern light */}
      <div
        aria-hidden="true"
        className="absolute -top-40 -left-40 -z-20 size-[34rem] rounded-full opacity-40 blur-[120px]"
        style={{ backgroundColor: "var(--tertiary)" }}
      />

      {/* Rose highlight glow, lower right — depth */}
      <div
        aria-hidden="true"
        className="absolute right-[-12rem] bottom-[-16rem] -z-20 size-[40rem] rounded-full opacity-30 blur-[130px]"
        style={{ backgroundColor: "var(--chart-1)" }}
      />

      {/* Guatemalan-textile diamond weave overlay — subtle texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.07]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cpath d='M24 2 L46 24 L24 46 L2 24 Z' fill='none' stroke='white' stroke-width='1.2'/%3E%3Cpath d='M24 12 L36 24 L24 36 L12 24 Z' fill='none' stroke='white' stroke-width='1'/%3E%3C/svg%3E\")",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Bottom vignette to anchor the content */}
      <div
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
          className="px-2 py-24 text-center md:py-32 lg:py-40"
        >
          {/* Status badge */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Badge className="h-7 gap-1.5 border-white/20 bg-white/10 px-3 text-xs font-medium tracking-wide text-white backdrop-blur-md [a]:hover:bg-white/15">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>
              Open Now · Steam Table Running
            </Badge>
          </div>

          {/* Spanish eyebrow */}
          <Typography
            variant="text-sm"
            transform="uppercase"
            weight="semibold"
            align="center"
            className="animate-in fade-in delay-75 duration-700 tracking-[0.32em] text-white/75"
          >
            Auténtica Cocina Guatemalteca y Centroamericana
          </Typography>

          {/* Headline */}
          <Typography
            variant="h1"
            weight="bold"
            align="center"
            className="animate-in fade-in slide-in-from-bottom-6 delay-100 duration-700 text-white drop-shadow-sm [text-wrap:balance]"
          >
            El Quetzalito
            <span className="block text-tertiary">Restaurante Guatemalteco</span>
          </Typography>

          {/* Lead copy */}
          <Typography
            variant="text-xl"
            align="center"
            className="animate-in fade-in delay-150 duration-700 mx-auto max-w-2xl text-white/85 [text-wrap:pretty]"
          >
            Our steam table is open seven days a week for you to enjoy the most
            delicious Guatemalan and Central American dishes all day long. Our
            original recipes are jealously guarded by our expert cooks, who put
            soul and heart into every plate.
          </Typography>

          {/* CTAs */}
          <Cluster
            justify="center"
            wrap
            gap="3"
            className="animate-in fade-in slide-in-from-bottom-4 delay-200 duration-700 pt-2"
          >
            <Button
              size="lg"
              className="!h-12 gap-2 !rounded-full !bg-white !px-8 !text-base !text-primary shadow-lg shadow-black/20 transition-transform hover:scale-[1.02] hover:!bg-white/90"
            >
              <RenderIcon icon={UtensilsIcon} size={20} />
              Explore the Menu
              <RenderIcon icon={ArrowRight} size={18} />
            </Button>
            <Button
              size="lg"
              className="!h-12 gap-2 !rounded-full !border-white/30 !bg-white/5 !px-8 !text-base !text-white backdrop-blur-md transition-colors hover:!bg-white/15"
            >
              <RenderIcon icon={MapPinIcon} size={20} />
              Get Directions
            </Button>
          </Cluster>

          {/* Highlights strip */}
          <Cluster
            justify="center"
            wrap
            gap="4"
            className="animate-in fade-in delay-300 duration-700 pt-10"
          >
            {highlights.map(({ icon, label }) => (
              <div
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur-sm"
              >
                <RenderIcon icon={icon} size={16} className="text-tertiary" />
                {label}
              </div>
            ))}
          </Cluster>
        </Stack>
      </Container>

      {/* Decorative bottom fade into next section */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
      />
    </section>
  );
}
