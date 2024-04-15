import { action, makeObservable, observable } from "mobx";

class LotteryAppStore {

    @observable
    private firstField: Set<number>;

    @observable
    private secondField: Set<number>;

    constructor() {
        this.firstField = new Set();
        this.secondField = new Set();

        makeObservable(this);
    }

    public getFirstField = () => this.firstField;

    public getSecondField = () => this.secondField;

    @action
    public toggleFirstFieldValue = (value: number) => {
        if (!this.firstField.has(value)) {
            this.firstField.add(value);
        } else {
            this.firstField.delete(value);
        }
    }

    @action
    public toggleSecondFieldValue = (value: number) => {
        if (!this.secondField.has(value)) {
            this.secondField.add(value);
        } else {
            this.secondField.delete(value);
        }
    }
}

export default LotteryAppStore;