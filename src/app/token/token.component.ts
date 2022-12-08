import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { GraphQLService } from "../services/graph-ql.service";

@Component({
  selector: "app-token",
  templateUrl: "./token.component.html",
  styleUrls: ["./token.component.scss"],
})
export class TokenComponent implements OnInit {
  token: any[] = [];
  error: any;
  loading = true;

  tokenForm = new FormGroup({
    token: new FormControl("", Validators.required),
  });

  constructor(private router: Router, private graphQLService: GraphQLService) {}

  ngOnInit(): void {
    console.log("ngOnInit", this.tokenForm);
    sessionStorage.removeItem("github_token");
  }

  addToken() {
    this.loading = true;
    sessionStorage.setItem(
      "github_token",
      this.tokenForm.controls["token"].value
    );
    console.log("addToken", this.tokenForm);
    this.graphQLService.validateToken().subscribe(
      ({ data }: any) => {
        this.loading = false;
        this.tokenForm.reset();
        if (data) {
          this.router.navigate(["/repositories"]);
        } else {
          sessionStorage.removeItem("github_token");
        }
      },
      (error) => {
        this.loading = false;
        this.error = error;
        sessionStorage.removeItem("github_token");
        this.tokenForm.reset();
      }
    );
  }
}
