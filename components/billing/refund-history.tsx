"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Receipt } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface RefundHistoryProps {
  customerId: string;
}

interface RefundRecord {
  id: string;
  refund_status: string;
  refund_type: string;
  refund_amount: number | null;
  refund_currency: string;
  refund_reason: string | null;
  created_at: string;
  period_start: string | null;
  period_end: string | null;
  refunded_period_days: number | null;
}

export function RefundHistory({ customerId }: RefundHistoryProps) {
  const { toast } = useToast();
  const [refunds, setRefunds] = useState<RefundRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRefunds();
  }, [customerId]);

  const fetchRefunds = async () => {
    if (!customerId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      // API automatically uses current user's customer ID, but we can pass customer_id for clarity
      const response = await fetch(`/api/subscriptions/refund?customer_id=${customerId}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch refunds");
      }

      const data = await response.json();
      setRefunds(data.refunds || []);
    } catch (err) {
      console.error("Error fetching refunds:", err);
      toast({
        title: "Error",
        description:
          err instanceof Error
            ? err.message
            : "Failed to load refund history.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      completed: "default",
      processing: "secondary",
      pending: "outline",
      failed: "destructive",
      canceled: "outline",
    };

    return (
      <Badge variant={variants[status] || "outline"} className="capitalize">
        {status}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Refund History</CardTitle>
            <CardDescription>View your subscription refund requests and status.</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchRefunds}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading refund history...</div>
        ) : refunds.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No refund history found.</p>
            <p className="text-sm mt-2">
              Refunds will appear here once they are processed.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {refunds.map((refund) => (
              <div
                key={refund.id}
                className="flex items-start justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium capitalize">{refund.refund_type} Refund</span>
                    {getStatusBadge(refund.refund_status)}
                  </div>
                  {refund.refund_amount && (
                    <p className="text-sm text-muted-foreground">
                      Amount: {refund.refund_currency} {refund.refund_amount.toFixed(2)}
                    </p>
                  )}
                  {refund.refund_reason && (
                    <p className="text-sm text-muted-foreground">
                      Reason: {refund.refund_reason}
                    </p>
                  )}
                  {refund.refunded_period_days && (
                    <p className="text-sm text-muted-foreground">
                      Refunded period: {refund.refunded_period_days} days
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Requested: {format(new Date(refund.created_at), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
