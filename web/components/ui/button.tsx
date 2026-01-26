import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A8E9E] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#2A8E9E] text-white hover:bg-[#1D7A89] dark:bg-[#2A8E9E] dark:hover:bg-[#1D7A89]",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 dark:bg-red-900 dark:hover:bg-red-800",
        outline:
          "border border-[#2A8E9E] bg-white hover:bg-[#E9F3F4] dark:border-[#2A8E9E] dark:bg-[#1D1E20] dark:hover:bg-[#2A8E9E]/10",
        secondary:
          "bg-[#E9F3F4] text-[#180D39] hover:bg-[#D4E8EC] dark:bg-[#2A8E9E]/20 dark:text-[#2A8E9E] dark:hover:bg-[#2A8E9E]/30",
        ghost:
          "hover:bg-[#E9F3F4] dark:hover:bg-[#2A8E9E]/20 text-[#180D39] dark:text-gray-50",
        link: "text-[#2A8E9E] underline-offset-4 hover:underline dark:text-[#2A8E9E]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        className: cn(
          buttonVariants({ variant, size }),
          (children.props as any)?.className
        ),
        ref,
      });
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
