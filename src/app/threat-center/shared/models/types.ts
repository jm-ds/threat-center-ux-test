import { RepositoryAccounts } from "@app/models/scan";

export class Role {
  roleId: string;
  description: string;
  permissions: string[];
}

export class Authority {
  authority: string;
}

export class User {
  accessToken: string;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  authorities: Authority[];
  created: string;
  credentialsNonExpired: boolean;
  email: string;
  enabled: boolean;
  fname: string;
  lname: string;
  orgId: string;
  defaultEntityId: string;
  permissions: string[];
  repositoryAccounts: RepositoryAccounts;
  roles: Role[];
}




