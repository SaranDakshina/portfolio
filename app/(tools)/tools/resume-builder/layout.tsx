import "@/styles/resume-builder.scss";

export default function ResumeBuilderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="builder-root" data-lenis-prevent>{children}</div>;
}
