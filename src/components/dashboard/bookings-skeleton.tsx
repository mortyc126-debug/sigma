import { Card } from "@/components/ui/card";

export function BookingsSkeleton() {
  return (
    <div className="space-y-4">
      <Card className="border-border/70 bg-card/60 px-4 py-4 sm:px-5">
        <div className="h-4 w-32 animate-pulse rounded bg-muted/50" />
        <div className="mt-2 h-3 w-full max-w-md animate-pulse rounded bg-muted/40" />
        <div className="mt-3 h-20 animate-pulse rounded-lg bg-muted/30" />
      </Card>
      <Card className="border-border/70 bg-card/60 px-4 py-4 sm:px-5">
        <div className="h-3 w-40 animate-pulse rounded bg-muted/50" />
        <div className="mt-3 space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-muted/30" />
          ))}
        </div>
      </Card>
      <Card className="border-border/70 bg-card/60 px-4 py-4 sm:px-5">
        <div className="h-3 w-24 animate-pulse rounded bg-muted/50" />
        <div className="mt-3 h-24 animate-pulse rounded-lg bg-muted/20" />
      </Card>
    </div>
  );
}
