import { Component, HostListener } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "angular-graphql";
  name = "GitHub";
  @HostListener("window:beforeunload", ["$event"])
  clearSessionStorage() {
    sessionStorage.clear();
  }
}
