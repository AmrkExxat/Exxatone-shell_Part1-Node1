import * as React from "react";

import { Button } from "./button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

type IconButtonProps = Omit<React.ComponentProps<typeof Button>, "aria-label"> & {
  /** Accessible name and tooltip text. Icon-only buttons always need one. */
  label: string;
  tooltipSide?: "top" | "right" | "bottom" | "left";
};

/**
 * Icon-only button: always carries an accessible name and shows it as a tooltip on hover and on
 * keyboard focus. Use instead of a bare <Button size="icon">.
 */
const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, tooltipSide = "bottom", variant = "ghost", size = "icon", ...props }, ref) => (
    <Tooltip>
      <TooltipTrigger
        asChild
        onFocus={(event) => {
          // Sheet open moves focus here without a hover. Only a keyboard focus should reveal the tip.
          if (event.currentTarget instanceof Element && !event.currentTarget.matches(":focus-visible")) {
            event.preventDefault();
          }
        }}
      >
        <Button ref={ref} type="button" variant={variant} size={size} aria-label={label} {...props} />
      </TooltipTrigger>
      <TooltipContent side={tooltipSide}>{label}</TooltipContent>
    </Tooltip>
  ),
);
IconButton.displayName = "IconButton";

export { IconButton };
