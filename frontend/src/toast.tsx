import { useEffect } from "react";

type StatusType = "success" | "error" | "info";

type ToastType = {
	title: string;
	onDismiss: () => void;
	styleClass?: string;
	status: StatusType;
};

const Toast = ({ title, onDismiss, styleClass, status }: ToastType) => {
	useEffect(() => {
		setTimeout(() => {
			onDismiss();
		}, 1000);
	});
	return (
		<div className="animate-fade-in-up  z-50">
			<div
				className={`flex min-w-[200px] items-center space-x-2 rounded-lg border border-gray-700 bg-gray-800 p-2  shadow-xl ${styleClass} ${status === "success" ? "bg-green-50 border-green-500 text-green-500" : status === "error" ? "bg-red-50 text-red-500 border-red-500" : "bg-blue-50 text-blue-500 border-blue-500"}`}
			>
				<div className="flex-1 text-sm font-medium">{title}</div>
				<button className="text-gray-400 hover:text-white">&times;</button>
			</div>
		</div>
	);
};

export default Toast;
