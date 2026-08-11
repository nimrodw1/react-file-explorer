import { type ReactNode } from 'react';
import classes from './ExplorerLayout.module.css';

export interface ExplorerLayoutProps {
  omnibar: ReactNode;
  tree: ReactNode;
  preview: ReactNode;
}

export function ExplorerLayout({ omnibar, tree, preview }: ExplorerLayoutProps) {
  return (
    <div className={classes.shell}>
      <nav className={classes.nav} aria-label="File explorer navigation">
        <div className={classes.navInner}>
          {omnibar}
          {tree}
        </div>
      </nav>

      <main className={classes.main}>{preview}</main>
    </div>
  );
}
