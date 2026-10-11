import { SiteShell } from "@/components/site/site-shell";
import { AboutPage } from "@/components/site/pages/about";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata("/about");

export default function Page() {
  return (
    <SiteShell>
      <AboutPage />
    </SiteShell>
  );
}
