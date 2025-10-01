import { Link } from "@tanstack/react-router";
import { useState } from "react";
import Logo from "@/assets/logo.webp";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useApiKeyStore } from "@/features/settings/api-key.store";
import { SettingsModal } from "@/features/settings/components/settings-modal";

const GithubLogo = () => (
	<svg
		width="20"
		height="20"
		viewBox="0 0 1024 1024"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		className="[filter:url(#innerTextShadow)]"
	>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
			transform="scale(64)"
			fill="currentColor"
		/>
	</svg>
);

export default function Header() {
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const { isConfigured } = useApiKeyStore();

	return (
		<div className=" grid grid-cols-3 items-center px-4 w-full max-w-window mx-auto  mt-5">
			<Link to="/" className="flex items-center  gap-2">
				<img src={Logo} alt="QuickCV" className="size-8 drop-shadow-logo" />
				<span className="text-lg font-medium text-black/30 tracking-tight [filter:url(#innerTextShadow)]">
					QuickCV
				</span>
			</Link>
			<div className="col-start-3 flex justify-self-end  font-medium relative text-sm items-center gap-4 text-gray-700">
				<Link to="/dashboard">Dashboard</Link>
				<a
					href="https://github.com"
					target="_blank"
					rel="noopener noreferrer"
					className="text-gray-600 hover:text-gray-800 transition-colors"
					aria-label="GitHub"
				>
					<GithubLogo />
				</a>
				<Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
					<DialogTrigger asChild>
						<button
							onClick={() => setIsSettingsOpen((v) => !v)}
							className="bg-white rounded-xl  py-1 px-3  items-center gap-1  flex shadow-input hover:shadow-input-hover transition-shadow"
						>
							<div
								className={`absolute top-0 right-0 size-2.5 rounded-full ${
									isConfigured ? "bg-green-500" : "bg-red-500 animate-pulse"
								}`}
								title={isConfigured ? "API key configured" : "API key required"}
							/>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="w-4 h-4"
								viewBox="0 0 24 24"
								fill="none"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
								stroke="currentColor"
							>
								<path d="M10.11 3.9a1 1 0 0 1 .995-.9h1.79a1 1 0 0 1 .995.9l.033.333a7.953 7.953 0 0 1 2.209.915l.259-.212a1 1 0 0 1 1.34.067l1.266 1.266a1 1 0 0 1 .067 1.34l-.212.26c.409.676.72 1.419.915 2.208l.332.033a1 1 0 0 1 .901.995v1.79a1 1 0 0 1-.9.995l-.333.033a7.951 7.951 0 0 1-.915 2.209l.212.259a1 1 0 0 1-.067 1.34l-1.266 1.266a1 1 0 0 1-1.34-.067l-.26-.212a7.947 7.947 0 0 1-2.208.915l-.033.332a1 1 0 0 1-.995.901h-1.79a1 1 0 0 1-.995-.9l-.033-.333a7.95 7.95 0 0 1-2.209-.915l-.259.212a1 1 0 0 1-1.34-.067L5.003 17.73a1 1 0 0 1-.067-1.34l.212-.26a7.953 7.953 0 0 1-.915-2.208L3.9 13.89a1 1 0 0 1-.9-.995v-1.79a1 1 0 0 1 .9-.995l.333-.033a7.953 7.953 0 0 1 .915-2.209l-.212-.259a1 1 0 0 1 .067-1.34L6.27 5.003a1 1 0 0 1 1.34-.067l.26.212a7.947 7.947 0 0 1 2.208-.915z" />
								<path d="M14.5 12a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0" />
							</svg>
							<span className="hidden md:block pointer-events-none select-none">
								Settings
							</span>
						</button>
					</DialogTrigger>
					<SettingsModal
						isOpen={isSettingsOpen}
						onClose={() => setIsSettingsOpen(false)}
					/>
				</Dialog>
			</div>
		</div>
	);
}
