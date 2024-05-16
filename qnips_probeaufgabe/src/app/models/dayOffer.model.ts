import { IAngebot } from "./angebot.model";

export interface IDayOffer {
    CalenderWeek: number;
    Day: string;
    Date: string;
    Angebot: IAngebot[];
}