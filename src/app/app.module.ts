import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { GraphQLModule } from "./graphql.module";
import { HttpClientModule } from "@angular/common/http";
import { ReposComponent } from "./repos/repos.component";
import { RepoDetailsComponent } from "./repos/repo-details/repo-details.component";
import { TokenComponent } from "./token/token.component";

@NgModule({
  declarations: [
    AppComponent,
    TokenComponent,
    ReposComponent,
    RepoDetailsComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
