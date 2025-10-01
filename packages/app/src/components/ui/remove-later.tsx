export const ClerkCTALink = ({
	href = "https://clerk.com/docs/quickstart",
	children = "Start building for free",
	className = "",
	style = {},
	...props
}) => {
	return (
		<a
			href={href}
			className={`
        group relative isolate inline-flex items-center justify-center overflow-hidden text-left font-medium
        transition-[color,background-color,border-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter,-webkit-backdrop-filter]
        duration-300 ease-[cubic-bezier(0.4,0.36,0,1)]
        before:duration-300 before:ease-[cubic-bezier(0.4,0.36,0,1)] before:transition-[opacity]
        rounded-[6px]
        shadow-[0px_0px_0px_1px_rgb(108,71,255),0px_1px_0px_0px_rgba(255,255,255,0.07),0px_1px_3px_0px_rgba(33,33,38,0.2)]
        before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-[6px]
        before:bg-[linear-gradient(rgba(255,255,255,0.2),rgba(255,255,255,0))] before:opacity-50
        hover:before:opacity-100
        after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:rounded-[6px]
        after:bg-[linear-gradient(rgba(255,255,255,0.1)_46%,rgba(255,255,255,0)_54%)]
        after:mix-blend-overlay
        text-[13px] h-[30px] px-[12px] leading-[24px] font-medium
        bg-[rgb(108,71,255)] text-white
        antialiased
        ${className}
      `}
			style={{
				...style,
			}}
			{...props}
		>
			{children}
		</a>
	);
};
