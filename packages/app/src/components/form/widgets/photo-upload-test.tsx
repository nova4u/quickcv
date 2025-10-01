"use client";
import { AnimatePresence, motion } from "motion/react";
import {
	type DragEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FileStatus = "idle" | "dragging" | "uploading" | "error";

interface FileError {
	message: string;
	code: string;
}

interface FileUploadProps {
	onUploadSuccess?: (file: File) => void;
	onUploadError?: (error: FileError) => void;
	acceptedFileTypes?: string[];
	maxFileSize?: number;
	currentFile?: File | null;
	onFileRemove?: () => void;
	validateFile?: (file: File) => FileError | null;
	className?: string;
}

const DEFAULT_MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const FILE_SIZES = [
	"Bytes",
	"KB",
	"MB",
	"GB",
	"TB",
	"PB",
	"EB",
	"ZB",
	"YB",
] as const;

const formatBytes = (bytes: number, decimals = 2): string => {
	if (!+bytes) return "0 Bytes";
	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	const unit = FILE_SIZES[i] || FILE_SIZES[FILE_SIZES.length - 1];
	return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${unit}`;
};

const UploadIllustration = () => (
	<div className="relative w-16 h-16">
		<svg
			viewBox="0 0 100 100"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="w-full h-full"
			aria-label="Upload illustration"
		>
			<title>Upload File Illustration</title>
			<circle
				cx="50"
				cy="50"
				r="45"
				className="stroke-gray-200"
				strokeWidth="2"
				strokeDasharray="4 4"
			>
				<animateTransform
					attributeName="transform"
					type="rotate"
					from="0 50 50"
					to="360 50 50"
					dur="60s"
					repeatCount="indefinite"
				/>
			</circle>

			<g transform="translate(50, 50)">
				<svg
					x="-24"
					y="-24"
					width="48"
					height="48"
					viewBox="0 0 24 24"
					className="text-blue-500"
				>
					<path
						fill="currentColor"
						d="M5.616 20q-.691 0-1.153-.462T4 18.384V5.616q0-.691.463-1.153T5.616 4h7.896q-.246.54-.36 1.12t-.113 1.169q0 2.442 1.759 4.115q1.76 1.673 4.202 1.538q.275-.019.516-.049q.24-.03.484-.108v6.6q0 .69-.462 1.153T18.384 20zM7.5 16.5h9.154l-2.827-3.77l-2.615 3.308l-1.75-2.115zm10.712-6.711V4.92l-2.1 2.056l-.689-.688L18.712 3L22 6.289l-.688.688l-2.1-2.056V9.79z"
					/>
				</svg>
			</g>
		</svg>
	</div>
);

export default function FileUpload({
	onUploadSuccess = () => {},
	onUploadError = () => {},
	acceptedFileTypes = [],
	maxFileSize = DEFAULT_MAX_FILE_SIZE,
	currentFile: initialFile = null,
	onFileRemove = () => {},
	validateFile = () => null,
	className,
}: FileUploadProps) {
	const [file, setFile] = useState<File | null>(initialFile);
	const [status, setStatus] = useState<FileStatus>("idle");
	const [error, setError] = useState<FileError | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const imageUrlRef = useRef<string | null>(null);

	// Cleanup object URL when file changes or component unmounts
	useEffect(() => {
		if (file) {
			// Clean up previous URL if it exists
			if (imageUrlRef.current) {
				URL.revokeObjectURL(imageUrlRef.current);
			}
			// Create new URL
			imageUrlRef.current = URL.createObjectURL(file);
		} else {
			// Clean up URL when file is removed
			if (imageUrlRef.current) {
				URL.revokeObjectURL(imageUrlRef.current);
				imageUrlRef.current = null;
			}
		}

		// Cleanup on unmount
		return () => {
			if (imageUrlRef.current) {
				URL.revokeObjectURL(imageUrlRef.current);
			}
		};
	}, [file]);

	const validateFileSize = useCallback(
		(file: File): FileError | null => {
			if (file.size > maxFileSize) {
				return {
					message: `File size exceeds ${formatBytes(maxFileSize)}`,
					code: "FILE_TOO_LARGE",
				};
			}
			return null;
		},
		[maxFileSize],
	);

	const validateFileType = useCallback(
		(file: File): FileError | null => {
			if (!acceptedFileTypes?.length) return null;

			const fileType = file.type.toLowerCase();
			if (
				!acceptedFileTypes.some((type) => fileType.match(type.toLowerCase()))
			) {
				return {
					message: `File type must be ${acceptedFileTypes.join(", ")}`,
					code: "INVALID_FILE_TYPE",
				};
			}
			return null;
		},
		[acceptedFileTypes],
	);

	const handleError = useCallback(
		(error: FileError) => {
			setError(error);
			setStatus("error");
			onUploadError?.(error);

			setTimeout(() => {
				setError(null);
				setStatus("idle");
			}, 3000);
		},
		[onUploadError],
	);

	const animateImageIn = useCallback(
		(selectedFile: File) => {
			setFile(selectedFile);
			setStatus("uploading");

			// Simple timeout to show the animation briefly then show the image
			setTimeout(() => {
				setStatus("idle");
				onUploadSuccess?.(selectedFile);
			}, 800); // Short animation duration
		},
		[onUploadSuccess],
	);

	const handleFileSelect = useCallback(
		(selectedFile: File | null) => {
			if (!selectedFile) return;

			// Reset error state
			setError(null);

			// Validate file
			const sizeError = validateFileSize(selectedFile);
			if (sizeError) {
				handleError(sizeError);
				return;
			}

			const typeError = validateFileType(selectedFile);
			if (typeError) {
				handleError(typeError);
				return;
			}

			const customError = validateFile?.(selectedFile);
			if (customError) {
				handleError(customError);
				return;
			}

			animateImageIn(selectedFile);
		},
		[
			animateImageIn,
			validateFileSize,
			validateFileType,
			validateFile,
			handleError,
		],
	);

	const handleDragOver = useCallback(
		(e: DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			console.log("handleDragOver triggered, current status:", status);
			if (status !== "uploading") {
				setStatus("dragging");
			}
		},
		[status],
	);

	const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		console.log("handleDragLeave triggered");
		setStatus("idle");
	}, []);

	const handleDrop = useCallback(
		(e: DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			console.log("handleDrop triggered, files:", e.dataTransfer.files);
			setStatus("idle");

			if (status === "uploading") return;

			const droppedFile = e.dataTransfer.files?.[0];
			if (droppedFile) {
				console.log("Processing dropped file:", droppedFile.name);
				handleFileSelect(droppedFile);
			}
		},
		[status, handleFileSelect],
	);

	const handleFileInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const selectedFile = e.target.files?.[0];
			handleFileSelect(selectedFile || null);
			if (e.target) e.target.value = "";
		},
		[handleFileSelect],
	);

	const triggerFileInput = useCallback(() => {
		if (status === "uploading") return;
		fileInputRef.current?.click();
	}, [status]);

	const resetState = useCallback(() => {
		setFile(null);
		setStatus("idle");
		if (onFileRemove) onFileRemove();
	}, [onFileRemove]);

	return (
		<div className={cn("relative w-full max-w-sm mx-auto", className || "")}>
			<div className="group relative w-full rounded-xl bg-white ring-1 ring-gray-200 p-0.5">
				<div className="absolute inset-x-0 -top-px h-px w-full bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
				<div className="relative w-full rounded-[10px] bg-gray-50/50 p-px">
					<div
						className={cn(
							"relative mx-auto w-full overflow-hidden rounded-lg shadow-[0px_0px_0px_1px_rgba(0,0,0,0.05),0px_1px_1px_rgba(0,0,0,0.07)] bg-white",
							error ? "border-red-500/50" : "",
						)}
					>
						<div
							className={cn(
								"absolute inset-0 transition-opacity duration-300 bg-white",
								status === "dragging" ? "opacity-100" : "opacity-0",
								// "opacity-100",
							)}
						>
							<div
								style={{
									background:
										"radial-gradient(50% 50% at 50% 50%, transparent 70%, #f0f9ff 100%)",
								}}
								className="absolute inset-0   from-black/50 via-transparent to-transparent"
							/>

							{/* <div className="absolute inset-x-0 top-0 h-[20%] bg-gradient-to-b from-black/5 via-transparent to-transparent" />
							<div className="absolute inset-x-0 bottom-0 h-[20%] bg-gradient-to-t from-black/5 via-transparent to-transparent" />
							<div className="absolute inset-y-0 left-0 w-[20%] bg-gradient-to-r from-black/5 via-transparent to-transparent" />
							<div className="absolute inset-y-0 right-0 w-[20%] bg-gradient-to-l from-black/5 via-transparent to-transparent" /> */}
							{/* <div className="absolute inset-[20%] bg-blue-500/5 rounded-lg transition-all duration-300 animate-pulse" /> */}
						</div>

						<div className="absolute -right-4 -top-4 h-8 w-8 bg-gradient-to-br from-blue-500/20 to-transparent blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

						<div className="relative h-[240px]">
							<AnimatePresence mode="wait">
								{file && status === "idle" ? (
									<motion.div
										key="image-preview"
										initial={{ opacity: 0, scale: 0.95 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.95 }}
										className="absolute inset-0"
										onDragOver={handleDragOver}
										onDragLeave={handleDragLeave}
										onDrop={handleDrop}
									>
										<div className="relative w-full h-full">
											<img
												src={imageUrlRef.current || ""}
												alt="Selected file preview"
												className="w-full h-full object-cover  rounded-lg "
												onDragStart={(e) => e.preventDefault()}
												draggable={false}
											/>
											<button
												onClick={resetState}
												type="button"
												className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-md"
											>
												<svg
													width="12"
													height="12"
													viewBox="0 0 24 24"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M18 6L6 18M6 6l12 12"
													/>
												</svg>
											</button>
										</div>
									</motion.div>
								) : file && status === "dragging" ? (
									<motion.div
										key="image-preview-dragging"
										initial={{ opacity: 0, scale: 0.95 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.95 }}
										className="absolute inset-0"
										onDragOver={handleDragOver}
										onDragLeave={handleDragLeave}
										onDrop={handleDrop}
									>
										<div className="relative w-full h-full">
											<img
												src={imageUrlRef.current || ""}
												alt="Selected file preview"
												className="w-full h-full object-cover rounded-lg opacity-50"
												onDragStart={(e) => e.preventDefault()}
												draggable={false}
											/>
											<div className="absolute inset-0 bg-blue-500/20 rounded-lg flex items-center justify-center" />
											<button
												onClick={resetState}
												type="button"
												className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 shadow-md"
											>
												<svg
													width="12"
													height="12"
													viewBox="0 0 24 24"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M18 6L6 18M6 6l12 12"
													/>
												</svg>
											</button>
										</div>
									</motion.div>
								) : (status === "idle" || status === "dragging") && !file ? (
									<motion.div
										key="dropzone"
										initial={{ opacity: 0, y: 10 }}
										animate={{
											opacity: status === "dragging" ? 0.8 : 1,
											y: 0,
											scale: status === "dragging" ? 0.98 : 1,
										}}
										exit={{ opacity: 0, y: -10 }}
										transition={{ duration: 0.2 }}
										className="absolute inset-0 flex flex-col items-center justify-center p-6"
										onDragOver={handleDragOver}
										onDragLeave={handleDragLeave}
										onDrop={handleDrop}
									>
										<div className="mb-4">
											<UploadIllustration />
										</div>

										<h3 className=" text-foreground font-semibold tracking-tight text-center">
											Drag and drop or
										</h3>

										<Button
											variant={"secondary"}
											type="button"
											onClick={triggerFileInput}
											className="mt-3"
										>
											<span>Select File</span>
										</Button>
										<p className="text-xs text-gray-500 mt-2">
											{acceptedFileTypes?.length
												? `${acceptedFileTypes
														.map((t) => t.split("/")[1])
														.join(", ")
														.toUpperCase()}`
												: "SVG, PNG, JPG or GIF"}{" "}
											{maxFileSize && `up to ${formatBytes(maxFileSize)}`}
										</p>

										{/* <p className="mt-3 text-xs text-gray-500">
											or drag and drop your file here
										</p> */}

										<input
											ref={fileInputRef}
											type="file"
											className="sr-only"
											onChange={handleFileInputChange}
											accept={acceptedFileTypes?.join(",")}
											aria-label="File input"
										/>
									</motion.div>
								) : status === "uploading" ? (
									<motion.div
										key="uploading"
										initial={{ opacity: 0, scale: 0.95 }}
										animate={{ opacity: 1, scale: 1 }}
										exit={{ opacity: 0, scale: 0.95 }}
										className="absolute inset-0 flex flex-col items-center justify-center p-6"
									>
										<div className="mb-4">
											<div className="relative w-16 h-16">
												<div className="w-full h-full rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin" />
											</div>
										</div>

										<div className="text-center space-y-1.5 mb-4">
											<h3 className="text-sm font-semibold text-gray-900 truncate">
												{file?.name}
											</h3>
											<div className="flex items-center justify-center gap-2 text-xs">
												<span className="text-gray-500">
													{formatBytes(file?.size || 0)}
												</span>
												<span className="text-blue-500">Processing...</span>
											</div>
										</div>
									</motion.div>
								) : null}
							</AnimatePresence>
						</div>

						<AnimatePresence>
							{error && (
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg"
								>
									<p className="text-sm text-red-500">{error.message}</p>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>
			</div>
		</div>
	);
}

FileUpload.displayName = "FileUpload";
