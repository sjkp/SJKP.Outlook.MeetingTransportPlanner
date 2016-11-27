import { Component, NgZone, ViewChild } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AppState } from '../app.service';
import { Dialog} from '../dialog';


class Meeting {
    constructor(public start?: Date, public end?: Date) {
    }
}


@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'book',  // <home></home>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  providers: [
  ],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: [ './book.component.css' ],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './book.component.html'
})
export class BookComponent {
    subject: string;
    saveInProgress: boolean = false;
    beforeMeeting: boolean = true;
    length: number;
    origin: string;
    meetingLocation: string;
    destination: string;
    recipients: string;
    saveComplete: boolean = false;
    originalMeeting: Meeting;
    estimateDrivingTimeError: boolean = false;
    inprogress: boolean = false;

    @ViewChild(Dialog) dialog: Dialog;

  // TypeScript public modifiers
  constructor(private ngZone: NgZone, private http: Http, public appState: AppState) {
    this.originalMeeting = new Meeting();
  }

  ngOnInit() {
    this.recipients = Office.context.mailbox.userProfile.emailAddress;

        if ((<any>Office.context.mailbox).GetIsRead()) {
            //Read mode
            let appointment = Office.cast.item.toAppointmentRead(Office.context.mailbox.item);
            this.originalMeeting.start = appointment.start;
            this.originalMeeting.end = appointment.end;
            this.ngZone.run(() => {
                this.meetingLocation = appointment.location;
                this.subject = 'Transport for ' + appointment.subject; 
                this.toggleMeetingLocation(this.beforeMeeting);
            });
        }
        else {

            let appointment = Office.cast.item.toAppointmentCompose(Office.context.mailbox.item);
            appointment.start.getAsync(res => {                
                this.originalMeeting.start = res.value;
            });
            appointment.end.getAsync(res => {
                this.originalMeeting.end = res.value;
            });
            appointment.subject.getAsync((res) => {
                this.ngZone.run(() => this.subject = 'Transport for ' + res.value);

            });

            appointment.location.getAsync((res) => {
                this.ngZone.run(() => {
                    this.meetingLocation = res.value;
                    this.toggleMeetingLocation(this.beforeMeeting);
                });
            });
        }
  }

  search() {        
      if (!this.origin || !this.destination) 
      {          
          return;
      }
      this.inprogress = true;
        this.estimateDrivingTimeError = false;
        var appendTime = "&departure=" + Math.floor(this.originalMeeting.end.getTime() / 1000);
        if (this.beforeMeeting) {
            appendTime = "&arrival=" + Math.floor(this.originalMeeting.start.getTime() / 1000);
        }

        this.http.get('https://transportplanner.azurewebsites.net/api/distance?origin=' + encodeURIComponent(this.origin) + '&destination=' + encodeURIComponent(this.destination) + appendTime).subscribe(res => {
            this.inprogress = false;            
            var json = res.json();            
            if (json.routes.length == 0) {
                this.estimateDrivingTimeError = true;
                return;
            }
            this.length = Math.round(json.routes[0].legs[0].duration.value / 60);
            this.destination = json.routes[0].legs[0].end_address;
            this.origin = json.routes[0].legs[0].start_address;
        });
    }

    onChangeBeforeMeeting() {

        this.toggleMeetingLocation(!this.beforeMeeting);
    }

    toggleMeetingLocation(b) {
        if (b) {
            this.origin = this.destination;
            this.destination = this.meetingLocation;
            
        } else {
            this.destination = this.origin;
            this.origin = this.meetingLocation;            
        }
    }

    create() {
        this.saveInProgress = true;
        var body = "";
        if (this.beforeMeeting) {
            var newStart = new Date(this.originalMeeting.start.getTime());
            newStart.setMinutes(this.originalMeeting.start.getMinutes() - this.length);
            body = this.createAppointment(newStart, this.originalMeeting.start, this.subject);
        } else {
            var newEnd = new Date(this.originalMeeting.end.getTime());
            newEnd.setMinutes(this.originalMeeting.end.getMinutes() + this.length);
            body = this.createAppointment(this.originalMeeting.end, newEnd, this.subject);
        }
        
         
        Office.context.mailbox.makeEwsRequestAsync(body, res => {            
            this.ngZone.run(() => {
                this.saveComplete = true;
                this.saveInProgress = false;
            });
        });
    }

    dismissSaveComplete() {
        this.saveComplete = false;
    }

    createAppointment(start: Date, end: Date, subject: string) {
        var location = (this.beforeMeeting ? this.origin : this.destination);
        if (typeof (location) == 'undefined') {
            location = "";
        }

        var attendees = '';
        this.recipients.split(/,|;| /).forEach(email => {
            attendees += '<Attendee><Mailbox><EmailAddress>' + email + '</EmailAddress></Mailbox></Attendee>';
        });

        var result = '<?xml version="1.0" encoding="utf-8"?>' +
            '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
            ' xmlns:xsd="http://www.w3.org/2001/XMLSchema"' +
            ' xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"' +
            ' xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types">' +
            '  <soap:Header>' +
            '    <RequestServerVersion Version="Exchange2013" xmlns="http://schemas.microsoft.com/exchange/services/2006/types" soap:mustUnderstand="0" />' +
            '  </soap:Header>' +
            '<soap:Body>' +
            '<CreateItem xmlns="http://schemas.microsoft.com/exchange/services/2006/messages"' +
            ' xmlns:t="http://schemas.microsoft.com/exchange/services/2006/types"' +
            ' SendMeetingInvitations="SendToAllAndSaveCopy" >' +
            '<SavedItemFolderId>' +
            '<t:DistinguishedFolderId Id="calendar"/>' +
            '</SavedItemFolderId>' +
            '<Items>' +
            '<t:CalendarItem xmlns="http://schemas.microsoft.com/exchange/services/2006/types">' +
            '<Subject>' + subject + '</Subject>' +
            '<Body BodyType="Text"></Body>' +
            '<ReminderIsSet>true</ReminderIsSet>' +
            '<ReminderMinutesBeforeStart>60</ReminderMinutesBeforeStart>' +
            '<Start>' + start.toISOString() + '</Start>' +
            '<End>' + end.toISOString() + '</End>' +
            '<IsAllDayEvent>false</IsAllDayEvent>' +
            '<LegacyFreeBusyStatus>Busy</LegacyFreeBusyStatus>' +
            '<Location>' + location + '</Location>' +
            '<RequiredAttendees>' + attendees +            
            '</RequiredAttendees>' +
            '</t:CalendarItem>' +
            '</Items>' +
            '</CreateItem>' +
            '</soap:Body>' +
            '</soap:Envelope>';
        return result;
    }


}
