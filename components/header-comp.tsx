interface PageHeaderProps {
  children: React.ReactNode;
  description: string;
}

export const PageHeader = ({ children, description }: PageHeaderProps) => {
  return (
    <div className="mx-auto text-center">
      <h1 className="font-extrabold text-4xl tracking-tight sm:text-5xl">
        {children}
      </h1>
      <p className="pt-2 text-muted-foreground text-xl">{description}</p>
    </div>
  );
};
