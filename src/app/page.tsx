import { SiteShell } from "@/components/site/site-shell";
import { HomePage } from "@/components/site/pages/home";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata("/");

export default function Page() {
  return (
    <SiteShell>
      <HomePage />
    </SiteShell>
  );
}
