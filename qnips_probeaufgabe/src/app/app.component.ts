import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './api/apiService';
import { IAllergen } from './models/allergen.model';
import { IApiResponse } from './models/apiResponse.model';
import { IProduct } from './models/product.model';
import { IRow } from './models/row.model';
import { IDates } from './models/dates';
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

export class AppComponent implements OnInit, AfterViewInit {
  allergens: { [key: string]: IAllergen[] } = {};
  products: IProduct[] = [];
  rows: IRow[] = [];
  dates: IDates[] = [];
  dayContent: IAktion[] = [];
  maxFields: number = 0;
  idx: number = 0;
  DatesModel: IDaysModel[] = [
    { Weekday: 0, Name: 'Montag', Date: "" },
    { Weekday: 1, Name: 'Dienstag', Date: "" },
    { Weekday: 2, Name: 'Mittwoch', Date: "" },
    { Weekday: 3, Name: 'Donnerstag', Date: "" },
    { Weekday: 4, Name: 'Freitag', Date: "" },
    { Weekday: 5, Name: 'Samstag', Date: "" },
    { Weekday: 6, Name: 'Sonntag', Date: "" }
  ];
  currentDate = new Date();

  constructor(private apiService: ApiService) { }

  async ngOnInit() {
    await this.getData();
  }

  ngAfterViewInit() {
    this.dates = [];
  }

  private async getData() {
    this.apiService.get().subscribe((data: IApiResponse) => {
      this.allergens = data.Allergens;
      this.products = data.Products;
      this.rows = data.Rows;
      this.maxFields = this.rows.length * this.DatesModel.length;
      this.getDatesOfThisWeek()
      this.createDayOffer();
    });
  }

  getDayContent(weekday: number, row: IRow) {
    this.dayContent = [];

    row.Days.find((d) => d.Weekday == weekday)?.ProductIds.forEach(element => {
      if (element) {
        this.dayContent.push(this.getEntity(element.ProductId));
      }
    });
    this.idx = this.idx + 1;

    console.log(this.dayContent);
    return this.dayContent;
  }


  private createDayOffer() {
    for (let i = 0; i < this.DatesModel.length; i++) {
      this.dates[i] = {
        CalenderWeek: this.getCalenderWeek(this.currentDate),
        Day: this.DatesModel[i].Name,
        Date: this.DatesModel[i].Date
      };
    }
  }

  private getEntity(firstProduct: any): IAktion {
    let productNames: string = '';
    let allergens: string = '';
    let allergenValues;
    let price: string;

    if (firstProduct && this.products[firstProduct]) {
      productNames = this.products[firstProduct].Name
    } else {
      return {
        Product: '',
        Allergens: '',
        Price: ''
      };
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

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDateOfWeek);
      currentDate.setDate(startDateOfWeek.getDate() + i);
      this.DatesModel[i].Date = currentDate.toLocaleDateString('de-DE');
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