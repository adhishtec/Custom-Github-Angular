import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RepoDetailsComponent } from "./repo-details.component";
import {
  ApolloTestingModule,
  ApolloTestingController,
} from "apollo-angular/testing";
import { RouterTestingModule } from "@angular/router/testing";

describe("RepodetailsComponent", () => {
  let component: RepoDetailsComponent;
  let fixture: ComponentFixture<RepoDetailsComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule, RouterTestingModule],
      declarations: [RepoDetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
