import { TestBed } from "@angular/core/testing";
import {
  ApolloTestingModule,
  ApolloTestingController,
} from "apollo-angular/testing";
import { GraphQLService } from "./graph-ql.service";
import { GET_LOGIN_INFORMATION } from "../graphql/graphql.queries";

describe("GraphQLService", () => {
  let service: GraphQLService;
  let controller: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      providers: [GraphQLService],
    }).compileComponents();
    service = TestBed.inject(GraphQLService);
    controller = TestBed.inject(ApolloTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it("should be created", () => {
    controller = TestBed.get(ApolloTestingController);
    expect(service).toBeTruthy();
    // service.validateToken().subscribe((token: any) => {
    //   expect(token).toEqual("");
    // });
    service.validateToken().subscribe();
    const op = controller.expectOne(GET_LOGIN_INFORMATION);
    expect(op.operation.variables).toEqual({});
    op.flush({
      data: {
        key: "value",
        viewer: "test",
        login: "test",
      },
    });
  });
});
