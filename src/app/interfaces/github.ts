export interface Cursor {
  startCursor?: string;
  endCursor?: string;
}

export interface Owner {
  login: string;
  id: number;
  __typename: string;
  stargazerCount: number;
  updatedAt: string;
  url: string;
}

export interface Repository {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  stargazerCount: number;
  nameWithOwner: string;
  url?: string;
  openGraphImageUrl: string;
  description?: string;
  languages: string[];
  forkCount?: number;
  __typename: string;
  owner: Owner;
}

export interface RepositoryNode {
  node: Repository;
}
