"use client";

import {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../button";

type AlertDialogContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const AlertDialogContext = createContext<AlertDialogContextValue>({
  open: false,
  setOpen: () => {},
});

function AlertDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <AlertDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </AlertDialogContext.Provider>
  );
}

function AlertDialogTrigger({
  children,
  asChild,
}: {
  children: React.ReactElement;
  asChild?: boolean;
}) {
  const { setOpen } = useContext(AlertDialogContext);
  if (asChild) {
    return cloneElement(
      children as React.ReactElement<{ onClick?: () => void }>,
      { onClick: () => setOpen(true) },
    );
  }
  return (
    <button type="button" onClick={() => setOpen(true)}>
      {children}
    </button>
  );
}

function AlertDialogContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { open, setOpen } = useContext(AlertDialogContext);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setVisible(true)),
      );
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!mounted) return null;
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-200",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <div
        role="alertdialog"
        aria-modal
        className={cn(
          "relative z-50 w-full max-w-md rounded-(--radius) bg-background p-6 shadow-lg transition-all duration-200",
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

function AlertDialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-4 flex flex-col gap-2">{children}</div>;
}

function AlertDialogTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-md font-semibold">{children}</h2>;
}

function AlertDialogDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

function AlertDialogFooter({ children }: { children: React.ReactNode }) {
  return <div className="mt-6 flex justify-end gap-2">{children}</div>;
}

function AlertDialogCancel({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const { setOpen } = useContext(AlertDialogContext);
  return (
    <button
      type="button"
      className={buttonVariants({ variant: "outline", size: "md" })}
      onClick={() => {
        onClick?.();
        setOpen(false);
      }}
    >
      {children}
    </button>
  );
}

function AlertDialogAction({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const { setOpen } = useContext(AlertDialogContext);
  return (
    <button
      type="button"
      className={cn(
        buttonVariants({ variant: "destructive", size: "md" }),
        className,
      )}
      onClick={() => {
        onClick?.();
        setOpen(false);
      }}
    >
      {children}
    </button>
  );
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
};
