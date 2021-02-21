import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { Audit } from '@/_models';
import { AuditService, AuthenticationService } from '@/_services';

import * as moment from 'moment';

@Component({ templateUrl: 'audit.component.html' })
export class AuditComponent implements OnInit {
    showgrid = false;
    columnDefs = [];
    rowData = [];
    rowNode;
    hoursformat = 12;
    audits = [];
    dropDownValue;
    onChange(deviceValue) {
        this.showgrid = false;
        this.dropDownValue = deviceValue
        if (this.dropDownValue == 12) {
            this.columnDefs = [];
            this.rowData = [];
            this.loadAllAudits(this.dropDownValue);
        } else {
            this.columnDefs = [];
            this.rowData = [];
            this.loadAllAudits(this.dropDownValue);
        }
    }
    constructor(
        private authenticationService: AuthenticationService,
        private auditService: AuditService,
    ) {
    }
    ngOnInit() {
        this.loadAllAudits(this.hoursformat);
    }
    private loadAllAudits(format) {
        this.auditService.getAll()
            .pipe(first())
            .subscribe(audits => {
                var data = audits;
                var colHeaders = Object.keys(data[0]);
                for (var i = 0; i < colHeaders.length; i++) {
                    this.columnDefs.push({ field: colHeaders[i], sortable: true, filter: true });
                }
                for (var j = 0; j < data.length; j++) {
                    if (format == 12) {
                        var loginTime = parseInt(data[j].loginTime);
                        var loginTimeConversion = moment(loginTime).format("DD-MMM-YYYY  h:mm:ss a");
                        var logoutTime = parseInt(data[j].logoutTime);
                        var logoutTimeConversion = moment(logoutTime).format("DD-MMM-YYYY h:mm:ss a");
                    }
                    else {
                        var loginTime = parseInt(data[j].loginTime);
                        var loginTimeConversion = moment(loginTime).format("DD-MMM-YYYY HH:mm:ss");
                        var logoutTime = parseInt(data[j].logoutTime);
                        var logoutTimeConversion = moment(logoutTime).format("DD-MMM-YYYY HH:mm:ss");
                    }
                    this.rowData.push({
                        "_id": data[j]["_id"],
                        "user": data[j].user,
                        "loginTime": loginTimeConversion,
                        "logoutTime": logoutTimeConversion,
                        "ip": data[j].ip,
                        "__v": data[j]["__v"],
                        "id": data[j].id
                    })
                }
                setTimeout(() => { this.showgrid = true; }, 10);
            });



    }

}