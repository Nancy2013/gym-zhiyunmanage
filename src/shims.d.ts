import { RuleObject } from 'ant-design-vue/lib/form/index'

declare module 'qrcodejs2-fix'

declare interface Option {
	label: string
	value: number | string
}
declare module 'fs'

declare interface Rules {
	[index: string | number]: RuleObject | RuleObject[]
}