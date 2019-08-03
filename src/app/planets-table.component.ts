import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Table, TableDescription, HlcClrTableComponent } from '@ng-holistic/clr-list';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SWAPIService } from './swapi.service';
import { AppModels } from './app.models';

// Provide table UI definition in js object
const definition: Table.Definition = {
  cols: [
    {
      id: 'name',
      title: 'Name',
      sort: true
    },
    {
      id: 'population',
      title: 'Population',
      sort: false
    }
  ],
  selectedRows: []
};

@Component({
  selector: 'my-planets-table',
  template: '<hlc-clr-table (selectedRowsChanged)="onSelectedRowsChanged($event)" [definition]="definition" [dataProvider]="dataProvider"></hlc-clr-table>',
  styleUrls: ['./palnets-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class TableComponent {
  readonly definition = definition;
  readonly dataProvider: Table.Data.DataProvider;
  @ViewChild(HlcClrTableComponent, { static: true }) tableComponent: HlcClrTableComponent;

  constructor(swapi: SWAPIService) {
    this.dataProvider = {
      load(state: any) {
        return swapi.planets(state).pipe(
          tap(console.log),
          catchError(err => {
            return throwError('SWAPI return error');
          })
        );
      }
    };
  }

  onSelectedRowsChanged(selectedRows: AppModels.Planet[]) {
    console.log('Selected rows', selectedRows);
  }
}
