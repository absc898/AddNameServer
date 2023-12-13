import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AddNameServerComponent } from './add-name-server/add-name-server.component';
import { MatTable, MatTableModule } from '@angular/material/table';
import { NameServer } from './name-server';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AddNameServerComponent, FormsModule, MatTableModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  @ViewChild(MatTable) table: MatTable<any> | undefined;
  
  displayedColumns: string[] = ['hostName', 'ipAddress', 'action'];
  title = 'addNameServer';
  nameservers: NameServer[] = [];

  ngOnInit(): void {
    this.getData();
  };

  getData() {
    this.nameservers = JSON.parse(localStorage.getItem("nameservers") || '{}');
    this.table?.renderRows();
  };

  deleteNameServer(element: any) {
    if(this.nameservers) {
      const index = this.nameservers.indexOf(element);
      if (index > -1) {
        this.nameservers.splice(index, 1);
        localStorage.setItem("nameservers", JSON.stringify(this.nameservers));
        this.table?.renderRows();
      }
    }
  };
}
