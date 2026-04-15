interface DashboardLayoutProps {
	children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
	return <section className="flex min-h-full flex-1 flex-col">{children}</section>;
}
