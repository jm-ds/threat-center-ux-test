export class User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    orgId: string;
    defaultEntityId: string;
    permissions:string[];
    authdata?: string;
}
