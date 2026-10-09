import { PageHeader } from "@/src/components/ui/PageHeader";
import { Awards } from "@/src/components/awards/Awards";

export const metadata = {
  title: "Awards & Recognition | Ranchi Security",
  description: "View our awards and recognitions from CAPSI, MEPSC, Skill India, and government bodies for excellence in security training and deployment.",
};

export default function AwardsPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Awards" }]}
        title="Awards & Recognition"
        subtitle="Recognised for excellence in security skills, training, leadership and deployment by national industry bodies."
      />
      <main className="flex-1">
        <Awards />
      </main>
    </>
  );
}