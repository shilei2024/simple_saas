"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Settings, X, RefreshCw, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

interface SubscriptionManagementProps {
  subscription: {
    id: string;
    status: string;
    current_period_start: string;
    current_period_end: string;
    canceled_at: string | null;
    creem_subscription_id: string;
  };
  customerId: string;
}

export function SubscriptionManagement({
  subscription,
  customerId,
}: SubscriptionManagementProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isRefunding, setIsRefunding] = useState(false);

  const handleManageSubscription = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/creem/customer-portal");
      if (!response.ok) throw new Error("Failed to get portal link");

      const { customer_portal_link } = await response.json();
      window.open(customer_portal_link, "_blank");
    } catch (err) {
      console.error("Error getting portal link:", err);
      toast({
        title: "Error",
        description: "Failed to access subscription portal. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestRefund = async () => {
    try {
      setIsRefunding(true);
      const response = await fetch("/api/subscriptions/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription_id: subscription.id,
          reason: "Customer requested refund",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to request refund");
      }

      toast({
        title: "Refund Request Submitted",
        description: data.message || "Your refund request has been received.",
      });
    } catch (err) {
      console.error("Error requesting refund:", err);
      toast({
        title: "Error",
        description:
          err instanceof Error
            ? err.message
            : "Failed to submit refund request. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsRefunding(false);
    }
  };

  const isCanceled = subscription.status === "canceled" || subscription.canceled_at !== null;
  const isActive = subscription.status === "active";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Management</CardTitle>
        <CardDescription>
          Manage your subscription, payment methods, and billing settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Subscription Details */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Status</span>
            <span className="text-sm font-medium capitalize">{subscription.status}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Current Period</span>
            <span className="text-sm font-medium">
              {format(new Date(subscription.current_period_start), "MMM d")} -{" "}
              {format(new Date(subscription.current_period_end), "MMM d, yyyy")}
            </span>
          </div>
          {isCanceled && subscription.canceled_at && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Canceled On</span>
              <span className="text-sm font-medium">
                {format(new Date(subscription.canceled_at), "MMM d, yyyy")}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4">
          <Button
            onClick={handleManageSubscription}
            disabled={isLoading}
            variant="default"
            className="flex-1"
          >
            <Settings className="h-4 w-4 mr-2" />
            {isLoading ? "Loading..." : "Manage Subscription"}
          </Button>

          {isActive && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="flex-1">
                  <X className="h-4 w-4 mr-2" />
                  Cancel Subscription
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Your subscription will remain active until{" "}
                    {format(new Date(subscription.current_period_end), "MMMM d, yyyy")}. After
                    that, you&apos;ll lose access to subscription benefits. You can reactivate
                    anytime before the end date.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                  <AlertDialogAction onClick={handleManageSubscription}>
                    Continue to Cancel
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {isCanceled && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="flex-1" disabled={isRefunding}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {isRefunding ? "Processing..." : "Request Refund"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Request Refund</AlertDialogTitle>
                  <AlertDialogDescription>
                    You can request a refund for your canceled subscription. Refunds are typically
                    processed within 5-10 business days. The refund amount will be calculated
                    based on the unused portion of your subscription period.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleRequestRefund} disabled={isRefunding}>
                    {isRefunding ? "Processing..." : "Request Refund"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {isCanceled && (
          <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <p className="font-medium">Subscription Canceled</p>
              <p className="mt-1">
                Your subscription will remain active until{" "}
                {format(new Date(subscription.current_period_end), "MMMM d, yyyy")}. After that,
                you can still use any remaining credits.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
