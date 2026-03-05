export interface GeminiPromptModel {
	promptId: number
	prompt: string
	subCategoryId?: number | null
}

export interface GeminiInputModel {
	subCategoryId?: number | null
	userRequest: string
}

export type geminiPromptModel = GeminiPromptModel