import React from "react";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="container">{children}</div>;
}
