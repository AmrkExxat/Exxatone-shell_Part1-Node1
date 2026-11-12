import { sc } from './siteConfigurationTokens';

type Props = {
  title: string;
};

export function SiteConfigurationSectionPlaceholder({ title }: Props) {
  return (
    <div className="pb-1 pt-1">
      <div className={sc.infoCard}>
        <div className={sc.cardHeader}>
          <h1 className={sc.cardTitle}>{title}</h1>
        </div>
        <div className={sc.cardBody}>
          <p className={sc.placeholderBody}>
            This configuration area is not built yet in the shell prototype. Navigation and layout
            match production so we can add forms and workflows incrementally.
          </p>
        </div>
      </div>
    </div>
  );
}
