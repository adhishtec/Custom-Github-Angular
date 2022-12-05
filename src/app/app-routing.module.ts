import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RepoDetailsComponent } from "./repos/repo-details/repo-details.component";
import { ReposComponent } from "./repos/repos.component";
import { TokenComponent } from "./token/token.component";
import { AuthGuardGuard } from "./auth-guard.guard";

const routes: Routes = [
  { path: "", redirectTo: "token", pathMatch: "full" },
  { path: "token", component: TokenComponent },
  {
    path: "repositories",
    component: ReposComponent,
    canActivate: [AuthGuardGuard],
  },
  {
    path: "repositories/:owner/:repoName",
    component: RepoDetailsComponent,
    canActivate: [AuthGuardGuard],
  },
  { path: "**", redirectTo: "token" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
