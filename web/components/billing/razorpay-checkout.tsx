"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { billing } from "@/lib/api/billing";
import { pricing } from "@/lib/pricing";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function RazorpayCheckout() {
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setIsRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Get subscription status
  const { data: subscriptionStatus, isLoading: statusLoading } = useQuery({
    queryKey: ["subscriptionStatus"],
    queryFn: () => billing.getSubscriptionStatus(),
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: () =>
      billing.createOrder({}),
    onSuccess: (data) => {
      if (isRazorpayLoaded) {
        handleRazorpayPayment(data);
      }
    },
  });

  // Verify payment mutation
  const verifyPaymentMutation = useMutation({
    mutationFn: (paymentData: any) =>
      billing.verifyPayment({
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_signature: paymentData.razorpay_signature,
      }),
    onSuccess: () => {
      window.location.href = "/dashboard/billing?status=success";
    },
  });

  const handleRazorpayPayment = (orderData: any) => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency,
      order_id: orderData.order_id,
      name: "SkyMail",
      description: "Premium Subscription",
      prefill: {
        name: subscriptionStatus?.company_name || "",
        email: subscriptionStatus?.email || "",
      },
      handler: (response: any) => {
        verifyPaymentMutation.mutate(response);
      },
      theme: {
        color: "#2A8C9D",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handleUpgradeClick = () => {
    if (!isRazorpayLoaded) {
      alert("Payment system is loading. Please try again.");
      return;
    }
    createOrderMutation.mutate();
  };

  if (statusLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin text-teal-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Plan Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Current Plan</h3>

        {subscriptionStatus?.is_premium ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">Plan Type</span>
              <span className="font-medium text-teal-600">Premium Monthly</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">Status</span>
              <span className="font-medium text-green-600">Active</span>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-gray-100 pt-3">
              <span className="text-gray-600">Next Billing</span>
              <span className="font-medium">
                {subscriptionStatus.subscription_end_date
                  ? new Date(subscriptionStatus.subscription_end_date).toLocaleDateString(
                      "en-IN"
                    )
                  : "—"}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600">Plan Type</span>
              <span className="font-medium text-gray-900">Free</span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Upgrade to Premium and unlock unlimited campaigns, advanced
              analytics, and priority support.
            </p>

            {/* Premium Features */}
            <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-gray-900 mb-3">
                Premium Features
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <span className="text-teal-600 mr-2">✓</span>
                  Unlimited email campaigns
                </li>
                <li className="flex items-center">
                  <span className="text-teal-600 mr-2">✓</span>
                  Advanced analytics & reporting
                </li>
                <li className="flex items-center">
                  <span className="text-teal-600 mr-2">✓</span>
                  Priority email support
                </li>
                <li className="flex items-center">
                  <span className="text-teal-600 mr-2">✓</span>
                  Custom domain support
                </li>
                <li className="flex items-center">
                  <span className="text-teal-600 mr-2">✓</span>
                  API access
                </li>
              </ul>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-bold text-gray-900">
                {pricing.getPremiumDisplayPrice()}
              </span>
              <span className="text-gray-600">/month</span>
            </div>

            {/* Upgrade Button */}
            <button
              onClick={handleUpgradeClick}
              disabled={
                createOrderMutation.isPending ||
                verifyPaymentMutation.isPending ||
                !isRazorpayLoaded
              }
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {(createOrderMutation.isPending ||
                verifyPaymentMutation.isPending) && (
                <Loader2 className="animate-spin" size={18} />
              )}
              {createOrderMutation.isPending
                ? "Processing..."
                : "Upgrade to Premium"}
            </button>

            {createOrderMutation.isError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                Failed to initiate payment. Please try again.
              </div>
            )}

            {verifyPaymentMutation.isError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                Payment verification failed. Please try again.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Payment Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Your upgrade will be processed securely through
          Razorpay. You can cancel your subscription anytime.
        </p>
      </div>
    </div>
  );
}
