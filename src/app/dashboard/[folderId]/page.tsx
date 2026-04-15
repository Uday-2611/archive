interface FolderPageProps {
	params: Promise<{
		folderId: string;
	}>;
}

export default async function FolderPage({ params }: FolderPageProps) {
	const { folderId } = await params;

	return (
		<main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-3 p-6">
			<h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">Folder {folderId}</h1>
			<p className="text-sm text-[var(--color-text-secondary)]">Folder detail page is under construction.</p>
		</main>
	);
}
