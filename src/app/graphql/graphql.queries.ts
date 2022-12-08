import { gql } from "apollo-angular";

const GET_LOGIN_INFORMATION = gql`
  query {
    viewer {
      login
    }
  }
`;

const PUBLIC_REPOS = gql`
  query findPublicRepos($page: Int!, $startCursor: String, $endCursor: String) {
    search(
      query: "is:public archived:false stars:>300 language:JavaScript sort:stars-asc"
      type: REPOSITORY
      last: $page
      before: $endCursor
      after: $startCursor
    ) {
      repositoryCount
      pageInfo {
        endCursor
        startCursor
        hasNextPage
      }
      edges {
        node {
          ... on Repository {
            id
            name
            stargazerCount
            nameWithOwner
            createdAt
            updatedAt
            url
            openGraphImageUrl
            description

            languages(first: 100, orderBy: { field: SIZE, direction: DESC }) {
              totalCount
              edges {
                size
                node {
                  name
                }
              }
            }
            forkCount
            owner {
              login
              id
              avatarUrl
            }
          }
        }
      }
    }
  }
`;

const PUBLIC_REPO_DETAILS = gql`
  query (
    $name: String!
    $owner: String!
    $startCursor: String
    $endCursor: String
  ) {
    repository(name: $name, owner: $owner) {
      nameWithOwner
      owner {
        id
        avatarUrl
      }
      description
      forks {
        totalCount
      }
      stargazers {
        totalCount
      }
      watchers {
        totalCount
      }
      pullRequests {
        totalCount
      }

      labels(first: 10) {
        edges {
          node {
            name
          }
        }
      }
      milestones(first: 10) {
        edges {
          node {
            title
          }
        }
      }
      issues(
        first: 10
        states: CLOSED
        before: $endCursor
        after: $startCursor
      ) {
        totalCount
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
        edges {
          node {
            title
            url
            createdAt
            closed
            closedAt
            state
            updatedAt
            bodyText
            labels(first: 10) {
              edges {
                node {
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;

export { GET_LOGIN_INFORMATION, PUBLIC_REPOS, PUBLIC_REPO_DETAILS };
