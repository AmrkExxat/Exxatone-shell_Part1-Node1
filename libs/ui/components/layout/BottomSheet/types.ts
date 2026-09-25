export type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  zIndex?: string;
  ariaLabelledBy?: string;
};
