import { PageHeader } from "@/src/components/ui/PageHeader";
import { Gallery } from "@/src/components/gallery/Gallery";

export const metadata = {
  title: "Gallery | Ranchi Security",
  description: "Browse our photo gallery showcasing training centres, award ceremonies, VIP visits, and key milestones from over two decades of service.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Gallery" }]}
        title="Gallery"
        subtitle="A visual journey through our milestones, training centres, award ceremonies and distinguished visits."
      />
      <main className="flex-1">
        <Gallery />
      </main>
    </>
  );
}