import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-groupsession",
  templateUrl: "./groupsession.component.html",
  styleUrls: ["./groupsession.component.scss"],
})
export class GroupsessionComponent implements OnInit {
  isOpenDialog: boolean;
  isEdit: boolean;

  constructor() {}

  ngOnInit() {}

  Add() {
    this.isOpenDialog = true;
  }
  update() {
    this.isOpenDialog = true;
    this.isEdit = true;
  }
}
