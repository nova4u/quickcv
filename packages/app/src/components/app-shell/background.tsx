import { motion } from "motion/react";

export default function BackgroundImage() {
	return (
		<>
			<motion.img
				width={1500}
				height={2000}
				src="/cloud.webp"
				alt="bg"
				className="fixed w-[2000px] h-[1200px] object-cover -z-10"
				initial={{ scale: 1 }}
				animate={{
					scale: [1, 1.5, 1],
				}}
				transition={{
					scale: {
						duration: 40,
						ease: "linear",
						repeat: Number.POSITIVE_INFINITY,
						repeatType: "loop",
					},
				}}
			/>
			<div className="fixed top-0 left-0 w-full h-full bg-sky-100 -z-20" />
		</>
	);
}
