import { SiteShell } from "@/components/site/site-shell";
import { MoonPhasesPage } from "@/components/site/pages/moon-phases";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata("/moon-phases");

export default function Page() {
  return (
    <SiteShell>
      <MoonPhasesPage />
    </SiteShell>
  );
}
