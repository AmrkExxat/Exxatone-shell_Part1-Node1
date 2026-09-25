import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { twMerge } from 'tailwind-merge';

export interface StackedCardsProps<T> extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> {
  items?: T[];
  renderCard?: (item: T, index: number) => React.ReactNode;
  children?: React.ReactNode;
  activeIndex?: number;
  defaultIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  stackDepth?: number;
  stackOffset?: number;
  stackScaleStep?: number;
  asChild?: boolean;
  cardClassName?: string;
  cardTestIdPrefix?: string;
  testId?: string;
  ariaLabel?: string;
}

function clampIndex(value: number, max: number) {
  if (max <= 0) {
    return 0;
  }
  return Math.min(Math.max(value, 0), max);
}

export function StackedCards<T>({
  items,
  renderCard,
  children,
  activeIndex,
  defaultIndex = 0,
  onActiveIndexChange,
  stackDepth = 3,
  stackOffset = 12,
  stackScaleStep = 0.03,
  asChild = false,
  className,
  cardClassName,
  cardTestIdPrefix = 'stacked-card',
  testId = 'stacked-cards-root',
  ariaLabel = 'Stacked cards',
  ...props
}: StackedCardsProps<T>) {
  const cards = React.useMemo(() => {
    if (items && renderCard) {
      return items.map((item, index) => renderCard(item, index));
    }

    if (items && !renderCard) {
      console.warn('[StackedCards]: `items` provided without `renderCard`.');
      return [];
    }

    return React.Children.toArray(children);
  }, [items, renderCard, children]);

  const cardCount = cards.length;
  const isControlled = activeIndex !== undefined;
  const [uncontrolledIndex, setUncontrolledIndex] = React.useState(
    clampIndex(defaultIndex, Math.max(cardCount - 1, 0))
  );

  const currentIndex = isControlled ? activeIndex! : uncontrolledIndex;
  const safeIndex = clampIndex(currentIndex, Math.max(cardCount - 1, 0));
  const visibleDepth = Math.max(1, stackDepth);

  React.useEffect(() => {
    if (!isControlled && safeIndex !== uncontrolledIndex) {
      setUncontrolledIndex(safeIndex);
      onActiveIndexChange?.(safeIndex);
    }
  }, [isControlled, safeIndex, uncontrolledIndex, onActiveIndexChange]);

  const Comp = asChild ? Slot : 'div';

  const rootClasses = twMerge('relative inline-grid', className);

  const renderCards = () => {
    if (cardCount === 0) {
      return null;
    }

    const startIndex = safeIndex;
    const endIndex = Math.min(cardCount - 1, safeIndex + visibleDepth - 1);

    return cards.slice(startIndex, endIndex + 1).map((card, offset) => {
      const cardIndex = startIndex + offset;
      const isActive = cardIndex === safeIndex;
      const translateY = offset * stackOffset;
      const scale = Math.max(0, 1 - offset * stackScaleStep);
      const zIndex = visibleDepth - offset;

      const cardClasses = twMerge(
        'col-start-1 row-start-1',
        isActive ? 'pointer-events-auto' : 'pointer-events-none',
        cardClassName
      );

      return (
        <div
          key={`${cardIndex}-${cardTestIdPrefix}`}
          className={cardClasses}
          style={{ transform: `translateY(${translateY}px) scale(${scale})`, zIndex }}
          data-testid={`${cardTestIdPrefix}-${cardIndex}`}
          data-card-index={cardIndex}
          data-state={isActive ? 'active' : 'inactive'}
          aria-hidden={!isActive}
          inert={!isActive}
        >
          {card}
        </div>
      );
    });
  };

  return (
    <Comp
      className={rootClasses}
      data-testid={testId}
      aria-label={ariaLabel}
      role="group"
      {...props}
    >
      <VisuallyHidden aria-live="polite">
        {cardCount > 0 ? `Card ${safeIndex + 1} of ${cardCount}` : 'No cards available'}
      </VisuallyHidden>
      {renderCards()}
    </Comp>
  );
}

export default StackedCards;
