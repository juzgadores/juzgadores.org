interface PageSectionProps {
  heading: React.ReactNode;
  description: React.ReactNode;
  children?: React.ReactNode;
}

export function PageSection({
  heading,
  description,
  children,
}: Readonly<PageSectionProps>) {
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">{heading}</h1>
      <p className="mb-4 max-w-prose text-muted-foreground">{description}</p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
