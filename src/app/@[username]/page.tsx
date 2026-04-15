interface UserProfilePageProps {
	params: Promise<{
		username: string;
	}>;
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
	const { username } = await params;

	return (
		<main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 p-6">
			<h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">@{username}</h1>
			<p className="text-sm text-[var(--color-text-secondary)]">User profile page is under construction.</p>
		</main>
	);
}
