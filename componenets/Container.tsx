interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ children, className = "" }: ContainerProps) {
  const baseClasses = "max-w-3xl mx-auto px-6 py-10";
  const combinedClasses = className ? `${baseClasses} ${className}` : baseClasses;

  return <div className={combinedClasses}>{children}</div>;
}