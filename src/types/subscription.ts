
export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
  maxUsers: number;
  maxVehicles: number;
  isPopular?: boolean;
}

export interface Subscription {
  id: string;
  companyId: string;
  planId: string;
  plan?: Plan;
  status: 'active' | 'inactive' | 'cancelled' | 'past_due';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionContextType {
  subscription: Subscription | null;
  plans: Plan[];
  isLoading: boolean;
  subscribeToPlan: (planId: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  updateSubscription: (planId: string) => Promise<void>;
}
