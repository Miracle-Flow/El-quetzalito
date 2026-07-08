import Image from "next/image";

import { Button } from "@/components/ui/button";

import { Cluster, Container, Section, Stack } from "@/components/layout";

import { ArrowRight, Leaf } from "../../components/icons";
import RenderIcon from "../../components/render-icon";
import { Typography } from "../../components/typography";

export default function Hero() {
  return (
    <Section spacing="24" className="rounded-es-4xl bg-secondary">
      <Container size={"lg"}>
        <Cluster justify={"between"}>
          <Stack align={"start"} gap={"12"}>
            <Stack align={"start"} gap={"4"}>
              <Typography
                transform={"uppercase"}
                variant={"text-xs"}
                textColor={"primary"}
                weight={"semibold"}
                className="tracking-wider"
              >
                Fresh. bold. made to crave.
              </Typography>
              <Stack align={"start"} gap={"0"}>
                <Typography transform={"capitalize"} variant={"h3"} weight={"semibold"}>
                  Real Mexican.
                </Typography>
                <Typography
                  transform={"capitalize"}
                  variant={"h3"}
                  textColor={"primary"}
                  weight={"semibold"}
                >
                  Made Fresh.
                </Typography>
              </Stack>
              <Typography variant={"text-md"} className="max-w-sm">
                Savor bold flavors, fresh ingredients, and authentic recipes — grilled to
                perfection.
              </Typography>
            </Stack>

            <Cluster>
              <Button rightIcon={{ icon: ArrowRight, size: 18 }}>Order Now</Button>
              <Button variant={"outline"} className={"border-primary bg-secondary text-primary"}>
                View Menu
              </Button>
            </Cluster>

            <Cluster gap={"8"}>
              {Array.from({ length: 3 }).map((_, index) => (
                <Cluster key={index} gap={"2"}>
                  <RenderIcon icon={Leaf} size={36} className="text-primary" />
                  <Typography
                    variant={"text-sm"}
                    weight={"semibold"}
                    className="max-w-20 leading-4.5"
                  >
                    Fresh Ingredients
                  </Typography>
                </Cluster>
              ))}
            </Cluster>
          </Stack>
          <Image className="object-cover" src="/food.webp" alt="food" height={500} width={500} />
        </Cluster>
      </Container>
    </Section>
  );
}
