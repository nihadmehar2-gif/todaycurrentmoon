import { cn } from "@/lib/utils";

interface NativeAdProps {
  /** Extra className for the outer wrapper. */
  className?: string;
  /** Accessibility/visible label for the ad area. */
  label?: string;
}

/**
 * Native Banner ad (profitableratecpmnetwork.com).
 *
 * The ad runs inside an isolated <iframe> via srcDoc, so its external
 * `invoke.js` script and `container-...` div load in their own document.
 * This prevents global conflicts and duplicate script execution during
 * React re-renders or client-side navigation. The exact ad code
 * (script src + container div) is injected verbatim — URLs and keys are
 * not modified.
 *
 * The iframe is fluid (100% width, up to 728px) so the native unit is
 * responsive on mobile, tablet, and desktop with no horizontal overflow.
 */
export function NativeAd({
  className,
  label = "Advertisement",
}: NativeAdProps) {
  // The exact native banner code, injected unchanged into the iframe.
  const srcDoc = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0;background:transparent}body{width:100%;min-height:90px;display:flex;align-items:center;justify-content:center}#container-b93006b77aa4cc21e4a5fcd4463d5c7c{width:100%;max-width:728px;}</style></head><body><script async="async" data-cfasync="false" src="https://pl31769256.profitableratecpmnetwork.com/b93006b77aa4cc21e4a5fcd4463d5c7c/invoke.js"></script><div id="container-b93006b77aa4cc21e4a5fcd4463d5c7c"></div></body></html>`;

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center",
        className,
      )}
      role="complementary"
      aria-label={label}
    >
      <span className="mb-1 text-[10px] font-medium uppercase tracking-[0.15em] text-slate-400/60">
        {label}
      </span>
      <div className="w-full overflow-hidden" style={{ maxWidth: 728 }}>
        <iframe
          srcDoc={srcDoc}
          title={label}
          loading="lazy"
          style={{
            border: "none",
            display: "block",
            margin: "0 auto",
            width: "100%",
            height: "120px",
            maxWidth: "100%",
          }}
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-top-navigation-by-user-activation"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
