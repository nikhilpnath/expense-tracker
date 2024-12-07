import { Link } from "@remix-run/react";
import { IconType } from "react-icons";

interface PricingPlan {
  title: string;
  price: string;
  perks: string[];
  icon: IconType; 
}

function PricingPlan({ title, price, perks, icon: Icon }: PricingPlan) {
  return (
    <article>
      <header>
        <div className="icon">
          <Icon />
        </div>
        <h2>{title}</h2>
        <p>{price}</p>
      </header>
      <div className="plan-content">
        <ol>
          {perks.map((perk) => (
            <li key={perk}>{perk}</li>
          ))}
        </ol>
        <div className="actions">
          <Link to="/">Learn More</Link>
        </div>
      </div>
    </article>
  );
}

export default PricingPlan;
