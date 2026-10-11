import { SiteShell } from "@/components/site/site-shell";
import { MoonCalculatorsPage } from "@/components/site/pages/moon-calculators";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata("/moon-calculator");

export default function Page() {
  return (
    <SiteShell>
      <MoonCalculatorsPage />
    </SiteShell>
  );
}
