import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: "urgent" | "high" | "medium" | "low";
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "urgent":
        return {
          label: "Urgent",
          className: "bg-civic-urgent text-white border-civic-urgent",
        };
      case "high":
        return {
          label: "High Priority",
          className: "bg-civic-high text-white border-civic-high",
        };
      case "medium":
        return {
          label: "Medium",
          className: "bg-civic-medium text-white border-civic-medium",
        };
      case "low":
        return {
          label: "Low Priority",
          className: "bg-civic-low text-white border-civic-low",
        };
      default:
        return {
          label: "Unknown",
          className: "bg-muted text-muted-foreground",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge 
      className={`${config.className} ${className} font-medium`}
      variant="outline"
    >
      {config.label}
    </Badge>
  );
};

export default StatusBadge;