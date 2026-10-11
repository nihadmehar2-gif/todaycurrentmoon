import { SiteShell } from "@/components/site/site-shell";
import { ContactPage } from "@/components/site/pages/contact";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata("/contact");

export default function Page() {
  return (
    <SiteShell>
      <ContactPage />
    </SiteShell>
  );
}
