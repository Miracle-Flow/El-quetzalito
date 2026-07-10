import Container from "@/features/marketing/ui/Container";

export default function GalleryPage() {
  return (
    <section className="py-20">
      <Container>
        <h1 className="text-5xl">Gallery</h1>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square rounded bg-black/10" />
          ))}
        </div>
      </Container>
    </section>
  );
}
