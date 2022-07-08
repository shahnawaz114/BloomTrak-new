import { Component, OnInit } from '@angular/core';

import * as snippet from 'app/main/components/collapse/collapse.snippetcode';

@Component({
  selector: 'app-collapse',
  templateUrl: './collapse.component.html'
})
export class CollapseComponent implements OnInit {
  // public
  public contentHeader: object;
  public isCollapsed1 = true;
  public isCollapsed2 = true;
  public isCollapsed3 = false;
  public isCollapsed4 = true;
  public isCollapsed5 = true;

  // snippet code variables
  public _snippetCodeDefaultCollapset = snippet.snippetCodeDefaultCollapset;
  public _snippetCodeButtonCollapse = snippet.snippetCodeButtonCollapse;

  constructor() {}

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // content header
    this.contentHeader = {
      headerTitle: 'Collapse',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          {
            name: 'Components',
            isLink: true,
            link: '/'
          },
          {
            name: 'Collapse',
            isLink: false
          }
        ]
      }
    };
  }
}
