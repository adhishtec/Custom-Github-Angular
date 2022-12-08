import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { map } from "rxjs/operators";
import moment from "moment";
import { GraphQLService } from "../services/graph-ql.service";
import { Cursor, RepositoryNode } from "../interfaces/github";

@Component({
  selector: "app-repos",
  templateUrl: "./repos.component.html",
  styleUrls: ["./repos.component.scss"],
})
export class ReposComponent implements OnInit {
  error: Error = new Error();
  loading = of(false);
  repos: RepositoryNode[] = [];
  startCursor = "";
  endCursor = "";
  totalRepoCount = 0;
  pageNumber = 1;
  isPreviousDisabled = true;
  isNextDisabled = false;

  constructor(private router: Router, private graphQLService: GraphQLService) {}

  ngOnInit(): void {
    this.getRepositories();
  }

  getRepositories({ startCursor, endCursor }: Cursor = {}) {
    this.loading = of(true);
    this.graphQLService
      .publicRepository({ startCursor, endCursor })
      .pipe(
        map((result: any) => {
          this.startCursor = result.data.search.pageInfo.endCursor;
          this.endCursor = result.data.search.pageInfo.startCursor;
          return result;
        })
      )
      .subscribe(
        ({ data }: any) => {
          this.loading = of(false);
          this.error = new Error();
          this.totalRepoCount = data.search.repositoryCount;
          this.checkPreviousOrNextDisabled();
          const nextResult = data.search.edges.map((repo: any) => {
            return {
              ...repo,
              node: {
                ...repo.node,
                createdAt: this.convertDateToNow(repo.node.createdAt),
                updatedAt: this.convertDateToNow(repo.node.updatedAt),
                languages: repo.node.languages.edges.map(
                  (language: any) => language.node.name
                ),
              },
            };
          });
          this.repos = [...this.repos, ...nextResult];
        },

        (error) => {
          this.loading = of(false);
          this.error = error;
        }
      );
  }

  onNextClick() {
    this.pageNumber = this.pageNumber + 1;
    this.checkPreviousOrNextDisabled();
    this.getRepositories({ startCursor: this.startCursor });
  }

  onPreviousClick() {
    this.pageNumber = this.pageNumber - 1;
    this.checkPreviousOrNextDisabled();
    this.getRepositories({ endCursor: this.endCursor });
  }

  checkPreviousOrNextDisabled() {
    this.isNextDisabled =
      this.pageNumber === Math.ceil(this.totalRepoCount / 10);
    this.isPreviousDisabled = this.pageNumber === 1;
  }

  convertDateToNow(date: string): string {
    return moment(date).fromNow();
  }
  backToAuth() {
    this.router.navigate(["/token"]);
  }

  onRepoClick(repo: any) {
    const nameWithOwner = repo.node?.nameWithOwner.split("/");
    this.router.navigate([
      `/repositories/${nameWithOwner[0]}/${nameWithOwner[1]}`,
    ]);
  }

  onScroll() {
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@scrolled!!");
    this.onNextClick();
  }
}
