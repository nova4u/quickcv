import { DialogClose } from "@radix-ui/react-dialog";
import { motion, type Variants } from "motion/react";
import { forwardRef, useEffect, useState } from "react";
import BG from "@/assets/bg.webp";
import { Button } from "@/components/ui/button";
import { DialogContent } from "@/components/ui/dialog";

export interface DeploymentSuccessModalProps {
	isOpen: boolean;
	onClose: () => void;
	url?: string;
	projectSettingsUrl?: string;
}
const fadeInUpvariants: Variants = {
	initial: {
		opacity: 0,
		y: 8,
		filter: "blur(2px)",
	},
	animate: {
		opacity: 1,
		y: 0,
		filter: "blur(0px)",
	},
};

export const DeploymentSuccessModal = forwardRef<
	HTMLDivElement,
	DeploymentSuccessModalProps
>(({ isOpen, url, projectSettingsUrl }, ref) => {
	const [animationPhase, setAnimationPhase] = useState(0);

	// Trigger animation phases
	useEffect(() => {
		if (isOpen) {
			setAnimationPhase(0);
			const timer1 = setTimeout(() => setAnimationPhase(1), 200);
			const timer2 = setTimeout(() => setAnimationPhase(2), 500);
			const timer3 = setTimeout(() => setAnimationPhase(3), 800);

			return () => {
				clearTimeout(timer1);
				clearTimeout(timer2);
				clearTimeout(timer3);
			};
		}
	}, [isOpen]);

	return (
		<DialogContent isOpen={isOpen} ref={ref}>
			<motion.div
				className="fixed z-50 top-[50%] left-[50%] grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 [--radius:24px] rounded-[var(--radius)] shadow-lg duration-200 sm:max-w-[440px] overflow-hidden"
				style={{
					transformOrigin: "left",
				}}
				initial={{
					opacity: 0,
					transform:
						"perspective(500px) translateZ(-20px) rotateY(7deg) rotateX(6deg)",
					filter: "blur(2px)",
				}}
				animate={{
					opacity: 1,
					transform:
						"perspective(500px) translateZ(0px) rotateY(0deg) rotateX(0deg)",
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
					className="bg-white"
					style={{
						boxShadow:
							"0px 8px 8px -4px rgba(0, 0, 0, 0.05), 0px 4px 4px -2px rgba(0, 0, 0, 0.05), 0px 2px 2px -1px rgba(0, 0, 0, 0.05), 0px 0px 0px 1px rgba(0, 0, 0, 0.05)",
					}}
				>
					<div className="relative h-[174px] rounded-t-[14px] overflow-hidden">
						<img
							src={BG}
							alt="bg"
							className="absolute inset-0 z-0 isolate origin-left h-full select-none"
						/>
						{/* Browser/Website illustration with morph animation */}

						<div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
							<motion.div
								className="relative"
								initial={{ scale: 0.8, rotate: -3 }}
								animate={{
									scale: animationPhase >= 1 ? 1.2 : 0.7,
									rotate: animationPhase >= 1 ? 0 : -5,
								}}
								transition={{
									type: "spring",
									duration: 0.6,
									bounce: 0.1,
								}}
							>
								{/* Browser window with morphing effect */}
								<div
									className="bg-white/80 backdrop-blur-2xl rounded-[12px] p-2 shadow-lg w-[141px]"
									style={{
										boxShadow:
											animationPhase >= 1
												? "inset 0 0 0 1px white, 0 0 0 1px rgba(0,0,0,0.05), 0 12px 20px rgba(0,0,0,0.12)"
												: "0 4px 8px rgba(0,0,0,0.1)",
									}}
								>
									{/* Browser header with dots */}
									<div className="flex items-center gap-0.5 mb-2">
										{[0, 1, 2].map((index) => (
											<div
												key={index}
												className="size-[5px] bg-gray-300 rounded-full"
											/>
										))}
									</div>

									{/* URL bar with morphing text */}
									<motion.div
										className="bg-[#EDF3F4] rounded px-2 py-1 mb-2 overflow-hidden relative"
										animate={{
											backgroundColor:
												animationPhase >= 1 ? "#f0f9ff" : "#EDF3F4",
										}}
										transition={{ duration: 0.5 }}
									>
										<motion.div
											animate={{
												color:
													animationPhase >= 1 ? "#0369A1" : "rgba(0,0,0,0.2)",
											}}
											transition={{ duration: 0.5 }}
										>
											<p className="whitespace-nowrap  overflow-hidden text-ellipsis [direction:rtl] text-left font-medium text-[9px]">
												{animationPhase >= 1
													? url
														? url.replace("https://", "").replace(/\/$/, "")
														: "your-site.vercel.app"
													: "www"}
											</p>

											{/* Shimmer effect */}
											{animationPhase >= 3 && (
												<motion.div
													className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
													initial={{ x: "-100%" }}
													animate={{ x: "100%" }}
													transition={{
														duration: 0.5,
														repeat: Number.POSITIVE_INFINITY,
														repeatDelay: 2,
														repeatType: "loop",
														ease: "linear",
													}}
												/>
											)}
										</motion.div>
									</motion.div>

									{/* Content area with morphing bars */}
									<div className="space-y-1">
										{[0, 1, 2].map((index) => (
											<motion.div
												key={index}
												className="bg-[#EDF3F4] rounded origin-left"
												initial={{
													height: index === 0 ? 8 : 6,
													width: index === 2 ? "35%" : "85%",
													scale: 0.5,
													opacity: 0,
												}}
												animate={{
													backgroundColor:
														animationPhase >= 1
															? ["#EDF3F4", "#DBEAFE", "#EDF3F4"]
															: "#EDF3F4",
													scale: animationPhase >= 1 ? [0, 1.1, 1] : 0,
													opacity: animationPhase >= 1 ? 1 : 0,
												}}
												transition={{
													duration: 0.7,
													delay: index * 0.15,
												}}
											/>
										))}
									</div>
								</div>

								{/* Success badge with morph animation */}
								<motion.div
									className="absolute -bottom-3 -right-3 size-10 p-2 bg-white rounded-full flex items-center justify-center shadow-lg"
									initial={{
										scale: 0,
										rotate: -90,
										opacity: 0,
									}}
									animate={{
										scale: animationPhase >= 2 ? 1 : 0,
										rotate: animationPhase >= 2 ? 0 : -90,
										opacity: animationPhase >= 2 ? 1 : 0,
									}}
									transition={{
										type: "spring",
										duration: 0.8,
										bounce: 0.3,
									}}
								>
									<svg
										className="size-5"
										viewBox="0 0 17 16"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<g filter="url(#filter0_di_380_9242)">
											<motion.path
												d="M2.33203 9.54938C2.33203 9.54938 4.91084 10.9505 6.20024 13.0028C6.20024 13.0028 10.0684 4.94407 15.2261 2.25781"
												stroke="black"
												strokeOpacity="0.2"
												strokeWidth="2.93684"
												strokeLinecap="round"
												strokeLinejoin="round"
												// shape-rendering="crispEdges"
												initial={{ pathLength: 0.2 }}
												animate={{ pathLength: animationPhase >= 2 ? 1 : 0.2 }}
												// transition={{ duration: 0.8, delay: 0.2 }}
											/>
										</g>
										<defs>
											<filter
												id="filter0_di_380_9242"
												x="0.863281"
												y="0.789062"
												width="15.8315"
												height="15.4422"
												filterUnits="userSpaceOnUse"
												colorInterpolationFilters="sRGB"
											>
												<feFlood floodOpacity="0" result="BackgroundImageFix" />
												<feColorMatrix
													in="SourceAlpha"
													type="matrix"
													values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
													result="hardAlpha"
												/>
												<feOffset dy="0.879294" />
												<feComposite in2="hardAlpha" operator="out" />
												<feColorMatrix
													type="matrix"
													values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"
												/>
												<feBlend
													mode="normal"
													in2="BackgroundImageFix"
													result="effect1_dropShadow_380_9242"
												/>
												<feBlend
													mode="normal"
													in="SourceGraphic"
													in2="effect1_dropShadow_380_9242"
													result="shape"
												/>
												<feColorMatrix
													in="SourceAlpha"
													type="matrix"
													values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
													result="hardAlpha"
												/>
												<feOffset dy="1.75859" />
												<feGaussianBlur stdDeviation="1.75859" />
												<feComposite
													in2="hardAlpha"
													operator="arithmetic"
													k2="-1"
													k3="1"
												/>
												<feColorMatrix
													type="matrix"
													values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
												/>
												<feBlend
													mode="normal"
													in2="shape"
													result="effect2_innerShadow_380_9242"
												/>
											</filter>
										</defs>
									</svg>

									{/* <svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<motion.path
											d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
											stroke="#118862"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											initial={{ pathLength: 0 }}
											animate={{ pathLength: animationPhase >= 2 ? 1 : 0 }}
											transition={{ duration: 0.8, delay: 0.2 }}
										/>
									</svg> */}
								</motion.div>
							</motion.div>
						</div>
					</div>

					<div className="px-8 py-5 space-y-5">
						<div className="text-center space-y-3">
							<motion.h2
								variants={fadeInUpvariants}
								initial="initial"
								animate="animate"
								transition={{
									delay: 0.4,
								}}
								className="text-xl font-medium text-black"
							>
								Deployment Successful
							</motion.h2>
							<motion.p
								variants={fadeInUpvariants}
								initial="initial"
								animate="animate"
								transition={{
									delay: 0.6,
								}}
								className="text-[13px] text-black/47 leading-relaxed"
							>
								Your CV has been deployed and is now live.
							</motion.p>
						</div>

						{/* Action Buttons with staggered animation */}
						<motion.div
							className="flex gap-2"
							variants={fadeInUpvariants}
							initial="initial"
							animate="animate"
							transition={{
								delay: 0.8,
							}}
						>
							<Button
								variant="test"
								className="flex-1 h-9 text-sm font-medium"
								shadow="lg"
								onClick={() => {
									if (url) {
										window.open(url, "_blank");
									}
								}}
							>
								View Site
							</Button>
							<Button
								variant="secondary"
								className="flex-1 h-9 text-sm font-medium bg-[#F2F2F2] border-0 hover:bg-[#E8E8E8]"
								onClick={() => {
									if (projectSettingsUrl) {
										window.open(projectSettingsUrl, "_blank");
									}
								}}
							>
								Project Settings
							</Button>
						</motion.div>
					</div>

					{/* Close Button */}
					<DialogClose className="ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4">
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
});

DeploymentSuccessModal.displayName = "DeploymentSuccessModal";
