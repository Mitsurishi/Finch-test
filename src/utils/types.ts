export interface FieldItem {
    value: number
    isActive: boolean
}

type Field = number[];

interface SelectedNumber {
    firstField: Field
    secondField: Field
}

export interface ResultRequestData {
    selectedNumber: SelectedNumber
    isTicketWon: boolean
}

export interface LoadingState {
    error: boolean | string
    loading: boolean
}