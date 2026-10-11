import { SiteShell } from "@/components/site/site-shell";
import { TermsPage } from "@/components/site/pages/terms";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata("/terms");

export default function Page() {
  return (
    <SiteShell>
      <TermsPage />
    </SiteShell>
  );
}
