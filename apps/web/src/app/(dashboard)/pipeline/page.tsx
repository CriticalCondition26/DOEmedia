import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PipelinePage() {
  const columns = [
    { title: "Queued", count: 0, color: "bg-muted" },
    { title: "In Progress", count: 0, color: "bg-primary/20" },
    { title: "Review", count: 0, color: "bg-warning/20" },
    { title: "Approved", count: 0, color: "bg-success/20" },
    { title: "Live", count: 0, color: "bg-success/40" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Creative Pipeline</h1>
        <p className="text-muted-foreground">
          Track creative production across all pods and clients
        </p>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-5 gap-4">
        {columns.map((column) => (
          <div key={column.title}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">{column.title}</h3>
              <span className="text-xs text-muted-foreground">{column.count}</span>
            </div>
            <div className={`min-h-[60vh] rounded-lg border border-border/50 ${column.color} p-3`}>
              <p className="text-center text-xs text-muted-foreground">
                No items yet
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
