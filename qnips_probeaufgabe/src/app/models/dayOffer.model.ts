import { IAktion } from "./aktion.model";

export interface IDayOffer {
    CalenderWeek: number;
    Day: string;
    Date: string;
    Aktion1: IAktion;
    Aktion2: IAktion;
    Salatbar: IAktion
}