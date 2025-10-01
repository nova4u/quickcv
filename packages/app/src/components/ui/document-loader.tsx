import { motion } from "motion/react";

interface DocumentLoaderProps {
	text?: string;
	className?: string;
}

export function DocumentLoader({
	text = "Loading...",
	className,
}: DocumentLoaderProps) {
	return (
		<div className={className}>
			<div className="flex items-center justify-center py-30">
				<div className="text-center">
					<div className="mx-auto mb-6">
						{/* Document Icon */}
						<div className="relative w-16 h-18 bg-white shadow-lg mx-auto rounded-sm">
							{/* Document content lines with staggered animation */}
							<div className="p-2 pt-3 space-y-1.5">
								{[0, 1, 2, 3].map((index) => (
									<motion.div
										key={index}
										className="bg-gray-300 rounded-xs h-0.5"
										style={{
											width: index === 3 ? "60%" : index === 1 ? "25%" : "90%",
											transformOrigin: "left top",
										}}
										initial={{ opacity: 0, scaleX: 0 }}
										animate={{
											opacity: [0, 1, 1, 0],
											scaleX: [0, 1, 1, 0],
										}}
										transition={{
											duration: 1.5,
											times: [0, 0.2, 0.7, 0.9],
											delay: index * 0.15,
											repeat: Number.POSITIVE_INFINITY,
											repeatDelay: 0.1,
										}}
									/>
								))}
							</div>
						</div>
					</div>
					<motion.p className="text-sm">
						<motion.span
							className="relative font-medium inline-block bg-[length:250%_100%,auto] bg-clip-text text-transparent [background-repeat:no-repeat,padding-box]"
							initial={{ backgroundPosition: "100% center" }}
							animate={{ backgroundPosition: "-50% center" }}
							transition={{
								repeat: Number.POSITIVE_INFINITY,
								duration: 1,
								repeatDelay: 0.2,
								ease: "linear",
							}}
							style={
								{
									"--spread": "50px",
									backgroundImage:
										"linear-gradient(90deg, transparent calc(50% - var(--spread)), #4b5563, transparent calc(50% + var(--spread))), linear-gradient(#9ca3af, #9ca3af)",
								} as React.CSSProperties
							}
						>
							{text}
						</motion.span>
					</motion.p>
				</div>
			</div>
		</div>
	);
}
