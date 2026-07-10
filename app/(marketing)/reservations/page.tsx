import Button from "@/features/marketing/ui/Button";
import Container from "@/features/marketing/ui/Container";

export default function ReservationsPage() {
  return (
    <section className="py-20">
      <Container className="max-w-xl">
        <h1 className="text-5xl">Reservations</h1>
        <form className="mt-8 space-y-4">
          <input
            className="w-full rounded border border-black/20 bg-white p-3"
            placeholder="Name"
          />
          <input
            className="w-full rounded border border-black/20 bg-white p-3"
            placeholder="Email"
            type="email"
          />
          <input className="w-full rounded border border-black/20 bg-white p-3" type="date" />
          <input className="w-full rounded border border-black/20 bg-white p-3" type="time" />
          <input
            className="w-full rounded border border-black/20 bg-white p-3"
            placeholder="Guests"
            type="number"
            min="1"
          />
          <Button type="submit" className="w-full">
            Book Now
          </Button>
        </form>
      </Container>
    </section>
  );
}
