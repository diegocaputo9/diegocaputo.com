// Official brand marks from the Simple Icons package (not hand-drawn), sized and
// colored like the Phosphor icons used elsewhere (currentColor).
import { siGooglescholar, siOrcid, siResearchgate, type SimpleIcon } from "simple-icons";

type Props = { size?: number; className?: string };

function make(icon: SimpleIcon) {
  function BrandIcon({ size = 20, className }: Props) {
    return (
      <svg aria-hidden viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className}>
        <path d={icon.path} />
      </svg>
    );
  }
  BrandIcon.displayName = icon.title;
  return BrandIcon;
}

export const OrcidIcon = make(siOrcid);
export const ScholarIcon = make(siGooglescholar);
export const ResearchGateIcon = make(siResearchgate);
