# Useful utils



## Comparator functions

Functions like compareByName, compareBy: **`src/app/shared/compare-utils.ts`**

Usage sample:

```javascript
import {compareBy} from "@app/shared/compare-utils";
licenses = licenses.sort(compareBy(name));
```



## Array utils 

Functions like `uniqueElements` and `uniqueObjects`: **`src/app/shared/array-utils.ts`**

Usage sample:

```javascript
let licenses = uniqueObjects(
  component.entityComponentLicenses.edges.map(e => e.node.name), 
  "licenseId"
);

let uniqueNumbers = uniqueElements([1, 2, 3, 2, 1, 1, 2, 3, 4, 5, 2, 3]);
```



## Window scroll disable/enable

Use `ScrollStateService` to disable/enable window (document.body) scroll when pop over modal dialog overlay.

File path: **`src/app/shared/scroll-state.service.ts`**

Usage sample:

```javascript
import {ScrollStateService} from "@app/shared/scroll-state.service";

export class ComponentReportComponent implements OnInit {
    previewStateOpen = false;
    
    constructor(
        private scrollDisableService: ScrollStateService
    ) {
    }
    
    openPreview() {
        this.previewStateOpen = true; // modal state
        this.scrollDisableService.disableWindowScroll();
    }

    closePreview() {
        this.previewStateOpen = false;  // modal state
        this.scrollDisableService.enableWindowScroll();
    }
}
```

