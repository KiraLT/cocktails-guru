import { DiscussionEmbed } from "disqus-react";
import { useEffect, useState } from "react";

export function Comments({
	name,
	className,
}: {
	name: string;
	className?: string;
}) {
	const [url, setUrl] = useState("");

	useEffect(() => {
		setUrl(window.location.href);
	}, []);

	const disqusName = import.meta.env.PUBLIC_DISQUS_NAME;

	if (!url || !disqusName) {
		return null;
	}

	return (
		<section className={className}>
			<h2 className="mb-4 font-serif text-lg font-semibold">Comments</h2>
			<div
				className="rounded-md bg-background"
				style={{ colorScheme: "light" }}
			>
				<DiscussionEmbed
					shortname={disqusName}
					config={{ url, identifier: name, title: name }}
				/>
			</div>
		</section>
	);
}
