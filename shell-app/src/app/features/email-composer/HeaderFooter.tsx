import { ChevronDown, Plus, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { IconButton } from '../../components/ui/icon-button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { cn } from '../../components/ui/utils';
import exxatLogo from '../../../assets/bulk-email/exxat-logo.png';
import { CheckItem } from './CheckItem';
import type { ComposerBrand } from './types';

export type HeaderKind = 'none' | 'logo' | 'profile';
export type FooterKind = 'none' | 'logo' | 'exxat';

export const HEADER_OPTIONS: { value: HeaderKind; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'logo', label: 'Site logo' },
  { value: 'profile', label: 'Share Profile and Site logo' },
];
export const FOOTER_OPTIONS: { value: FooterKind; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'logo', label: 'Site logo' },
  { value: 'exxat', label: 'Exxat logo' },
];

function Crest({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={cn('size-7 shrink-0', className)}>
      <rect width="32" height="32" rx="8" className="fill-primary" />
      <path d="M12 6h8v6h6v8h-6v6h-8v-6H6v-8h6z" fill="#fff" />
    </svg>
  );
}

function SiteLogo({ brand }: { brand: ComposerBrand }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Crest />
      <span className="leading-tight">
        <b className="block text-sm text-foreground">{brand.name}</b>
        <span className="text-xs text-muted-foreground">{brand.unit}</span>
      </span>
    </span>
  );
}

/** Rendered the same way in the editor and in the preview. */
export function HeaderBlock({ kind, brand }: { kind: HeaderKind; brand: ComposerBrand }) {
  if (kind === 'none') return null;
  return (
    <div className="flex items-center justify-between gap-3">
      <SiteLogo brand={brand} />
      {kind === 'profile' && (
        <span className="rounded-md border px-2.5 py-0.5 text-xs font-medium text-foreground">Share profile</span>
      )}
    </div>
  );
}

export function FooterBlock({ kind, brand }: { kind: FooterKind; brand: ComposerBrand }) {
  if (kind === 'none') return null;
  if (kind === 'exxat')
    return <img src={exxatLogo} alt="Exxat logo" className="h-10 w-auto" />;
  return (
    <div className="flex items-start gap-2.5">
      <Crest />
      <p className="text-xs leading-5 text-muted-foreground">
        <b className="text-foreground">{brand.name}</b> · {brand.unit}
        <br />
        {brand.address}
        <br />
        {brand.contact}
      </p>
    </div>
  );
}

interface PickerProps<K extends string> {
  noun: 'header' | 'footer';
  value: K;
  options: { value: K; label: string }[];
  onChange: (v: K) => void;
  /** Where the block sits inside the content box; decides which edge carries the separator. */
  position: 'top' | 'bottom';
  children: React.ReactNode;
}

/**
 * Header / footer option inside the message's content box. Empty, it is a quiet "Add header"
 * row. Once chosen it is just the content with a separator line, like the rows above the
 * message; Change and Remove appear on hover or keyboard focus.
 */
export function HeaderFooterPicker<K extends string>({ noun, value, options, onChange, position, children }: PickerProps<K>) {
  const Title = noun === 'header' ? 'Header' : 'Footer';
  const border = position === 'top' ? 'border-b' : 'border-t';
  const side = position === 'top' ? 'bottom' : 'top';
  const menu = (trigger: React.ReactNode, align: 'start' | 'end') => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align={align} side={side} className="w-60">
        <DropdownMenuLabel>{Title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((o) => (
          <CheckItem key={o.value} selected={value === o.value} onSelect={() => onChange(o.value)}>
            {o.label}
          </CheckItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (value === 'none')
    return (
      <div className={cn('flex px-1.5 py-1', border)}>
        {menu(
          <Button type="button" variant="ghost" size="sm" className="h-7 text-muted-foreground">
            <Plus /> Add {noun}
          </Button>,
          'start',
        )}
      </div>
    );

  return (
    <div className={cn('group/hf relative px-3 py-3', border)}>
      {children}
      <div className="absolute right-1.5 top-1.5 flex gap-0.5 opacity-100 transition-opacity md:opacity-0 md:group-focus-within/hf:opacity-100 md:group-hover/hf:opacity-100">
        {menu(
          <IconButton label={`Change ${noun}`} className="size-7 text-muted-foreground hover:text-foreground">
            <ChevronDown />
          </IconButton>,
          'end',
        )}
        <IconButton label={`Remove ${noun}`} className="size-7 text-muted-foreground hover:text-foreground" onClick={() => onChange('none' as K)}>
          <X />
        </IconButton>
      </div>
    </div>
  );
}
