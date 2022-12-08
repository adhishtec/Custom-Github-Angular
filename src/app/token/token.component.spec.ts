import { TestBed, ComponentFixture, async } from "@angular/core/testing";
import { TokenComponent } from "./token.component";
import { Router } from "@angular/router";
import {
  ApolloTestingModule,
  ApolloTestingController,
} from "apollo-angular/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { GraphQLService } from "../services/graph-ql.service";
import { of } from "rxjs";

// jest.mock("../services/graph-ql.service");
let store: any = {};
const mockSessionStorage = {
  getItem: (key: string): string => {
    return key in store ? store[key] : null;
  },
  setItem: (key: string, value: string) => {
    store[key] = `${value}`;
  },
  removeItem: (key: string) => {
    delete store[key];
  },
  clear: () => {
    store = {};
  },
};

describe("TokenComponent", () => {
  let component: TokenComponent;
  let fixture: ComponentFixture<TokenComponent>;
  let graphQLServiceMock: any;
  let router: any;
  Object.defineProperty(window, "sessionStorage", {
    value: mockSessionStorage,
  });

  beforeEach(() => {
    graphQLServiceMock = {
      validateToken: jest.fn(),
    };

    router = {
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [
        ApolloTestingModule,
        RouterTestingModule.withRoutes([
          { path: "repositories", component: TokenComponent },
        ]),
        ReactiveFormsModule,
      ],
      declarations: [TokenComponent],
      providers: [
        { provide: GraphQLService, useValue: graphQLServiceMock },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    if (fixture) {
      fixture.destroy();
    }
  });

  it("should load component ", () => {
    expect(component).toBeDefined();
  });

  it("Should check if login form is invalid", () => {
    jest
      .spyOn(graphQLServiceMock, "validateToken")
      .mockReturnValue({ subscribe: () => {} });
    component.tokenForm.controls["token"].setValue("");
    expect(component.tokenForm.valid).toBeFalsy();
  });

  it("Should check if login form is valid", () => {
    component.tokenForm.controls["token"].setValue("test");
    expect(component.tokenForm.valid).toBeTruthy();
    expect(graphQLServiceMock).toBeDefined();
  });

  it("Should check if addToken when success", () => {
    jest
      .spyOn(graphQLServiceMock, "validateToken")
      .mockReturnValue(of({ data: "test" }));
    jest.spyOn(sessionStorage, "getItem");
    jest.spyOn(sessionStorage, "removeItem");
    expect(component.loading).toBeTruthy();
    component.addToken();
    expect(component.loading).toBeFalsy();
    expect(component.error).toEqual(null);
    expect(graphQLServiceMock.validateToken).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(["/repositories"]);
    expect(sessionStorage.removeItem).not.toHaveBeenCalled();
  });

  it("Should check if addToken when failure", () => {
    jest
      .spyOn(graphQLServiceMock, "validateToken")
      .mockReturnValue(of(new Error("test")));
    expect(component.loading).toBeTruthy();
    component.addToken();
    expect(component.loading).toBeFalsy();
    expect(graphQLServiceMock.validateToken).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(sessionStorage.removeItem).toHaveBeenCalled();
    expect(sessionStorage.removeItem).toHaveBeenCalledWith("github_token");
  });
});
