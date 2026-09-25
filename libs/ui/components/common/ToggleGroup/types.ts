export type OptionArray = {
  id: string;
  label: string;
  value: string | number;
  disabled?: boolean;
};

export type CustomStyles = {
  selectedBg?: string;
  selectedColor?: string;
  defaultBg?: string;
  defaultColor?: string;
  hoverBg?: string;
  hoverColor?: string;
  borderRadius?: string;
};

export type ToggleGroupButtonProps = {
  id: string;
  options: OptionArray[];
  initialSelected: string | number | null;
  onChange: (event: React.MouseEvent<HTMLElement>, newValue: string | number | null) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  customStyles?: CustomStyles;
};
