import {Component, OnInit} from '@angular/core';
import {CsvService} from "../csv.service";
import {FormControl} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";


@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css'],

})
export class OnboardingComponent implements OnInit{
  eamsAppIdFormControl = new FormControl('');
  eamsAppNameFormControl = new FormControl('');
  eamsAppAcronymsFormControl = new FormControl('');
  appHostingEnvFormControl = new FormControl('');
  cicdToolFormControl:any;


  uuid: string | null = null;
  json: any[]  = [];

  eamsAppIds: any[] = [];
  filteredeEamsAppIds: Observable<string[]> = new Observable<string[]>();
  selectedEamsAppId:string |null = null;

  eamsAppNames : string[] = [];
  filteredEamsAppNames: Observable<string[]> = new Observable<string[]>();
  selectedEamsAppName:string | null = null;


  eamsAppAcronyms: string[] = [];
  filteredEamsAppAcronyms :Observable<string[]> = new Observable<string[]>();
  selectedEamsAppAcronym:string | null = null;

  appHostingEnvs: string[] = [];
  filteredappHostingEnvs:Observable<string[]> = new Observable<string[]>();
  selectedappHostingEnv:string | null = null;

  cicdTools:string[] = [];

constructor(private csvService  : CsvService) {
this.generateUuid();
this.loadCsvData();

}

  ngOnInit() {
    this.autoCompleteEamsAppIds();
    this.autoCompleteEamsAppNames();
    this.autoCompleteEamsAppAcronyms();
    this.autoCompleteAppHostingEnvs();
  }
  //Gettting EamsAppIds when user starts typing
  private autoCompleteEamsAppIds(){
    this.filteredeEamsAppIds = this.eamsAppIdFormControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterEamsAppIds(value || '')),
    );
  }
   private _filterEamsAppIds(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.eamsAppIds.filter(option => option.toLowerCase().includes(filterValue));
  }

  //Filtering EamsAppNames for autocompletion
  private autoCompleteEamsAppNames(){
    this.filteredEamsAppNames = this.eamsAppNameFormControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterEamsAppNames(value || '')),
    );
  }
  private _filterEamsAppNames(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.eamsAppNames.filter(option => option.toLowerCase().includes(filterValue));
  }

  private autoCompleteEamsAppAcronyms(){
    this.filteredEamsAppAcronyms = this.eamsAppAcronymsFormControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterEamsAppAcronyms(value || '')),
    );
  }
  private _filterEamsAppAcronyms(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.eamsAppAcronyms.filter(option => option.toLowerCase().includes(filterValue));
  }

  private autoCompleteAppHostingEnvs(){
    this.filteredappHostingEnvs = this.appHostingEnvFormControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filterAppHostingEnvs(value || '')),
    );
  }
  private _filterAppHostingEnvs(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.appHostingEnvs.filter(option => option.toLowerCase().includes(filterValue));
  }

  generateUuid(): void {
    this.uuid = "DORA" + Date.now();
  }

  //Loading CSV Data and Converting it to JSON and reading JSON values and adding them to required variables for autocompletion;

  async loadCsvData() : Promise<any> {
    const csvFilePath = 'assets/Data.csv';

    this.csvService.getCsvData(csvFilePath).subscribe(csvData => {
      this.json =  this.csvService.parseCsvToJson(csvData);
      console.log(this.json);
      if (this.json && this.json.length > 0) {
        this.eamsAppIds = this.json.map((entry) => entry.eamsAppId);
        this.eamsAppNames = this.json.map((entry) => entry.eamsAppName);
        this.eamsAppAcronyms = this.json.map((entry) => entry.eamsAppAcronym);
        this.appHostingEnvs = this.json.map((entry) => entry.appHostingEnv);
        this.cicdTools = this.json.map((entry) => entry.cicdTool);

        console.log('eamsAppIds:', this.eamsAppIds);
        console.log('eamsAppName', this.eamsAppNames);
        console.log('eamsAppAcronym', this.eamsAppAcronyms);
        console.log('appHostingEnvs', this.appHostingEnvs);
        console.log('CI CD tools', this.cicdTools);
      }
    });

  }


}
