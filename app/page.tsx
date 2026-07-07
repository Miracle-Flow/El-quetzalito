import { RocketIcon } from "@/components/icons";
import { Container, Stack } from "@/components/layout";
import { RenderIcon } from "@/components/render-icon";
import { Typography } from "@/components/typography";

export default function Home() {
  return (
    <Container spacing="6">
      <Stack align="start" className="py-16">
        <Typography variant="h1" weight="bold">
          El Quetzalito
        </Typography>
        <Typography variant="text-lg" textColor="muted">
          A Next.js starter with shadcn/ui, oxlint, and oxfmt.
        </Typography>
        <div className="flex items-center gap-2 text-primary">
          <RenderIcon icon={RocketIcon} size={24} />
          <Typography variant="text-md" weight="semibold" textColor="primary">
            Ready to ship
          </Typography>
        </div>
      </Stack>
    </Container>
  );
}
