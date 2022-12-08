import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Apollo } from "apollo-angular";
import { PUBLIC_REPO_DETAILS } from "../../graphql/graphql.queries";
import { of } from "rxjs";
import { map } from "rxjs/operators";
import moment from "moment";
import { Cursor, IssueObj } from "src/app/interfaces/github";

@Component({
  selector: "app-repo-details",
  templateUrl: "./repo-details.component.html",
  styleUrls: ["./repo-details.component.scss"],
})
export class RepoDetailsComponent implements OnInit {
  repository: any;
  token: any[] = [];
  error: any;
  issues: IssueObj[] = [];
  labels: any;
  sidePanelProp: any;
  resp_issues = "";
  endCursor = "";
  startCursor = "";
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
    this.getRepositoryDetails({
      name: this.repoName,
      owner: this.repoOwnerName,
    });
  }

  getRepositoryDetails({ name, owner, startCursor, endCursor }: Cursor = {}) {
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
          startCursor,
          endCursor,
        },
      })
      .valueChanges.pipe(
        map((result: any) => {
          return result;
        })
      )
      .pipe(
        map((result: any) => {
          this.startCursor = result.data?.repository.issues.pageInfo?.endCursor;
          this.endCursor = result.data?.repository.issues.pageInfo.startCursor;
          console.log(
            ".....Start.....End.....",
            startCursor,
            ".......>>......>.....",
            endCursor
          );
          console.log("----------->", result);
          return result;
        })
      )

      .subscribe(({ data }: any) => {
        this.repository = data?.repository;
        this.loading = of(false);
        this.error = null;
        this.sidePanelProp = data.repository;
        this.labels = data.repository.labels.edges;

        const next = data.repository.issues.edges.map((repo: any) => {
          return {
            ...repo,
            node: {
              ...repo.node,
              createdAt: this.convertDateToNow(repo.node.createdAt),
              updatedAt: this.convertDateToNow(repo.node.updatedAt),
            },
          };
        });
        this.issues = [...this.issues, ...next];
        //   console.log(this.issues);
      });
  }

  convertDateToNow(date: string): string {
    return moment(date).fromNow();
  }

  backToAuth() {
    console.log("hello");
    this.router.navigate(["/token"]);
  }
  onScroll() {
    // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@scrolled!!");
    // console.log("........>>>>>>", this.startCursor);
    // console.log("........>>!!!!!!!!!>>>>", this.endCursor);
    this.getRepositoryDetails({
      name: this.repoName,
      owner: this.repoOwnerName,
      startCursor: this.startCursor,
    });
    // this.getRepositories();
  }
}
