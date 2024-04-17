import { action, makeObservable, observable } from "mobx";
import { FieldItem, LoadingState, ResultRequestData } from "../utils/types";


interface LotteryAppStoreProps {
    firstFieldCount: number
    secondFieldCount: number
}

class LotteryAppStore {
    @observable
    private firstField: FieldItem[];

    @observable
    private secondField: FieldItem[];

    @observable
    private isTicketWon: boolean;

    @observable
    private loadingState: LoadingState;

    constructor(props: LotteryAppStoreProps) {
        this.firstField = LotteryAppStore.prepareField(props.firstFieldCount);
        this.secondField = LotteryAppStore.prepareField(props.secondFieldCount);
        this.isTicketWon = false;
        this.loadingState = {
            error: false,
            loading: false,
        }

        makeObservable(this);
    }

    // Получить массив фишек 1-го поля
    public getFirstField = () => this.firstField;

    // Получить массив фишек 2-го поля
    public getSecondField = () => this.secondField;

    // Получить количество выбранных фишек 1-го поля
    public getFirstFieldSelectedCount = () => {
        return this.firstField.filter((el) => el.isActive).length;
    }

    // Получить количество выбранных фишек 2-го поля
    public getSecondFieldSelectedCount = () => {
        return this.secondField.filter((el) => el.isActive).length;
    }

    public getIsTicketWon = () => this.isTicketWon;

    // Получить состояние загрузки
    public getLoadingState = () => this.loadingState;

    // Отправить результат
    public sendResult = async () => {
        try {
            this.setLoadingState({ error: false, loading: true })

            const data: ResultRequestData = {
                selectedNumber: {
                    firstField: LotteryAppStore.getSelectedNumbers(this.firstField),
                    secondField: LotteryAppStore.getSelectedNumbers(this.secondField),
                },
                isTicketWon: this.isTicketWon,
            }

            const response = await fetch('/result', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(data)
            });

            if (response.status !== 200) {
                throw new Error("Ошибка при отправке результата");
            } else {
                this.setLoadingState({ error: false, loading: false });
            }
        } catch (error) {
            console.log(error);
            if (typeof error === 'string') {
                this.setLoadingState({ error, loading: false })
            } else if (error instanceof Error) {
                this.setLoadingState({ error: error.message, loading: false })
            } else {
                this.setLoadingState({ error: "Неизвестная ошибка", loading: false })
            }
        }
    }

    // Активировать/деактивировать фишку 1-го поля
    @action
    public toggleFirstFieldActive = (value: number) => {
        const fieldEl = this.firstField.find((el) => el.value === value);

        if (fieldEl) {
            if (fieldEl.isActive) {
                fieldEl.isActive = false;
            } else {
                fieldEl.isActive = true;
            }
        }
    }

    // Активировать/деактивировать фишку 2-го поля
    @action
    public toggleSecondFieldActive = (value: number) => {
        const fieldEl = this.secondField.find((el) => el.value === value);

        if (fieldEl) {
            if (fieldEl.isActive) {
                fieldEl.isActive = false;
            } else {
                fieldEl.isActive = true;
            }
        }
    }

    // Установить состояние загрузки
    @action
    private setLoadingState = (loadingState: LoadingState) => {
        this.loadingState = loadingState;
    }

    private static getSelectedNumbers = (field: FieldItem[]) => {
        const selectedFields = field.filter((el) => el.isActive);

        return selectedFields.map((fieldEl) => fieldEl.value);
    }

    // Первичное заполнение поля
    private static prepareField = (fieldCount: number) => {
        const result: FieldItem[] = [];

        for (let i = 1; i <= fieldCount; i++) {
            result.push({
                value: i,
                isActive: false,
            });
        }

        return result;
    }
}

export default LotteryAppStore;