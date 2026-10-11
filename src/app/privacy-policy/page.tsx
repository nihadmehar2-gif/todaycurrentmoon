import { SiteShell } from "@/components/site/site-shell";
import { PrivacyPage } from "@/components/site/pages/privacy";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata("/privacy-policy");

export default function Page() {
  return (
    <SiteShell>
      <PrivacyPage />
    </SiteShell>
  );
}
