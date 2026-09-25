import React, { useEffect, useRef, useState, type ReactNode } from 'react';

interface FloatingDockProps {
  children: ReactNode;
  floatClass?: string;
  showDockedRender?: boolean;
  positionCss?: string;
  staticLeftWidth?: any;
  dockedClass?: string;
  parentDockRef?: any;
  threshold?: any;
  position?: string;
}

const FloatingDock: React.FC<FloatingDockProps> = ({
  children,
  floatClass,
  showDockedRender = true,
  positionCss = 'bottom-4',
  staticLeftWidth = null,
  dockedClass = '',
  parentDockRef = null,
  threshold = 1,
  position = 'bottom',
}) => {
  const dockRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [style, setStyle] = useState<any>({ width: '100%', left: '0' });
  const [renderNow, setRenderNow] = useState<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        let value = !entry.isIntersecting;
        if (parentDockRef?.current && position === 'top') {
          let y = parentDockRef.current.getBoundingClientRect().y + 48;
          if (y > window.innerHeight) {
            value = false;
          }
        }
        setIsVisible(value);
      },
      {
        root: null,
        threshold: threshold,
      }
    );

    const current = parentDockRef?.current ?? dockRef.current;
    if (current) observer.observe(current);
    getDimension();

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  const getDimension = () => {
    if (staticLeftWidth?.left && staticLeftWidth?.width) {
      setStyle({ width: staticLeftWidth?.width, left: staticLeftWidth?.left });
      setRenderNow(true);
    } else if (dockRef?.current) {
      const current = dockRef.current;
      const curr = current.getBoundingClientRect();
      const leftDocked = curr?.left ? `${curr.left}px` : 0;
      const currWidth = curr?.width ? `${curr.width}px` : '100%';
      setStyle({ width: currWidth, left: leftDocked });
      setRenderNow(true);
    }
  };

  return (
    <>
      {isVisible && renderNow && (
        <div
          className={`pointer-events-none fixed right-0 z-40 flex justify-center transition-opacity duration-300 ${positionCss}`}
          style={style}
        >
          <div className={`pointer-events-auto ${floatClass ?? ''}`}>{children}</div>
        </div>
      )}
      <div
        ref={dockRef}
        className={`w-full ${!showDockedRender ? 'max-h-[.1px] opacity-0' : isVisible ? 'opacity-0' : ''} ${dockedClass ?? ''}`}
      >
        {children}
      </div>
    </>
  );
};

export default FloatingDock;
