import React from 'react';
import { cn } from '@/lib/utils';

interface HoverButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const HoverButton = React.forwardRef<HTMLButtonElement, HoverButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group relative overflow-hidden rounded-full border border-current px-6 py-2 transition-colors duration-300 hover:bg-primary hover:text-primary-foreground hover:border-primary",
          className
        )}
        {...props}
      >
        <div className="relative overflow-hidden h-5 flex items-center justify-center">
          <span className="block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
            {children}
          </span>
          <span className="absolute top-full block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
            {children}
          </span>
        </div>
      </button>
    );
  }
);
HoverButton.displayName = 'HoverButton';
