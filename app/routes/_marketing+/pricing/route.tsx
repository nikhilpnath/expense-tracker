import { HeadersFunction } from "@remix-run/node";
import { MetaFunction } from "@remix-run/react";
import { FaTrophy, FaHandshake } from "react-icons/fa";
import PricingPlan from "~/compoents/marketing/PricingPlan";

const PRICING_PLANS = [
  {
    id: "p1",
    title: "Basic",
    price: "Free forever",
    perks: ["1 User", "Up to 100 expenses/year", "Basic analytics"],
    icon: FaHandshake,
  },
  {
    id: "p2",
    title: "Pro",
    price: "$9.99/month",
    perks: ["Unlimited Users", "Unlimited expenses/year", "Detailed analytics"],
    icon: FaTrophy,
  },
];

export default function PricingPage() {
  return (
    <main id="pricing">
      <h2>Great Product, Simple Pricing</h2>
      <ol id="pricing-plans">
        {PRICING_PLANS.map((plan) => (
          <li key={plan.id} className="plan">
            <PricingPlan
              title={plan.title}
              price={plan.price}
              perks={plan.perks}
              icon={plan.icon}
            />
          </li>
        ))}
      </ol>
    </main>
  );
}

export const meta: MetaFunction = () => {
  return [
    {
      title: "Pricing Plans",
    },
    {
      name: "description",
      content:
        "Pricing Plans for Tracking your expenses effectively and efficiently",
    },
  ];
};

export const headers: HeadersFunction = ({ parentHeaders }) => ({
  "Cache-Control": parentHeaders.get("Cache-Control") as string,
});

export const handle = {
  disableJS: true,
};
