import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ReposComponent } from "./repos.component";
import { RouterTestingModule } from "@angular/router/testing";
import moment from "moment";
import { Router } from "@angular/router";

jest.mock("moment", () => {
  const mMoment = {
    fromNow: jest.fn().mockReturnValue("a day ago"),
  };
  return jest.fn(() => mMoment);
});

let mockRouter = {
  navigate: jest.fn(),
};

describe("ReposComponent", () => {
  let component: ReposComponent;
  let fixture: ComponentFixture<ReposComponent>;
  let router: Router;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule, RouterTestingModule],
      declarations: [ReposComponent],
      providers: [{ provide: Router, useValue: mockRouter }],
    }).compileComponents();
    fixture = TestBed.createComponent(ReposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should convertDateToNow return valid date format", () => {
    const date = component.convertDateToNow("2022-11-03T09:46:12Z");
    expect(date).toEqual("a day ago");
    expect(date).not.toEqual("a month ago");
    expect(moment).toHaveBeenCalled();
    expect(moment).toHaveBeenCalledTimes(1);
    expect(moment).toHaveBeenCalledWith("2022-11-03T09:46:12Z");
    expect(moment).not.toHaveBeenCalledTimes(2);
  });

  it("should check if onRepoClick is called correctly", () => {
    component.onRepoClick({
      node: {
        nameWithOwner: "comp/leanIX",
      },
    });

    expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith([
      "/repositories/comp/leanIX",
    ]);
  });

  it("should call getRepositories from onPreviousClick with correct arguments ", () => {
    component.getRepositories = jest.fn();
    component.endCursor = "last";
    component.onPreviousClick();
    expect(component.getRepositories).toHaveBeenCalledTimes(1);
    expect(component.getRepositories).toHaveBeenCalledWith({
      endCursor: "last",
    });
  });
});
