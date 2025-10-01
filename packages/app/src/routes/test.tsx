import { createFileRoute } from "@tanstack/react-router";
import PhotoUploader2 from "@/components/form/widgets/photo-upload-test";
import { PhotoUploader } from "@/components/form/widgets/photo-uploader";
import { ClerkCTALink } from "@/components/ui/remove-later";

export const Route = createFileRoute("/test")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="bg-neutral-100 w-screen h-screen p-20">
			<div className="flex gap-3">
				<button
					className="bg-black/90 text-white h-10 rounded-md px-5 hocus:outline-red-950 outline-transparent hocus:outline-1 outline-offset-1 transition-[outline-color] duration-500"
					style={{
						boxShadow:
							"inset 0 -12px 16px 0 hsla(0,0%,100%,.10),inset 0 4px 16px 0 hsla(0,0%,100%,.16),inset 0 .75px .25px 0 hsla(0,0%,100%,.12),inset 0 .25px .25px 0 hsla(0,0%,100%,.32),0 40px 24px 0 rgba(0,0,0,.06),0 23px 14px 0 rgba(0,0,0,.08),0 10px 10px 0 rgba(0,0,0,.12),0 3px 6px 0 rgba(0,0,0,.19),0 0 0 .75px rgba(0,0,0,.56)",
					}}
				>
					First
				</button>
				<button
					className="bg-black/90 text-white h-10 rounded-md px-5 hocus:outline-red-950 outline-transparent hocus:outline-1 outline-offset-1 transition-[outline-color] duration-500"
					style={{
						boxShadow:
							"inset 0 -12px 16px 0 hsla(0,0%,100%,.10),inset 0 4px 16px 0 hsla(0,0%,100%,.16),inset 0 .75px .25px 0 hsla(0,0%,100%,.12),inset 0 .25px .25px 0 hsla(0,0%,100%,.32),0 40px 24px 0 rgba(0,0,0,.06),0 23px 14px 0 rgba(0,0,0,.08),0 10px 10px 0 rgba(0,0,0,.12),0 3px 6px 0 rgba(0,0,0,.19),0 0 0 .75px rgba(0,0,0,.56)",
					}}
				>
					Second
				</button>
				<ClerkCTALink href="https://clerk.com/docs/quickstart">
					Start building for free
				</ClerkCTALink>
				<PhotoUploader name="photo" shape="square" />

				<PhotoUploader2 />
			</div>
		</div>
	);
}
