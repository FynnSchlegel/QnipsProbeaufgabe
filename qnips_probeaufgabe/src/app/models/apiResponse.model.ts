import { IAllergen } from "./allergen.model";
import { IProduct } from "./product.model";
import { IRow } from "./row.model";

export interface IApiResponse {
  Allergens: { [key: string]: IAllergen[] };
  Products: IProduct [];
  Rows: IRow[];
}