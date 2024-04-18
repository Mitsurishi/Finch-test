import { action, makeObservable, observable } from 'mobx';
import {
    FieldItem,
    GameState,
    LoadingState,
    ResultRequestData,
} from '../utils/types';

interface WinningCondition {
    firstField: number
    secondField: number
}

interface LotteryAppStoreProps {
    firstFieldCount: number
    secondFieldCount: number
    firstFieldRequire: number
    secondFieldRequire: number
    firstWinningCondition: WinningCondition
    secondWinningCondition: WinningCondition
}

class LotteryAppStore {
    /**
     * Фишки первого поля
     */
    @observable
    private firstField: FieldItem[];

    /**
     * Фишки второго поля
     */
    @observable
    private secondField: FieldItem[];

    /**
     * Состояние выигрыша билета
     */
    @observable
    private isTicketWon: boolean;

    /**
     * Состояние загрузки данных (для обработки отправки результата)
     */
    @observable
    private loadingState: LoadingState;

    /**
     * Состояние игры (в процессе или завершена)
     */
    @observable
    private gameState: GameState;

    /**
    * Выигрышные фишки первого поля
    */
    private firstFieldWin: number[];

    /**
     * Выигрышные фишки второго поля
     */
    private secondFieldWin: number[];

    /**
     * Общее количество фишек на первом поле
     */
    private readonly firstFieldCount: number;

    /**
     * Общее количество фишек на втором поле
     */
    private readonly secondFieldCount: number;

    /**
     * Необходимое для выбора количество фишек на первом поле
     */
    private readonly firstFieldRequire: number;

    /**
     * Необходимое для выбора количество фишек на втором поле
     */
    private readonly secondFieldRequire: number;

    /**
     * Первое условие для выигрыша
     */
    private readonly firstWinningCondition: WinningCondition;

    /**
     * Второе условие для выигрыша
     */
    private readonly secondWinningCondition: WinningCondition;

    constructor(props: LotteryAppStoreProps) {
        this.firstFieldCount = props.firstFieldCount;
        this.secondFieldCount = props.secondFieldCount;
        this.firstFieldRequire = props.firstFieldRequire;
        this.secondFieldRequire = props.secondFieldRequire;
        this.firstWinningCondition = props.firstWinningCondition;
        this.secondWinningCondition = props.secondWinningCondition;
        this.firstFieldWin = LotteryAppStore.generateRandomArrNum(this.firstFieldRequire, this.firstFieldCount);
        this.secondFieldWin = LotteryAppStore.generateRandomArrNum(this.secondFieldRequire, this.secondFieldCount);
        this.gameState = "inProgress";
        this.firstField = LotteryAppStore.prepareField(this.firstFieldCount);
        this.secondField = LotteryAppStore.prepareField(this.secondFieldCount);
        this.isTicketWon = false;
        this.loadingState = {
            error: false,
            loading: false,
            message: '',
        };

        makeObservable(this);
    }

    /**
     * Получить массив фишек 1-го поля
     */
    public getFirstField = () => this.firstField;

    /**
     * Получить массив фишек 2-го поля
     */
    public getSecondField = () => this.secondField;

    /**
     * Получить количество выбранных фишек 1-го поля
     */
    public getFirstFieldSelectedCount = () => {
        return this.firstField.filter((el) => el.isActive).length;
    }

    /**
     * Получить количество выбранных фишек 2-го поля
     */
    public getSecondFieldSelectedCount = () => {
        return this.secondField.filter((el) => el.isActive).length;
    }

    /**
     * Получить состояние выигрыша билета
     */
    public getIsTicketWon = () => this.isTicketWon;

    /**
     * Получить состояние игры
     */
    public getGameState = () => this.gameState;

    /**
     * Получить состояние загрузки
     */
    public getLoadingState = () => this.loadingState;

    /**
     * Начать игру заново
     */
    public restartGame = () => {
        this.firstFieldWin = LotteryAppStore.generateRandomArrNum(this.firstFieldRequire, this.firstFieldCount);
        this.secondFieldWin = LotteryAppStore.generateRandomArrNum(this.secondFieldRequire, this.secondFieldCount);
        this.gameState = "inProgress";
        this.firstField = LotteryAppStore.prepareField(this.firstFieldCount);
        this.secondField = LotteryAppStore.prepareField(this.secondFieldCount);
        this.isTicketWon = false;
        this.loadingState = {
            error: false,
            loading: false,
            message: '',
        };
    }

    /**
     * Установить состояние выигрыша билета
     */
    @action
    public setIsTicketWon = (isTicketWon: boolean) => {
        this.isTicketWon = isTicketWon;
    }

