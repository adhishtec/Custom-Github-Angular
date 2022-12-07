import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TokenComponent } from "./token.component";
import { RouterTestingModule } from "@angular/router/testing";
import { ApolloTestingModule } from "apollo-angular/testing";
import { Router } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";
import { GraphQLService } from "../services/graph-ql.service";
import { of } from "rxjs";

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
  const routerMock = { navigate: jest.fn() };
  const graphqlMock = {
    validateToken: jest.fn(),
    // validateToken: function () {
    //   return of("shshsh");
    // },
  };

  const sessionStorageMack = { removeItem: jest.fn(), setItem: jest.fn() };
  Object.defineProperty(window, "sessionStorage", {
    value: sessionStorageMack,
  });
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TokenComponent],
      imports: [RouterTestingModule, ApolloTestingModule, ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: GraphQLService, useValue: graphqlMock },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
