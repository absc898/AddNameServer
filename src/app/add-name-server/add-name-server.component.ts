import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NameServer } from '../name-server';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-name-server',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-name-server.component.html',
  styleUrl: './add-name-server.component.css',
  encapsulation: ViewEncapsulation.None
})

export class AddNameServerComponent {
  @Output()
  refreshTable = new EventEmitter();

  public nameServersText: string = "";
  existingEntities: NameServer[] = []

  addNameServer() {
    this.existingEntities = JSON.parse(localStorage.getItem("nameservers") || '[]');
    if(this.nameServersText || this.nameServersText.length !== 0) {
      var inputArray = this.nameServersText.split('\n');
      inputArray.forEach((item, index) => {
        this.addNameServerEntity(item);
      });
      this.addToLocalStorage();
    }
  };

  addNameServerEntity (entity: string) {
    const entitySplit = entity.split(":");
    if(entitySplit.length === 2) {
      var domainName = entitySplit[0].trim();
      var ipAddress = entitySplit[1].trim();
      if(this.validateDomainName(domainName) && this.validateIPaddress(ipAddress)) {
        const entityToAdd: NameServer = {hostName: domainName, ipAddress: ipAddress};
        if(this.doesEntityNotExists(entityToAdd)) {
          this.existingEntities.push(entityToAdd);
        } else {
          alert("Duplicate found, please remove: " + JSON.stringify(entityToAdd));
        }
      }
    } else {
      alert("Invalid format");
    }
  };

  doesEntityNotExists(entity: NameServer) {
    if (!this.existingEntities?.some((item: NameServer) => item.hostName === entity.hostName)) {
      return true;
    }
    return false;
  };

  addToLocalStorage() {
    if(this.existingEntities.length > 0) {
      //TODO: Improvement here as it will re-add the ones if we just added one duplication 
      localStorage.setItem("nameservers", JSON.stringify(this.existingEntities));
      this.refreshTable.emit();
      this.existingEntities = [];
      this.nameServersText = "";
    }
  };

  validateIPaddress(ipaddress: string) {  
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
      return true;
    }  
    alert("You have entered an invalid IP address!");
    return false;
  };
  
  validateDomainName(domain: string) {
    if (/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(domain)) {
      return true;
    }
    alert("You have entered an invalid Domain name!");
    return false;
  };
}


