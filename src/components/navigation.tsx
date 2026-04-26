import { useEffect, useState } from "react";
import {
	FaBars,
	FaGithub,
	FaHouse,
	FaList,
	FaMagnifyingGlass,
} from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type NavLink = {
	name: string;
	href: string;
	icon: React.ReactNode;
	external?: boolean;
};

const links: NavLink[] = [
	{ name: "Home", href: "/", icon: <FaHouse /> },
	{ name: "Lists", href: "/lists/", icon: <FaList /> },
	{
		name: "GitHub",
		href: "https://github.com/KiraLT/cocktails-guru",
		icon: <FaGithub />,
		external: true,
	},
];

function isActive(href: string, pathname: string): boolean {
	if (href === "/") return pathname === "/";
	return pathname.startsWith(href);
}

export function Navigation() {
	const [pathname, setPathname] = useState("/");

	useEffect(() => {
		setPathname(window.location.pathname);
	}, []);

	return (
		<nav className="sticky top-0 z-40 border-b border-border/60 bg-background/60 backdrop-blur-xl">
			<div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-4 py-2.5 md:gap-4 md:px-6 md:py-3">
				<a href="/" className="shrink-0" aria-label="Cocktails Guru">
					<img
						className="h-7 w-7"
						src="/favicon.svg"
						width={28}
						height={28}
						alt="Cocktails Guru"
					/>
				</a>

				<div className="hidden items-center gap-1 lg:flex">
					{links.map((link) => {
						const active = isActive(link.href, pathname);
						return (
							<a
								key={link.href}
								className={cn(
									"relative flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-colors",
									active
										? "text-foreground"
										: "text-muted-foreground hover:text-foreground",
								)}
								href={link.href}
								rel={link.external ? "nofollow noopener" : undefined}
								target={link.external ? "_blank" : undefined}
							>
								<span className="text-[15px] opacity-80">{link.icon}</span>
								<span>{link.name}</span>
								{active && (
									<span
										aria-hidden="true"
										className="absolute inset-x-3 -bottom-2.5 h-px bg-foreground"
									/>
								)}
							</a>
						);
					})}
				</div>

				<div className="ml-auto w-full max-w-md flex-1 lg:flex-initial">
					<SearchBar />
				</div>

				<Sheet>
					<SheetTrigger asChild>
						<Button
							className="shrink-0 text-muted-foreground hover:text-foreground lg:hidden"
							variant="ghost"
							size="icon"
							aria-label="Open menu"
						>
							<FaBars className="h-5 w-5" />
						</Button>
					</SheetTrigger>
					<SheetContent side="right" className="w-72 p-0">
						<SheetHeader className="border-b border-border/60 px-4 py-4">
							<SheetTitle>Menu</SheetTitle>
						</SheetHeader>
						<div className="flex flex-col gap-1 p-3">
							{links.map((link) => (
								<SheetClose asChild key={link.href}>
									<a
										className={cn(
											"flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
											isActive(link.href, pathname)
												? "bg-accent text-foreground"
												: "text-muted-foreground hover:bg-accent hover:text-foreground",
										)}
										href={link.href}
										rel={link.external ? "nofollow noopener" : undefined}
										target={link.external ? "_blank" : undefined}
									>
										{link.icon}
										<span>{link.name}</span>
									</a>
								</SheetClose>
							))}
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</nav>
	);
}

function SearchBar() {
	const [defaultQuery, setDefaultQuery] = useState("");

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		setDefaultQuery(params.get("q") ?? "");
	}, []);

	return (
		<search className="block w-full">
			<form
				action="/search/"
				method="get"
				className="group relative flex items-center"
			>
				<FaMagnifyingGlass className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-muted-foreground transition-colors group-focus-within:text-foreground" />
				<input
					className="h-9 w-full rounded-lg border border-transparent bg-muted/40 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-border/60 focus:bg-card focus:ring-2 focus:ring-ring/20"
					type="search"
					name="q"
					defaultValue={defaultQuery}
					aria-label="Search recipes"
					placeholder="Search cocktails…"
				/>
			</form>
		</search>
	);
}
