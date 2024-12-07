//in normal we have to create marketing.tsx (it will be our layout - pathless)
// where our _index will be _marketing._index.tsx
// and pricing will be _marketing.pricing.tsx

import { HeadersFunction, LinksFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import marketingStyles from "~/styles/marketing.css?url";

export default function MarketingLayout() {
  return (
    <>
      <Outlet />;
    </>
  );
}

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: marketingStyles,
  },
];

//unlike meta, loader or others where we declare it on the parent(layout) and can be accessed from child
//but in case of header,it's not like that - we have to call parentHeader in our child ones
export const headers: HeadersFunction = () => ({
  "Cache-Control": "max-age=600"
  // 10 minutes
  // in production a new request is sent to get the updates after 10
});
