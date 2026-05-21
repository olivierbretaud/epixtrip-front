import { cva, type VariantProps } from "class-variance-authority";
import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

const spinnerVariants = cva("animate-spin", {
  variants: {
    size: {
      sm: "size-3",
      md: "size-4",
      lg: "size-12",
    },
    color: {
      primary: "text-primary",
      secondary: "text-secondary-foreground",
      muted: "text-muted-foreground",
      white: "text-white",
    },
  },
  defaultVariants: {
    size: "lg",
    color: "primary",
  },
});

type SpinnerProps = React.ComponentProps<"svg"> &
  VariantProps<typeof spinnerVariants>;

function Spinner({ className, size, color, ...props }: SpinnerProps) {
  return (
    <Loader2Icon
      aria-label="Loading"
      aria-live="polite"
      className={cn(spinnerVariants({ size, color }), className)}
      {...props}
    />
  );
}

export { Spinner, spinnerVariants };
export type { SpinnerProps };
