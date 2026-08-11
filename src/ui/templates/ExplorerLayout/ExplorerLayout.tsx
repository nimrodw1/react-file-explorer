import { type ReactNode, useRef, useCallback } from 'react';
import classes from './ExplorerLayout.module.css';

export interface ExplorerLayoutProps {
  omnibar: ReactNode;
  tree: ReactNode;
  preview: ReactNode;
  navWidth: number;
  onNavWidthChange: (width: number) => void;
}

const MIN_NAV = 180;
const MAX_NAV = 520;

export function ExplorerLayout({
  omnibar,
  tree,
  preview,
  navWidth,
  onNavWidthChange,
}: ExplorerLayoutProps) {
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(navWidth);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      isDragging.current = true;
      startX.current = e.clientX;
      startWidth.current = navWidth;

      const onMouseMove = (ev: MouseEvent) => {
        if (!isDragging.current) return;
        const delta = ev.clientX - startX.current;
        const next = Math.min(MAX_NAV, Math.max(MIN_NAV, startWidth.current + delta));
        onNavWidthChange(next);
      };

      const onMouseUp = () => {
        isDragging.current = false;
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    },
    [navWidth, onNavWidthChange],
  );

  return (
    <div className={classes.shell}>
      <nav
        className={classes.nav}
        style={{ width: navWidth }}
        aria-label="File explorer navigation"
      >
        <div className={classes.navInner}>
          {omnibar}
          {tree}
        </div>
        <div
          className={classes.resizeHandle}
          onMouseDown={onMouseDown}
          role="separator"
          aria-label="Resize navigation panel"
          aria-orientation="vertical"
          tabIndex={0}
        />
      </nav>

      <main className={classes.main}>{preview}</main>
    </div>
  );
}
