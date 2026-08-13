import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
function Field({
  label,
  htmlFor,
  children,
  className
}) {
  return <div className={cn("space-y-2", className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>;
}
function Select({
  className,
  children,
  ...props
}) {
  return <select
    className={cn(
      "h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none",
      className
    )}
    {...props}
  >
      {children}
    </select>;
}
function FormSection({
  title,
  description,
  children
}) {
  return <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <h2 className="font-semibold">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>;
}
export {
  Field,
  FormSection,
  Select
};
