export class IgnoredFiles {
    objectId: string;
    type: Type;
    level: Level;
    pattern: string;
}

export enum Level {
    PROJECT = "PROJECT",
    ENTITY = "ENTITY",
    ORGANIZATION = "ORGANIZATION"
}

export enum Type {
    FILES = "FILES",
    FOLDERS = "FOLDERS",
    PATHS = "PATHS"
}

export class IgnoredFilesRequestInput {
    readonly objectId: string;
    readonly type: Type;
    readonly level: Level;
    readonly pattern: string;

    constructor(objectId: string, type: Type, level: Level, pattern: string) {
        this.objectId = objectId;
        this.type = type;
        this.level = level;
        this.pattern = pattern;
    }
}

export interface IgnoredFileSettingQuery {
    ignoreFile: IgnoredFiles[];
}