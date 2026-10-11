import { SiteShell } from "@/components/site/site-shell";
import { MoonCalendarPage } from "@/components/site/pages/moon-calendar";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata("/moon-calendar");

export default function Page() {
  return (
    <SiteShell>
      <MoonCalendarPage />
    </SiteShell>
  );
}
