import { useAction } from "@/hooks";



export const setBreamubTitle = function (breamubTitle: string) {
	const storeAction = useAction("mainModule", [
		"asyncUpdateBreamubTitle",
	]);
	setTimeout(() => {
		storeAction.asyncUpdateBreamubTitle({
			breamubTitle: breamubTitle
		})
	})
}