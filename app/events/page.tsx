import { PageHeader } from "@/src/components/ui/PageHeader";
import { Events } from "@/src/components/events/Events";

export const metadata = {
  title: "Events & Training | Ranchi Security",
  description: "View our latest events, training programmes, placement drives, and industry visits. Stay updated with Ranchi Security activities.",
};

export default function EventsPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Events" }]}
        title="Events & Training"
        subtitle="Training programmes, placement drives, industry visits and leadership summits — building the next generation of security professionals."
      />
      <main className="flex-1">
        <Events />
      </main>
    </>
  );
}