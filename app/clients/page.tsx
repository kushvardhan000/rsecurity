import { PageHeader } from "@/src/components/ui/PageHeader";
import { Clients } from "@/src/components/Clients";

export const metadata = {
  title: "Clients | Ranchi Security",
  description: "Trusted by industry giants across mining, steel, power, education and infrastructure sectors. View our client portfolio.",
};

export default function ClientsPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Clients" }]}
        title="Our Clients"
        subtitle="Trusted by leaders across mining, steel, power, education and infrastructure sectors."
      />
      <main className="flex-1">
        <Clients />
      </main>
    </>
  );
}