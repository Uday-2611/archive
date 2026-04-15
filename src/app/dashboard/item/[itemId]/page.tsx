interface DashboardItemPageProps {
	params: Promise<{
		itemId: string;
	}>;
}

export default async function DashboardItemPage({ params }: DashboardItemPageProps) {
	const { itemId } = await params;

	return (
		<main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-3 p-6">
			<h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">Item {itemId}</h1>
			<p className="text-sm text-[var(--color-text-secondary)]">Item detail page is under construction.</p>
		</main>
	);
}
