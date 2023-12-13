import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNameServerComponent } from './add-name-server.component';

describe('AddNameServerComponent', () => {
  let component: AddNameServerComponent;
  let fixture: ComponentFixture<AddNameServerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNameServerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddNameServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('AddNameServerComponent', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('should add one website to localstorage', () => {
      spyOn(component.refreshTable, 'emit');
      component.nameServersText = "ns1.test.uk: 123.123.123.123";

      //Improvement - do a on click event on the button itself is a better test
      component.addNameServer();
      const nameServers = JSON.parse(localStorage.getItem("nameservers") || '{}');
      expect(nameServers).toEqual([{hostName: "ns1.test.uk", ipAddress: "123.123.123.123"}]);
      expect(component.refreshTable.emit).toHaveBeenCalled();
    });

    it('should add three websites to localstorage', () => {
      spyOn(component.refreshTable, 'emit');
      component.nameServersText = "ns1.test.uk: 123.123.123.123 \n hf4.test.com: 123.123.123.123 \n ns1.test.co.uk: 123.123.123.123";

      component.addNameServer();
      const nameServers = JSON.parse(localStorage.getItem("nameservers") || '{}');
      expect(nameServers).toEqual([{ hostName: "ns1.test.uk", ipAddress: "123.123.123.123" }, 
                                    { hostName: 'hf4.test.com', ipAddress: '123.123.123.123' },
                                    { hostName: 'ns1.test.co.uk', ipAddress: '123.123.123.123' }]);
      expect(component.refreshTable.emit).toHaveBeenCalled();
    });

    it('should not add any data when textarea is empty', () => {
      spyOn(component.refreshTable, 'emit');
      component.nameServersText = "";

      component.addNameServer();
      const nameServers = JSON.parse(localStorage.getItem("nameservers") || '{}');
      expect(nameServers).toEqual({});
      expect(component.refreshTable.emit).not.toHaveBeenCalled();
    });

    it('should not add any duplicate data', () => {
      spyOn(component.refreshTable, 'emit');
      component.nameServersText = "ns1.test.uk: 123.123.123.123";
      component.addNameServer();
      let nameServers = JSON.parse(localStorage.getItem("nameservers") || '{}');
      expect(nameServers).toEqual([{hostName: "ns1.test.uk", ipAddress: "123.123.123.123"}]);
      expect(component.refreshTable.emit).toHaveBeenCalled();

      component.nameServersText = "ns1.test.uk: 123.123.123.123";
      component.addNameServer();
      nameServers = JSON.parse(localStorage.getItem("nameservers") || '{}');
      //Improvement here if we can not re-call adding data when only duplicates found
      expect(component.refreshTable.emit).toHaveBeenCalled();
    });

    it('should not add data when in valid host name', () => {
      spyOn(component.refreshTable, 'emit');
      component.nameServersText = "ns1.test.uk-d43$: 123.123.123.123";

      component.addNameServer();
      const nameServers = JSON.parse(localStorage.getItem("nameservers") || '{}');
      expect(nameServers).toEqual({});
      expect(component.refreshTable.emit).not.toHaveBeenCalled();
    });

    it('should not add data when invalid IP Address', () => {
      spyOn(component.refreshTable, 'emit');
      component.nameServersText = "ns1.test.uk: 123.123.123.123-d435";

      //Improvement - do a on click event on the button itself is a better test
      component.addNameServer();
      const nameServers = JSON.parse(localStorage.getItem("nameservers") || '{}');
      expect(nameServers).toEqual({});
      expect(component.refreshTable.emit).not.toHaveBeenCalled();
    });

  });

});
