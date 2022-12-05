import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import { map } from "rxjs/operators";
import {
  GET_LOGIN_INFORMATION,
  PUBLIC_REPOS,
} from "../graphql/graphql.queries";

interface Cursor {
  startCursor?: string;
  endCursor?: string;
}

@Injectable({
  providedIn: "root",
})
export class GraphQLService {
  constructor(private apollo: Apollo) {}
  validateToken() {
    return this.apollo
      .watchQuery({
        query: GET_LOGIN_INFORMATION,
        errorPolicy: "all",
      })
      .valueChanges.pipe(map((result) => result));
  }

  publicRepository(cursor?: Cursor) {
    return this.apollo
      .watchQuery({
        query: PUBLIC_REPOS,
        errorPolicy: "all",
        variables: {
          page: 10,
          startCursor: cursor?.startCursor,
          endCursor: cursor?.endCursor,
        },
      })
      .valueChanges.pipe(map((result) => result));
  }
}

