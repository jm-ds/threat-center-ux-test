export class License {
    licenseId: string;
    spdxId: string;
    name: string;
    body: string;
    description: string;
    isOsiApproved: boolean;
    isFsfLibre: boolean;
    isDeprecated: boolean;
    category: string;
    style: string;
    publicationYear: number;
    type: string;
    attributes: LicenseAttribute[];
    components: any;
    compatible: string;
    incompatible: string;
    notes: string;
}

export class LicenseAttribute {
    attributeType: string;
    key: string
}

export type LicenseQuery = {
    license: License;
}