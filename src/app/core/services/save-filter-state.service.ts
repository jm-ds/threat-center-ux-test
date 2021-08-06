import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class SaveFilterStateService {
    constructor() { }

    saveFilter(filterState: Map<any, any>) {
        sessionStorage.setItem("AssetFilter", this.mapToJson(filterState));
    }

    getFilter() {
        if (!!sessionStorage.getItem("AssetFilter")) {
            return this.jsonToMap(sessionStorage.getItem("AssetFilter"));
        } else {
            return new Map();
        }
    }

    private mapToJson(map) {
        return JSON.stringify([...map]);
    }

    private jsonToMap(jsonStr) {
        return new Map(JSON.parse(jsonStr));
    }
}