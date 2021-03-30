export class License {
    licenseId: string;
    spdxId: string;
    name: string;
    body: string;
    description: string;
    isOsiApproved: boolean;
    isFsfLibre: boolean;
    isDeprecated: boolean;
    attributes: LicenseAttribute[];
    components: any;
}

export class LicenseAttribute {
    attributeType: string;
    key: string
}

export type LicenseQuery = {
    license: License;
}