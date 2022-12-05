import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Apollo } from "apollo-angular";
import { PUBLIC_REPO_DETAILS } from "../../graphql/graphql.queries";
import {  of } from "rxjs";
import { map } from "rxjs/operators";
import moment from "moment";

@Component({
  selector: "app-repo-details",
  templateUrl: "./repo-details.component.html",
  styleUrls: ["./repo-details.component.scss"],
})
export class RepoDetailsComponent implements OnInit {
  repository: any;
  token: any[] = [];
  error: any;
  issues: any[] = [];
  labels: any;
  sidePanelProp: any;
  resp_issues = "";
  endCursor = "";
  repoName = "";
  repoOwnerName = "";
  loading = of(false);

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.repoName = this.route.snapshot.paramMap.get("repoName") || "";
    this.repoOwnerName = this.route.snapshot.paramMap.get("owner") || "";
    this.getRepositoryDetails(this.repoName, this.repoOwnerName);
  }

  getRepositoryDetails(name?: string, owner?: string) {
    this.issues = [];
    this.labels;
    this.loading = of(true);
    this.sidePanelProp;
    this.apollo
      .watchQuery({
        query: PUBLIC_REPO_DETAILS,
        errorPolicy: "all",
        variables: {
          name,
          owner,
        },
      })
      .valueChanges.pipe(
        map((result: any) => {
          return result;
        })
      )
      .subscribe(({ data }: any) => {
        this.repository = data.repository;
        this.loading = of(false);
        this.error = null;
        this.sidePanelProp = data.repository;
        this.labels = data.repository.labels.edges;
        this.issues = data.repository.issues.edges.map((repo: any) => {
          return {
            ...repo,
            node: {
              ...repo.node,
              createdAt: this.convertDateToNow(repo.node.createdAt),
              updatedAt: this.convertDateToNow(repo.node.updatedAt),
            },
          };
        });
      });
  }

  convertDateToNow(date: string): string {
    return moment(date).fromNow();
  }

  backToAuth() {
    this.router.navigate(["/token"]);
  }
}
