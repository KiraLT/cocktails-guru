import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useId, useState } from "react";
import { FaCheck, FaCopy, FaDownload } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Share() {
	const [copied, setCopied] = useState(false);
	const [url, setUrl] = useState("");
	const canvasId = useId();

	useEffect(() => {
		setUrl(window.location.href);
	}, []);

	useEffect(() => {
		if (!copied) return;
		const timer = setTimeout(() => setCopied(false), 1500);
		return () => clearTimeout(timer);
	}, [copied]);

	const handleCopy = async () => {
		if (!url) return;
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
		} catch {
			setCopied(false);
		}
	};

	const handleDownload = () => {
		const canvas = document.getElementById(canvasId);
		if (!(canvas instanceof HTMLCanvasElement)) return;
		const pngUrl = canvas.toDataURL("image/png");
		const link = document.createElement("a");
		link.href = pngUrl;
		link.download = "cocktails-guru-list.png";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<div className="space-y-4">
			<div className="flex w-full gap-2">
				<Input readOnly value={url} className="flex-1" aria-label="Share URL" />
				<Button
					variant={copied ? "default" : "secondary"}
					onClick={handleCopy}
					aria-label="Copy link"
				>
					{copied ? <FaCheck /> : <FaCopy />}
					<span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
				</Button>
			</div>
			{url && (
				<div className="flex flex-col items-center gap-3 rounded-xl border border-border/60 bg-background p-5">
					<QRCodeCanvas
						value={url}
						size={220}
						id={canvasId}
						bgColor="#ffffff"
						fgColor="#000000"
						className="rounded-md"
					/>
					<Button variant="outline" size="sm" onClick={handleDownload}>
						<FaDownload />
						Download QR
					</Button>
				</div>
			)}
		</div>
	);
}
