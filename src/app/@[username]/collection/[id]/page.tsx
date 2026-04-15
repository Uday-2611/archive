interface UserCollectionPageProps {
	params: Promise<{
		username: string;
		id: string;
	}>;
}

export default async function UserCollectionPage({ params }: UserCollectionPageProps) {
	const { username, id } = await params;

	return (
		<main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 p-6">
			<h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">Collection {id}</h1>
			<p className="text-sm text-[var(--color-text-secondary)]">Public collection page for @{username} is under construction.</p>
		</main>
	);
}