    /**
     * Проверить билет на выигрыш
     */
    public validateWin = () => {
        // Получаем значения выбранных фишек
        const firstFieldSelected: number[] = LotteryAppStore.getSelectedNumbers(this.firstField);
        const secondFieldSelected: number[] = LotteryAppStore.getSelectedNumbers(this.secondField);

        // Получаем количество совпавших выбранных значений с выигрышными
        const firstFieldMatch = LotteryAppStore.compareArrays(firstFieldSelected, this.firstFieldWin);
        const secondFieldMatch = LotteryAppStore.compareArrays(secondFieldSelected, this.secondFieldWin);

        // Проверяем условия выигрыша
        if (firstFieldMatch >= this.firstWinningCondition.firstField) {
            this.setIsTicketWon(true);
        }

        if ((firstFieldMatch >= this.secondWinningCondition.firstField) && secondFieldMatch) {
            this.setIsTicketWon(true);
        }

        this.setGameState("over");
    }

    /**
     * Отправить результат
     */
    public sendResult = async () => {
        try {
            this.setLoadingState({ error: false, loading: true, message: '' });

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
                body: JSON.stringify(data),
            });

            // Расскомментировать, если нужно убедиться, что в UI есть обработка успешной отправки
            // const response = {
            //     status: 200
            // }

            // Сделаем вид, что все статусы, кроме 200-го, это ошибка
            if (response.status !== 200) {
                throw new Error("Ошибка при отправке результата");
            } else {
                this.setLoadingState({ error: false, loading: false, message: "Результат успешно опубликован" });
            }
        } catch (error) {
            if (typeof error === 'string') {
                this.setLoadingState({ error: true, loading: false, message: error });
            } else if (error instanceof Error) {
                this.setLoadingState({ error: true, loading: false, message: error.message });
            } else {
                this.setLoadingState({ error: true, loading: false, message: "Неизвестная ошибка при отправке результата" });
            }
        }
    }

    /**
     * Выбрать случайные фишки
     */
    @action
    public selectRandom = () => {
        // Сбрасываем значения полей
        this.firstField = LotteryAppStore.prepareField(this.firstFieldCount);
        this.secondField = LotteryAppStore.prepareField(this.secondFieldCount);

        // Получаем случайные выбранные значения для полей
        const firstFieldNumbers = LotteryAppStore.generateRandomArrNum(this.firstFieldRequire, this.firstFieldCount);
        const secondFieldNumbers = LotteryAppStore.generateRandomArrNum(this.secondFieldRequire, this.secondFieldCount);

        // Проставляем выбранные значения соответственно случайно сгенерированным
        this.firstField = this.firstField.map((el) => {
            if (firstFieldNumbers.includes(el.value)) {
                return {
                    ...el,
                    isActive: true,
                };
            }

            return el;
        })

        this.secondField = this.secondField.map((el) => {
            if (secondFieldNumbers.includes(el.value)) {
                return {
                    ...el,
                    isActive: true,
                };
            }

            return el;
        })
    }

    /**
     * Активировать/деактивировать фишку 1-го поля
     * @param value Значение фишки
     */
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

    /**
     * Активировать/деактивировать фишку 2-го поля
     * @param value Значение фишки
     */
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

    /**
     * Установить состояние загрузки
     */
    @action
    private setLoadingState = (loadingState: LoadingState) => {
        this.loadingState = loadingState;
    }

    /**
     * Установить состояние игры
     */
    @action
    private setGameState = (gameState: GameState) => {
        this.gameState = gameState;
    }

    /**
     * Получить выбранные фишки
     */
    private static getSelectedNumbers = (field: FieldItem[]) => {
        const selectedFields = field.filter((el) => el.isActive);

        return selectedFields.map((fieldEl) => fieldEl.value);
    }

    /**
     * Первичное заполнение поля
     */
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

    /**
     * Генерация массива случайных значений
     * @param requireCount Сколько необходимо выбрать фишек
     * @param maxValue Максимальное значение фишки
     */
    private static generateRandomArrNum = (requireCount: number, maxValue: number) => {
        const result: number[] = [];

        while (result.length < requireCount) {
            const randomNum = Math.floor(Math.random() * maxValue) + 1;

            if (!result.includes(randomNum)) {
                result.push(randomNum);
            }
        }

        return result;
    }

    /**
     * Сравнение массивов для матчинга выбранных значений с выигрышными
     */
    private static compareArrays = (firstArray: number[], secondArray: number[]) => {
        let result = 0;

        firstArray.forEach((firstEl) => {
            secondArray.forEach((secondEl) => {
                if (firstEl === secondEl) {
                    result++;
                }
            })
        });

        return result;
    }
}

export default LotteryAppStore;