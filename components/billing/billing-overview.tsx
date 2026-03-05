"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";

interface BillingOverviewProps {
  customer: any;
  subscription: any;
}

export function BillingOverview({ customer, subscription }: BillingOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold capitalize">
            {subscription?.status === "active" ? "Active" : "Free"}
          </div>
          <p className="text-xs text-muted-foreground">
            {subscription?.current_period_end
              ? `Renews ${format(new Date(subscription.current_period_end), "MMM d, yyyy")}`
              : "No active subscription"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Credits Balance</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{customer?.credits || 0}</div>
          <p className="text-xs text-muted-foreground">
            {customer?.free_credits || 0} free, {customer?.paid_credits || 0} paid
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Member Since</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {customer?.created_at
              ? format(new Date(customer.created_at), "MMM yyyy")
              : "—"}
          </div>
          <p className="text-xs text-muted-foreground">
            {customer?.created_at
              ? format(new Date(customer.created_at), "MMMM d, yyyy")
              : ""}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
