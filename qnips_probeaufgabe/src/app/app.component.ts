import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './api/apiService';
import { IAllergen } from './models/allergen.model';
import { IApiResponse } from './models/apiResponse.model';
import { IProduct } from './models/product.model';
import { IRow } from './models/row.model';
import { IDayOffer } from './models/dayOffer.model';
import { IDaysModel } from './models/days.model';
import { IAktion } from './models/aktion.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  providers: [ApiService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent implements OnInit {
  allergens: { [key: string]: IAllergen[] } = {};
  products: IProduct[] = [];
  rows: IRow[] = [];
  dayOffer: IDayOffer[] = [];
  Dates: IDaysModel[] = [
    { Name: 'Montag', Date: "" },
    { Name: 'Dienstag', Date: "" },
    { Name: 'Mittwoch', Date: "" },
    { Name: 'Donnerstag', Date: "" },
    { Name: 'Freitag', Date: "" }
  ];
  currentDate = new Date();

  constructor(private apiService: ApiService) { }

  async ngOnInit() {
    await this.getData();
  }

  private async getData() {
    this.apiService.get().subscribe((data: IApiResponse) => {
      this.allergens = data.Allergens;
      this.products = data.Products;
      this.rows = data.Rows;
      this.getDatesOfThisWeek()
      this.createDayOffer();
    });
  }

  private createDayOffer() {
    for (let i = 0; i < this.Dates.length; i++) {
      this.dayOffer[i] = {
        CalenderWeek: this.getCalenderWeek(this.currentDate),
        Day: this.Dates[i].Name,
        Date: this.Dates[i].Date,
        Aktion1: this.getEntity(0, i),
        Aktion2: this.getEntity(1, i),
        Salatbar: this.getEntity(2, i),
      };
    }
  }

  private getEntity(rowNumber: number, i: number): IAktion {
    let productNames: string = '';
    let allergens: string = '';
    let allergenValues;
    let price: string;

    const firstProduct = this.rows[rowNumber].Days[i].ProductIds[0].ProductId;
    if (firstProduct && this.products[firstProduct]) {
      productNames = this.products[firstProduct].Name
    }

    this.products[firstProduct].AllergenIds.forEach((element: string) => {
      allergenValues = Object.values(this.allergens[element]);
      if (allergenValues[1]) {
        if (allergens) {
          allergens += ", " + allergenValues[1];
        } else {
          allergens += allergenValues[1];
        }
      }
    });

    price = "" + this.products[firstProduct].Price.Betrag;

    if (price.includes('.')) {
      const parts = price.split('.');

      if (parts[1].length === 1) {
        price += '0';
      }
    }

    const aktion: IAktion = {
      Product: productNames,
      Allergens: allergens,
      Price: price,
    };

    return aktion;
  }

  getDatesOfThisWeek() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startDateOfWeek = new Date(today);

    startDateOfWeek.setDate(today.getDate() - (dayOfWeek === 1 ? 1 : dayOfWeek - 1));

    for (let i = 0; i < 5; i++) {
      const currentDate = new Date(startDateOfWeek);
      currentDate.setDate(startDateOfWeek.getDate() + i);
      this.Dates[i].Date = currentDate.toLocaleDateString('de-DE');
    }
}

  getCalenderWeek(inputDate: any) {
    const currentDate: any =
      (typeof inputDate === 'object') ? inputDate : new Date();
    const firstDayOfYear =
      new Date(currentDate.getFullYear(), 0, 1);
    const daysToNextMonday =
      (firstDayOfYear.getDay() === 1) ? 0 :
        (7 - firstDayOfYear.getDay()) % 7;
    const nextMonday: any =
      new Date(currentDate.getFullYear(), 0,
        firstDayOfYear.getDate() + daysToNextMonday);

    return (currentDate < nextMonday) ? 52 :
      (currentDate > nextMonday ? Math.ceil(
        (currentDate - nextMonday) / (24 * 3600 * 1000) / 7) : 1);
}
}