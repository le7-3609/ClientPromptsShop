export interface ChatMessageModel {
  role: 'user' | 'model'
  text: string
}

export interface ChatRequestModel {
  history?: ChatMessageModel[]
  newMessage: string
}
