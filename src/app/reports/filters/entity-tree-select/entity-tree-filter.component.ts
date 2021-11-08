import { Component, OnInit } from '@angular/core';
import {TreeviewItem} from "ngx-treeview";
import {compareBy} from "@app/shared/compare-utils";
import { EntityService } from '@app/services/entity.service';

@Component({
  selector: 'app-entity-tree-filter',
  templateUrl: './entity-tree-filter.component.html',
  styleUrls: ['./entity-tree-filter.component.scss']
})
export class EntityTreeFilterComponent implements OnInit {

  // entity filter
  entitiesSelected: string[]; // Entity ID array
  entityTree: TreeviewItem[];
  entityTreeConfig = {
    hasAllCheckBox: true,
    hasFilter: true,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 500
  };


  constructor(private entityService: EntityService) { }

  ngOnInit() {
    this.entityTree = [];

    this.entityService.getEntityList().subscribe(data => {
      let entities = data.data.entities.edges.map((e) => {
        return {value: e.node.entityId, text: e.node.name, children: [], parentId: e.node.parentEntityId};
      });

      let lookupMap = {};
      let node: any;
      let i: number;

      // initialize the lookup map
      for (i = 0; i < entities.length; i++) {
        lookupMap[entities[i].value] = i;
      }

      // populate children
      for (i = 0; i < entities.length; i++) {
        node = entities[i];
        if (node.parentId != null && lookupMap[node.parentId] != null) {
          entities[lookupMap[node.parentId]].children.push(node);
        }
      }

      // sort children by name
      for (i = 0; i < entities.length; i++) {
        entities[i].children.sort(compareBy("text"));
      }

      // create tree view structure from root sorted entities
      this.entityTree = entities.filter(e => e.parentId == null).sort(compareBy("text")).map(e => new TreeviewItem(e));
      this.entitiesSelected = [];
    }, error => {
      console.error("EntityTreeComponent", error);
    });
  }

  onEntityFilterChange(value: string): void {
    // console.log('filter:', value);
    // console.log("this.entitiesSelected:");
    // console.log(this.entitiesSelected);
  }

}
