import { Component, Input } from '@angular/core';


@Component({
    selector: 'app-dialog',
    templateUrl: 'dialog.component.html',
    styles: [`.overlay {
        height: 100%;
    width: 100%;
    top: 0;
    right: 0;
    position: absolute;
    padding: 0;
    margin: 0;
    background-color: rgba(222, 222, 222, 0.45);
    }`]
})
export class Dialog {
    visible: boolean = false;

    constructor() {
    }

    public show() {
        console.log('show');
        this.visible = true;
    }

    public hide() {
        this.visible = false;
    }
}