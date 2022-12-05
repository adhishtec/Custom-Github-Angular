import { NgModule } from "@angular/core";
import { ApolloModule, APOLLO_OPTIONS } from "apollo-angular";
import {
  ApolloClientOptions,
  InMemoryCache,
  ApolloLink,
} from "@apollo/client/core";
import { HttpLink } from "apollo-angular/http";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

const uri = "https://api.github.com/graphql"; //  URL of the GraphQL server
export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  const basic = setContext(() => ({
    headers: {
      Accept: "charset=utf-8",
    },
  }));

  const auth = setContext(() => {
    const token = sessionStorage.getItem("github_token");

    if (token === null) {
      return {};
    } else {
      return {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    }
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    // React only on graphql errors
    console.log(networkError);
    if (graphQLErrors && graphQLErrors.length > 0) {
      if (
        (graphQLErrors[0] as any)?.statusCode >= 400 &&
        (graphQLErrors[0] as any)?.statusCode < 500
      ) {
        // handle client side error
        console.error(`[Client side error]: ${graphQLErrors[0].message}`);
      } else {
        // handle server side error
        console.error(`[Server side error]: ${graphQLErrors[0].message}`);
      }
    }
    if (networkError) {
      // handle network error
      console.error(`[Network error]: ${networkError.message}`);
    }
  });

  const link = ApolloLink.from([
    basic,
    auth,
    httpLink.create({ uri }),
    errorLink,
  ]);
  return {
    link,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        errorPolicy: "all",
      },
    },
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
