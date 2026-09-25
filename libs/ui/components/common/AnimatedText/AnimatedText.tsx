import * as React from 'react';

export type AnimatedTextVariant = 'linear' | 'backward';

export interface AnimatedTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  text: string;
  delayPerCharMs?: number;
  animationVariant?: AnimatedTextVariant;
}

const AnimatedText = React.forwardRef<HTMLParagraphElement, AnimatedTextProps>(
  ({ text, delayPerCharMs = 50, animationVariant = 'linear', className, ...props }, ref) => {
    const characters = React.useMemo(() => text.split(''), [text]);
    const totalChars = characters.length;

    return (
      <p ref={ref} className={className} {...props}>
        {characters.map((char, index) => {
          const delay =
            animationVariant === 'backward'
              ? (totalChars - index - 1) * delayPerCharMs
              : index * delayPerCharMs;

          return (
            <span
              key={`${char}-${index}`}
              className="exxat-animated-text-char inline-block"
              style={{
                animationDelay: `${delay}ms`,
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          );
        })}

        <style>{`
          @keyframes exxat-animated-text-fade {
            0%, 100% {
              opacity: 0.3;
            }
            50% {
              opacity: 1;
            }
          }

          .exxat-animated-text-char {
            animation: exxat-animated-text-fade 2s ease-in-out infinite;
          }
        `}</style>
      </p>
    );
  }
);

AnimatedText.displayName = 'AnimatedText';

export default React.memo(AnimatedText);
