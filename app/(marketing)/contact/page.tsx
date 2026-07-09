import Container from "@/features/restaurant/ui/Container";

export default function ContactPage() {
  return (
    <section className="py-20">
      <Container className="max-w-2xl">
        <h1 className="text-5xl">Contact</h1>
        <p className="mt-4 opacity-80">123 Main Street · City, Country</p>
        <p className="opacity-80">hello@restaurant.com · (555) 123-4567</p>
      </Container>
    </section>
  );
}
