import { DialogClose } from "@radix-ui/react-dialog";
import { motion } from "motion/react";
import { forwardRef } from "react";
import {
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ApiKeyForm } from "./api-key-form";

export interface SettingsModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export const SettingsModal = forwardRef<HTMLDivElement, SettingsModalProps>(
	({ isOpen }, ref) => {
		return (
			<DialogContent isOpen={isOpen}>
				<motion.div
					className="fixed z-50 top-[50%] left-[50%]  grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 [--radius:24px] rounded-[var(--radius)]  shadow-lg duration-200 sm:max-w-lg  overflow-hidden"
					style={{
						transformOrigin: "left",
					}}
					initial={{
						opacity: 0,
						transform:
							"perspective(500px) translateZ(-20px) rotateY(7deg) rotateX(6deg)  ",
						filter: "blur(2px)",
					}}
					animate={{
						opacity: 1,
						transform:
							"perspective(500px) translateZ(0px) rotateY(0deg)  rotateX(0deg)",
						filter: "blur(0px)",
					}}
					exit={{
						opacity: 0,
						transform:
							"perspective(500px) translateZ(-20px) rotateY(7deg) rotateX(6deg)",
						filter: "blur(2px)",
					}}
					transition={{
						type: "spring",
						duration: 0.3,
					}}
				>
					<div
						className="bg-white   p-0.5"
						style={{
							boxShadow:
								"0px 8px 8px -4px rgba(0, 0, 0, 0.05), 0px 4px 4px -2px rgba(0, 0, 0, 0.05), 0px 2px 2px -1px rgba(0, 0, 0, 0.05), 0px 0px 0px 1px rgba(0, 0, 0, 0.05)",
						}}
					>
						<DialogHeader className="px-5 pt-5">
							<DialogTitle>Authenticate with Vercel</DialogTitle>
							<DialogDescription className="text-foreground-muted">
								To manage your live CV sites, we need your Vercel API token.
							</DialogDescription>
						</DialogHeader>
						<ApiKeyForm ref={ref} />

						<div className="text-xs bg-gray-100 px-5 py-4 text-gray-700 space-y-1 mt-4 rounded-t-md rounded-b-[calc(var(--radius)-2px)] mt-3">
							<p>Your API key is stored locally in your browser</p>
							<p>We never send your API key to our servers</p>
						</div>

						<DialogClose className="ring-offset-background focus:ring-ring  absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="32"
								height="32"
								viewBox="0 0 24 24"
							>
								<title>Close</title>
								<path
									fill="none"
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="1.5"
									d="M19 5L5 19M5 5l14 14"
									color="currentColor"
								/>
							</svg>
						</DialogClose>
					</div>
				</motion.div>
			</DialogContent>
		);
	},
);

SettingsModal.displayName = "ApiKeySettings";
