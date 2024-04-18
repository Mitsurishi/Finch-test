type Field = number[];

interface SelectedNumber {
    firstField: Field
    secondField: Field
}

export type GameState = "inProgress" | "over";

export interface FieldItem {
    value: number
    isActive: boolean
}

export interface ResultRequestData {
    selectedNumber: SelectedNumber
    isTicketWon: boolean
}

export interface LoadingState {
    error: boolean
    loading: boolean
    message: string
}