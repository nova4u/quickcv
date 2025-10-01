import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useRef, useState } from "react";
import type { BaseInputProps } from "@/components/form/form-item";
import { compressImage } from "@/lib/image-utils";
import { cn } from "@/lib/utils";

export type PhotoUploaderProps = BaseInputProps & {
	shape?: "circle" | "square";
	size?: "sm" | "base";
	value?: string | null;
	onChange?: (photo: string | null) => void;
};

function megabytes(megabytes: number) {
	return megabytes * 1024 * 1024;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
	value,
	onChange,
	size = "base",
	shape = "circle",
	id,
}) => {
	const [isDragActive, setIsDragActive] = useState(false);
	const [isCompressing, setIsCompressing] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const MAX_FILE_SIZE = megabytes(5);
	const ACCEPTED_TYPES = [
		"image/jpeg",
		"image/png",
		"image/webp",
		"image/avif",
		"image/gif",
		"image/bmp",
		"image/tiff",
		"image/heic",
		"image/heif",
	];

	const validateFile = (file: File): boolean => {
		console.log(file);
		if (!ACCEPTED_TYPES.includes(file.type)) {
			return false;
		}
		if (file.size > MAX_FILE_SIZE) {
			return false;
		}
		return true;
	};

	const processFile = async (file: File) => {
		if (!validateFile(file)) return;

		setIsCompressing(true);
		try {
			const compressedBase64 = await compressImage(file);
			onChange?.(compressedBase64);
		} catch (error) {
			console.error("Failed to compress image:", error);
			const reader = new FileReader();
			reader.onload = (event) => {
				const base64 = event.target?.result as string;
				onChange?.(base64);
			};
			reader.readAsDataURL(file);
		} finally {
			await new Promise((res) => setTimeout(res, 500));
			setIsCompressing(false);
		}
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		console.log("handleDragLeave");
		setIsDragActive(false);
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		console.log("handleDragOver");
		setIsDragActive(true);
		e.stopPropagation();
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		console.log("handleDrop");
		setIsDragActive(false);

		const files = Array.from(e.dataTransfer.files);
		if (files.length > 0) {
			processFile(files[0]);
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			processFile(files[0]);
		}
	};

	const handleClick = () => {
		if (!isCompressing) {
			inputRef.current?.click();
		}
	};

	const containerClasses = size === "sm" ? "w-24 h-24" : "w-45 h-45";
	const roundedClassName = shape === "square" ? "rounded-xl" : "rounded-full";

	const handleRemovePhoto = (e: React.MouseEvent) => {
		e.stopPropagation();
		onChange?.(null);
	};

	return (
		<motion.div>
			<div
				className={cn(
					"relative flex cursor-pointer",
					containerClasses,
					roundedClassName,
				)}
				onDragLeave={handleDragLeave}
				onDragOver={handleDragOver}
				onDrop={handleDrop}
				onClick={handleClick}
			>
				<input
					ref={inputRef}
					type="file"
					accept={ACCEPTED_TYPES.join(",")}
					onChange={handleFileChange}
					className="hidden"
					id={id}
				/>

				<AnimatePresence mode="wait">
					{value ? (
						<>
							<motion.img
								initial={{
									opacity: 0,
									scale: 0.95,
								}}
								animate={{
									opacity: 1,
									scale: 1,
								}}
								exit={{
									opacity: 0,
									scale: 0.95,
								}}
								src={value}
								width={128}
								height={128}
								alt="Person"
								className={cn(
									"object-cover",
									containerClasses,
									roundedClassName,
								)}
							/>
							<div
								className={cn(
									"absolute bg-black/50 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity",
									containerClasses,
									roundedClassName,
								)}
							>
								<div className="flex flex-col items-center gap-1">
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										aria-label="Edit photo"
									>
										<title>Edit photo</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
										/>
									</svg>
									<span className="text-xs">Edit</span>
								</div>
							</div>
							{/* Remove button */}
							<button
								type="button"
								onClick={handleRemovePhoto}
								className={cn(
									"absolute -top-1 -right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10",
									shape === "circle" && "rounded-full",
								)}
							>
								<svg
									className="w-3 h-3"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<title>Remove photo</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</>
					) : (
						<motion.div
							initial={{
								scale: 0.95,
								opacity: 0,
							}}
							exit={{
								scale: 0.95,
								opacity: 0,
							}}
							animate={{
								scale: 1,
								opacity: 1,
							}}
							className={cn(
								"flex items-center justify-center border-2 border-dashed text-gray-400 relative",
								containerClasses,
								roundedClassName,
								{
									"border-blue-400 text-blue-500": isDragActive,
									"border-gray-300 hover:border-gray-400 hover:text-gray-500":
										!isDragActive,
								},
							)}
						>
							<motion.div
								className="absolute inset-0"
								style={{
									borderRadius: "100%",
									background:
										"radial-gradient(50% 50% at 50% 50%, transparent 30%, #2563eb10 100%)",
								}}
								animate={{
									borderRadius: isDragActive ? "inherit" : "100%",
									opacity: isDragActive ? 1 : 0,
									scale: isDragActive ? 1 : 0.2,
									filter: isDragActive ? "blur(1px)" : "blur(10px)",
								}}
								transition={{
									duration: 0.12,
								}}
							/>
							<motion.div
								animate={{
									scale: isDragActive ? 0.95 : 1,
								}}
								className="flex flex-col items-center gap-2"
							>
								{isCompressing ? (
									<>
										<div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
										<span className="text-xs text-center">Compressing...</span>
									</>
								) : (
									<>
										<svg
											className="w-8 h-8"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<title>Drag'n'drop or click</title>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={1.5}
												d="M12 4v16m8-8H4"
											/>
										</svg>
										<span className="text-xs text-center">
											{isDragActive ? "Drop photo" : "Drag'n'drop or click"}
										</span>
									</>
								)}
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
			<p className="text-xs text-gray-500">Images up to 5MB</p>
		</motion.div>
	);
};
