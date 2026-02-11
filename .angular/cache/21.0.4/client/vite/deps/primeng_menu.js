import {
  Tooltip,
  TooltipModule
} from "./chunk-CH3HKEZT.js";
import {
  zindexutils
} from "./chunk-BWIZHURQ.js";
import {
  Motion,
  MotionModule
} from "./chunk-7Q7BSIFW.js";
import {
  Badge,
  BadgeModule
} from "./chunk-IV54IDJF.js";
import {
  ConnectedOverlayScrollHandler
} from "./chunk-5WUBT2TC.js";
import {
  Ripple
} from "./chunk-JHCQQPQT.js";
import {
  BaseComponent,
  PARENT_INSTANCE
} from "./chunk-U7SKQ7FA.js";
import {
  BaseStyle
} from "./chunk-AC7LTVVR.js";
import {
  OverlayService,
  PrimeTemplate,
  SharedModule
} from "./chunk-CXWQDPW7.js";
import {
  Bind,
  BindModule
} from "./chunk-RRKVMRSH.js";
import {
  D,
  S,
  Y,
  Yt,
  bt,
  s3 as s,
  ut,
  v,
  z
} from "./chunk-YUNR4ATL.js";
import {
  RouterLink,
  RouterLinkActive,
  RouterModule
} from "./chunk-ZXYCPNFG.js";
import {
  DomSanitizer
} from "./chunk-NDX5NAN7.js";
import "./chunk-KNWP4X75.js";
import {
  CommonModule,
  NgForOf,
  NgIf,
  NgStyle,
  NgTemplateOutlet,
  isPlatformBrowser
} from "./chunk-IWDQBEOJ.js";
import "./chunk-CCPDBUMU.js";
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  Inject,
  Injectable,
  Input,
  NgModule,
  Output,
  PLATFORM_ID,
  Pipe,
  ViewChild,
  ViewEncapsulation,
  booleanAttribute,
  input,
  numberAttribute,
  setClassMetadata,
  viewChild,
  ɵɵHostDirectivesFeature,
  ɵɵInheritDefinitionFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵcontentQuery,
  ɵɵdefineComponent,
  ɵɵdefineNgModule,
  ɵɵdefinePipe,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵpureFunction2,
  ɵɵqueryAdvance,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵsanitizeHtml,
  ɵɵsanitizeUrl,
  ɵɵstyleMap,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵviewQuerySignal
} from "./chunk-T234SRAC.js";
import {
  EventEmitter,
  InjectionToken,
  computed,
  forwardRef,
  inject,
  signal,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵresetView,
  ɵɵrestoreView
} from "./chunk-QO6PBS6I.js";
import "./chunk-YBNECNG7.js";
import {
  __spreadValues
} from "./chunk-WDMUDEB6.js";

// node_modules/@primeuix/styles/dist/menu/index.mjs
var style = "\n    .p-menu {\n        background: dt('menu.background');\n        color: dt('menu.color');\n        border: 1px solid dt('menu.border.color');\n        border-radius: dt('menu.border.radius');\n        min-width: 12.5rem;\n    }\n\n    .p-menu-list {\n        margin: 0;\n        padding: dt('menu.list.padding');\n        outline: 0 none;\n        list-style: none;\n        display: flex;\n        flex-direction: column;\n        gap: dt('menu.list.gap');\n    }\n\n    .p-menu-item-content {\n        transition:\n            background dt('menu.transition.duration'),\n            color dt('menu.transition.duration');\n        border-radius: dt('menu.item.border.radius');\n        color: dt('menu.item.color');\n        overflow: hidden;\n    }\n\n    .p-menu-item-link {\n        cursor: pointer;\n        display: flex;\n        align-items: center;\n        text-decoration: none;\n        overflow: hidden;\n        position: relative;\n        color: inherit;\n        padding: dt('menu.item.padding');\n        gap: dt('menu.item.gap');\n        user-select: none;\n        outline: 0 none;\n    }\n\n    .p-menu-item-label {\n        line-height: 1;\n    }\n\n    .p-menu-item-icon {\n        color: dt('menu.item.icon.color');\n    }\n\n    .p-menu-item.p-focus .p-menu-item-content {\n        color: dt('menu.item.focus.color');\n        background: dt('menu.item.focus.background');\n    }\n\n    .p-menu-item.p-focus .p-menu-item-icon {\n        color: dt('menu.item.icon.focus.color');\n    }\n\n    .p-menu-item:not(.p-disabled) .p-menu-item-content:hover {\n        color: dt('menu.item.focus.color');\n        background: dt('menu.item.focus.background');\n    }\n\n    .p-menu-item:not(.p-disabled) .p-menu-item-content:hover .p-menu-item-icon {\n        color: dt('menu.item.icon.focus.color');\n    }\n\n    .p-menu-overlay {\n        box-shadow: dt('menu.shadow');\n    }\n\n    .p-menu-submenu-label {\n        background: dt('menu.submenu.label.background');\n        padding: dt('menu.submenu.label.padding');\n        color: dt('menu.submenu.label.color');\n        font-weight: dt('menu.submenu.label.font.weight');\n    }\n\n    .p-menu-separator {\n        border-block-start: 1px solid dt('menu.separator.border.color');\n    }\n";

// node_modules/primeng/fesm2022/primeng-menu.mjs
var _c0 = ["pMenuItemContent", ""];
var _c1 = (a0) => ({
  $implicit: a0
});
var _c2 = () => ({
  exact: false
});
var _c3 = (a0) => ({
  item: a0
});
function MenuItemContent_ng_container_1_a_1_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function MenuItemContent_ng_container_1_a_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "a", 6);
    ɵɵtemplate(1, MenuItemContent_ng_container_1_a_1_ng_container_1_Template, 1, 0, "ng-container", 7);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    const itemContent_r3 = ɵɵreference(4);
    ɵɵclassMap(ctx_r1.cn(ctx_r1.cx("itemLink"), ctx_r1.item == null ? null : ctx_r1.item.linkClass));
    ɵɵproperty("ngStyle", ctx_r1.item == null ? null : ctx_r1.item.linkStyle)("target", ctx_r1.item.target)("pBind", ctx_r1.getPTOptions("itemLink"));
    ɵɵattribute("title", ctx_r1.item.title)("href", ctx_r1.item.url || null, ɵɵsanitizeUrl)("data-automationid", ctx_r1.item.automationId)("tabindex", -1);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", itemContent_r3)("ngTemplateOutletContext", ɵɵpureFunction1(11, _c1, ctx_r1.item));
  }
}
function MenuItemContent_ng_container_1_a_2_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function MenuItemContent_ng_container_1_a_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "a", 8);
    ɵɵtemplate(1, MenuItemContent_ng_container_1_a_2_ng_container_1_Template, 1, 0, "ng-container", 7);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    const itemContent_r3 = ɵɵreference(4);
    ɵɵclassMap(ctx_r1.cn(ctx_r1.cx("itemLink"), ctx_r1.item == null ? null : ctx_r1.item.linkClass));
    ɵɵproperty("routerLink", ctx_r1.item.routerLink)("queryParams", ctx_r1.item.queryParams)("routerLinkActiveOptions", ctx_r1.item.routerLinkActiveOptions || ɵɵpureFunction0(19, _c2))("ngStyle", ctx_r1.item == null ? null : ctx_r1.item.linkStyle)("target", ctx_r1.item.target)("fragment", ctx_r1.item.fragment)("queryParamsHandling", ctx_r1.item.queryParamsHandling)("preserveFragment", ctx_r1.item.preserveFragment)("skipLocationChange", ctx_r1.item.skipLocationChange)("replaceUrl", ctx_r1.item.replaceUrl)("state", ctx_r1.item.state)("pBind", ctx_r1.getPTOptions("itemLink"));
    ɵɵattribute("data-automationid", ctx_r1.item.automationId)("tabindex", -1)("title", ctx_r1.item.title);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", itemContent_r3)("ngTemplateOutletContext", ɵɵpureFunction1(20, _c1, ctx_r1.item));
  }
}
function MenuItemContent_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtemplate(1, MenuItemContent_ng_container_1_a_1_Template, 2, 13, "a", 4)(2, MenuItemContent_ng_container_1_a_2_Template, 2, 22, "a", 5);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵproperty("ngIf", !(ctx_r1.item == null ? null : ctx_r1.item.routerLink));
    ɵɵadvance();
    ɵɵproperty("ngIf", ctx_r1.item == null ? null : ctx_r1.item.routerLink);
  }
}
function MenuItemContent_ng_container_2_1_ng_template_0_Template(rf, ctx) {
}
function MenuItemContent_ng_container_2_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, MenuItemContent_ng_container_2_1_ng_template_0_Template, 0, 0, "ng-template");
  }
}
function MenuItemContent_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtemplate(1, MenuItemContent_ng_container_2_1_Template, 1, 0, null, 7);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", ctx_r1.itemTemplate)("ngTemplateOutletContext", ɵɵpureFunction1(2, _c1, ctx_r1.item));
  }
}
function MenuItemContent_ng_template_3_span_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "span", 12);
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵclassMap(ctx_r1.cn(ctx_r1.cx("itemIcon", ɵɵpureFunction1(5, _c3, ctx_r1.item)), ctx_r1.item.iconClass));
    ɵɵproperty("pBind", ctx_r1.getPTOptions("itemIcon"))("ngStyle", ctx_r1.item.iconStyle);
    ɵɵattribute("data-pc-section", "itemicon");
  }
}
function MenuItemContent_ng_template_3_span_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span", 13);
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵclassMap(ctx_r1.cn(ctx_r1.cx("itemLabel"), ctx_r1.item.labelClass));
    ɵɵproperty("ngStyle", ctx_r1.item.labelStyle)("pBind", ctx_r1.getPTOptions("itemLabel"));
    ɵɵattribute("data-pc-section", "itemlabel");
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r1.item.label);
  }
}
function MenuItemContent_ng_template_3_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "span", 14);
    ɵɵpipe(1, "safeHtml");
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵclassMap(ctx_r1.cn(ctx_r1.cx("itemLabel"), ctx_r1.item.labelClass));
    ɵɵproperty("ngStyle", ctx_r1.item.labelStyle)("innerHTML", ɵɵpipeBind1(1, 6, ctx_r1.item.label), ɵɵsanitizeHtml)("pBind", ctx_r1.getPTOptions("itemLabel"));
    ɵɵattribute("data-pc-section", "itemlabel");
  }
}
function MenuItemContent_ng_template_3_p_badge_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "p-badge", 15);
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵproperty("styleClass", ctx_r1.item.badgeStyleClass)("value", ctx_r1.item.badge)("pt", ctx_r1.getPTOptions("pcBadge"))("unstyled", ctx_r1.unstyled());
  }
}
function MenuItemContent_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, MenuItemContent_ng_template_3_span_0_Template, 1, 7, "span", 9)(1, MenuItemContent_ng_template_3_span_1_Template, 2, 6, "span", 10)(2, MenuItemContent_ng_template_3_ng_template_2_Template, 2, 8, "ng-template", null, 1, ɵɵtemplateRefExtractor)(4, MenuItemContent_ng_template_3_p_badge_4_Template, 1, 4, "p-badge", 11);
  }
  if (rf & 2) {
    const htmlLabel_r4 = ɵɵreference(3);
    const ctx_r1 = ɵɵnextContext();
    ɵɵproperty("ngIf", ctx_r1.item.icon);
    ɵɵadvance();
    ɵɵproperty("ngIf", ctx_r1.item.escape !== false)("ngIfElse", htmlLabel_r4);
    ɵɵadvance(3);
    ɵɵproperty("ngIf", ctx_r1.item.badge);
  }
}
var _c4 = ["start"];
var _c5 = ["end"];
var _c6 = ["header"];
var _c7 = ["item"];
var _c8 = ["submenuheader"];
var _c9 = ["list"];
var _c10 = ["container"];
var _c11 = (a0, a1) => ({
  item: a0,
  id: a1
});
function Menu_Conditional_0_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function Menu_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "p-motion", 5);
    ɵɵlistener("onBeforeEnter", function Menu_Conditional_0_Template_p_motion_onBeforeEnter_0_listener($event) {
      ɵɵrestoreView(_r1);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.onOverlayBeforeEnter($event));
    })("onAfterLeave", function Menu_Conditional_0_Template_p_motion_onAfterLeave_0_listener() {
      ɵɵrestoreView(_r1);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.onOverlayAfterLeave());
    });
    ɵɵtemplate(1, Menu_Conditional_0_ng_container_1_Template, 1, 0, "ng-container", 6);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    const sharedcontent_r3 = ɵɵreference(3);
    ɵɵproperty("visible", ctx_r1.visible)("appear", ctx_r1.popup)("options", ctx_r1.computedMotionOptions());
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", sharedcontent_r3);
  }
}
function Menu_Conditional_1_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function Menu_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, Menu_Conditional_1_ng_container_0_Template, 1, 0, "ng-container", 6);
  }
  if (rf & 2) {
    ɵɵnextContext();
    const sharedcontent_r3 = ɵɵreference(3);
    ɵɵproperty("ngTemplateOutlet", sharedcontent_r3);
  }
}
function Menu_ng_template_2_div_2_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function Menu_ng_template_2_div_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 11);
    ɵɵtemplate(1, Menu_ng_template_2_div_2_ng_container_1_Template, 1, 0, "ng-container", 6);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵclassMap(ctx_r1.cx("start"));
    ɵɵproperty("pBind", ctx_r1.ptm("start"));
    ɵɵattribute("data-pc-section", "start");
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", ctx_r1.startTemplate ?? ctx_r1._startTemplate);
  }
}
function Menu_ng_template_2_5_ng_template_0_li_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "li", 15);
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(4);
    ɵɵclassMap(ctx_r1.cx("separator"));
    ɵɵproperty("pBind", ctx_r1.ptm("separator"));
    ɵɵattribute("data-pc-section", "separator");
  }
}
function Menu_ng_template_2_5_ng_template_0_li_1_ng_container_1_span_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span");
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const submenu_r5 = ɵɵnextContext(3).$implicit;
    ɵɵadvance();
    ɵɵtextInterpolate(submenu_r5.label);
  }
}
function Menu_ng_template_2_5_ng_template_0_li_1_ng_container_1_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "span", 19);
    ɵɵpipe(1, "safeHtml");
  }
  if (rf & 2) {
    const submenu_r5 = ɵɵnextContext(3).$implicit;
    ɵɵproperty("innerHTML", ɵɵpipeBind1(1, 1, submenu_r5.label), ɵɵsanitizeHtml);
  }
}
function Menu_ng_template_2_5_ng_template_0_li_1_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtemplate(1, Menu_ng_template_2_5_ng_template_0_li_1_ng_container_1_span_1_Template, 2, 1, "span", 18)(2, Menu_ng_template_2_5_ng_template_0_li_1_ng_container_1_ng_template_2_Template, 2, 3, "ng-template", null, 3, ɵɵtemplateRefExtractor);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    const htmlSubmenuLabel_r6 = ɵɵreference(3);
    const submenu_r5 = ɵɵnextContext(2).$implicit;
    ɵɵadvance();
    ɵɵproperty("ngIf", submenu_r5.escape !== false)("ngIfElse", htmlSubmenuLabel_r6);
  }
}
function Menu_ng_template_2_5_ng_template_0_li_1_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function Menu_ng_template_2_5_ng_template_0_li_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "li", 16);
    ɵɵtemplate(1, Menu_ng_template_2_5_ng_template_0_li_1_ng_container_1_Template, 4, 2, "ng-container", 10)(2, Menu_ng_template_2_5_ng_template_0_li_1_ng_container_2_Template, 1, 0, "ng-container", 17);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r6 = ɵɵnextContext();
    const submenu_r5 = ctx_r6.$implicit;
    const i_r8 = ctx_r6.index;
    const ctx_r1 = ɵɵnextContext(3);
    ɵɵclassMap(ctx_r1.cx("submenuLabel"));
    ɵɵproperty("pBind", ctx_r1.ptm("submenuLabel"))("tooltipOptions", submenu_r5.tooltipOptions)("pTooltipUnstyled", ctx_r1.unstyled());
    ɵɵattribute("data-automationid", submenu_r5.automationId)("id", ctx_r1.menuitemId(submenu_r5, ctx_r1.id, i_r8))("data-pc-section", "submenulabel");
    ɵɵadvance();
    ɵɵproperty("ngIf", !ctx_r1.submenuHeaderTemplate && !ctx_r1._submenuHeaderTemplate);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", ctx_r1.submenuHeaderTemplate ?? ctx_r1._submenuHeaderTemplate)("ngTemplateOutletContext", ɵɵpureFunction1(11, _c1, submenu_r5));
  }
}
function Menu_ng_template_2_5_ng_template_0_ng_template_2_li_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "li", 15);
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(5);
    ɵɵclassMap(ctx_r1.cx("separator"));
    ɵɵproperty("pBind", ctx_r1.ptm("separator"));
    ɵɵattribute("data-pc-section", "separator");
  }
}
function Menu_ng_template_2_5_ng_template_0_ng_template_2_li_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "li", 21);
    ɵɵlistener("onMenuItemClick", function Menu_ng_template_2_5_ng_template_0_ng_template_2_li_1_Template_li_onMenuItemClick_0_listener($event) {
      ɵɵrestoreView(_r9);
      const ctx_r9 = ɵɵnextContext();
      const item_r11 = ctx_r9.$implicit;
      const j_r12 = ctx_r9.index;
      const i_r8 = ɵɵnextContext().index;
      const ctx_r1 = ɵɵnextContext(3);
      return ɵɵresetView(ctx_r1.itemClick($event, ctx_r1.menuitemId(item_r11, ctx_r1.id, i_r8, j_r12)));
    });
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r9 = ɵɵnextContext();
    const item_r11 = ctx_r9.$implicit;
    const j_r12 = ctx_r9.index;
    const i_r8 = ɵɵnextContext().index;
    const ctx_r1 = ɵɵnextContext(3);
    ɵɵstyleMap(item_r11.style);
    ɵɵclassMap(ctx_r1.cn(ctx_r1.cx("item", ɵɵpureFunction2(17, _c11, item_r11, ctx_r1.menuitemId(item_r11, ctx_r1.id, i_r8, j_r12))), item_r11 == null ? null : item_r11.styleClass));
    ɵɵproperty("pMenuItemContent", item_r11)("itemTemplate", ctx_r1.itemTemplate ?? ctx_r1._itemTemplate)("idx", j_r12)("menuitemId", ctx_r1.menuitemId(item_r11, ctx_r1.id, i_r8, j_r12))("tooltipOptions", item_r11.tooltipOptions)("pTooltipUnstyled", ctx_r1.unstyled())("unstyled", ctx_r1.unstyled());
    ɵɵattribute("data-pc-section", "menuitem")("aria-label", ctx_r1.label(item_r11.label))("data-p-focused", ctx_r1.isItemFocused(ctx_r1.menuitemId(item_r11, ctx_r1.id, i_r8, j_r12)))("data-p-disabled", ctx_r1.disabled(item_r11.disabled))("aria-disabled", ctx_r1.disabled(item_r11.disabled))("id", ctx_r1.menuitemId(item_r11, ctx_r1.id, i_r8, j_r12));
  }
}
function Menu_ng_template_2_5_ng_template_0_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, Menu_ng_template_2_5_ng_template_0_ng_template_2_li_0_Template, 1, 4, "li", 13)(1, Menu_ng_template_2_5_ng_template_0_ng_template_2_li_1_Template, 1, 20, "li", 20);
  }
  if (rf & 2) {
    const item_r11 = ctx.$implicit;
    const submenu_r5 = ɵɵnextContext().$implicit;
    ɵɵproperty("ngIf", item_r11.separator && (item_r11.visible !== false || submenu_r5.visible !== false));
    ɵɵadvance();
    ɵɵproperty("ngIf", !item_r11.separator && item_r11.visible !== false && (item_r11.visible !== void 0 || submenu_r5.visible !== false));
  }
}
function Menu_ng_template_2_5_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, Menu_ng_template_2_5_ng_template_0_li_0_Template, 1, 4, "li", 13)(1, Menu_ng_template_2_5_ng_template_0_li_1_Template, 3, 13, "li", 14)(2, Menu_ng_template_2_5_ng_template_0_ng_template_2_Template, 2, 2, "ng-template", 12);
  }
  if (rf & 2) {
    const submenu_r5 = ctx.$implicit;
    ɵɵproperty("ngIf", submenu_r5.separator && submenu_r5.visible !== false);
    ɵɵadvance();
    ɵɵproperty("ngIf", !submenu_r5.separator);
    ɵɵadvance();
    ɵɵproperty("ngForOf", submenu_r5.items);
  }
}
function Menu_ng_template_2_5_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, Menu_ng_template_2_5_ng_template_0_Template, 3, 3, "ng-template", 12);
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵproperty("ngForOf", ctx_r1.model);
  }
}
function Menu_ng_template_2_6_ng_template_0_li_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "li", 15);
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(4);
    ɵɵclassMap(ctx_r1.cx("separator"));
    ɵɵproperty("pBind", ctx_r1.ptm("separator"));
    ɵɵattribute("data-pc-section", "separator");
  }
}
function Menu_ng_template_2_6_ng_template_0_li_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "li", 23);
    ɵɵlistener("onMenuItemClick", function Menu_ng_template_2_6_ng_template_0_li_1_Template_li_onMenuItemClick_0_listener($event) {
      ɵɵrestoreView(_r13);
      const ctx_r13 = ɵɵnextContext();
      const item_r15 = ctx_r13.$implicit;
      const i_r16 = ctx_r13.index;
      const ctx_r1 = ɵɵnextContext(3);
      return ɵɵresetView(ctx_r1.itemClick($event, ctx_r1.menuitemId(item_r15, ctx_r1.id, i_r16)));
    });
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r13 = ɵɵnextContext();
    const item_r15 = ctx_r13.$implicit;
    const i_r16 = ctx_r13.index;
    const ctx_r1 = ɵɵnextContext(3);
    ɵɵclassMap(ctx_r1.cn(ctx_r1.cx("item", ɵɵpureFunction2(16, _c11, item_r15, ctx_r1.menuitemId(item_r15, ctx_r1.id, i_r16))), item_r15 == null ? null : item_r15.styleClass));
    ɵɵproperty("pMenuItemContent", item_r15)("itemTemplate", ctx_r1.itemTemplate ?? ctx_r1._itemTemplate)("idx", i_r16)("menuitemId", ctx_r1.menuitemId(item_r15, ctx_r1.id, i_r16))("ngStyle", item_r15.style)("tooltipOptions", item_r15.tooltipOptions)("unstyled", ctx_r1.unstyled())("pTooltipUnstyled", ctx_r1.unstyled());
    ɵɵattribute("data-pc-section", "menuitem")("aria-label", ctx_r1.label(item_r15.label))("data-p-focused", ctx_r1.isItemFocused(ctx_r1.menuitemId(item_r15, ctx_r1.id, i_r16)))("data-p-disabled", ctx_r1.disabled(item_r15.disabled))("aria-disabled", ctx_r1.disabled(item_r15.disabled))("id", ctx_r1.menuitemId(item_r15, ctx_r1.id, i_r16));
  }
}
function Menu_ng_template_2_6_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, Menu_ng_template_2_6_ng_template_0_li_0_Template, 1, 4, "li", 13)(1, Menu_ng_template_2_6_ng_template_0_li_1_Template, 1, 19, "li", 22);
  }
  if (rf & 2) {
    const item_r15 = ctx.$implicit;
    ɵɵproperty("ngIf", item_r15.separator && item_r15.visible !== false);
    ɵɵadvance();
    ɵɵproperty("ngIf", !item_r15.separator && item_r15.visible !== false);
  }
}
function Menu_ng_template_2_6_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, Menu_ng_template_2_6_ng_template_0_Template, 2, 2, "ng-template", 12);
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵproperty("ngForOf", ctx_r1.model);
  }
}
function Menu_ng_template_2_div_7_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function Menu_ng_template_2_div_7_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 11);
    ɵɵtemplate(1, Menu_ng_template_2_div_7_ng_container_1_Template, 1, 0, "ng-container", 6);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext(2);
    ɵɵclassMap(ctx_r1.cx("end"));
    ɵɵproperty("pBind", ctx_r1.ptm("end"));
    ɵɵattribute("data-pc-section", "end");
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", ctx_r1.endTemplate ?? ctx_r1._endTemplate);
  }
}
function Menu_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "div", 7, 1);
    ɵɵlistener("click", function Menu_ng_template_2_Template_div_click_0_listener($event) {
      ɵɵrestoreView(_r4);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.onOverlayClick($event));
    });
    ɵɵtemplate(2, Menu_ng_template_2_div_2_Template, 2, 5, "div", 8);
    ɵɵelementStart(3, "ul", 9, 2);
    ɵɵlistener("focus", function Menu_ng_template_2_Template_ul_focus_3_listener($event) {
      ɵɵrestoreView(_r4);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.onListFocus($event));
    })("blur", function Menu_ng_template_2_Template_ul_blur_3_listener($event) {
      ɵɵrestoreView(_r4);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.onListBlur($event));
    })("keydown", function Menu_ng_template_2_Template_ul_keydown_3_listener($event) {
      ɵɵrestoreView(_r4);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.onListKeyDown($event));
    });
    ɵɵtemplate(5, Menu_ng_template_2_5_Template, 1, 1, null, 10)(6, Menu_ng_template_2_6_Template, 1, 1, null, 10);
    ɵɵelementEnd();
    ɵɵtemplate(7, Menu_ng_template_2_div_7_Template, 2, 5, "div", 8);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵstyleMap(ctx_r1.sx("root"));
    ɵɵclassMap(ctx_r1.cn(ctx_r1.cx("root"), ctx_r1.styleClass));
    ɵɵproperty("ngStyle", ctx_r1.style)("pBind", ctx_r1.ptm("root"));
    ɵɵattribute("id", ctx_r1.id)("data-p", ctx_r1.dataP);
    ɵɵadvance(2);
    ɵɵproperty("ngIf", ctx_r1.startTemplate ?? ctx_r1._startTemplate);
    ɵɵadvance();
    ɵɵclassMap(ctx_r1.cx("list"));
    ɵɵproperty("pBind", ctx_r1.ptm("list"));
    ɵɵattribute("id", ctx_r1.id + "_list")("tabindex", ctx_r1.getTabIndexValue())("data-pc-section", "menu")("aria-activedescendant", ctx_r1.activedescendant())("aria-label", ctx_r1.ariaLabel)("aria-labelledBy", ctx_r1.ariaLabelledBy);
    ɵɵadvance(2);
    ɵɵproperty("ngIf", ctx_r1.hasSubMenu());
    ɵɵadvance();
    ɵɵproperty("ngIf", !ctx_r1.hasSubMenu());
    ɵɵadvance();
    ɵɵproperty("ngIf", ctx_r1.endTemplate ?? ctx_r1._endTemplate);
  }
}
var inlineStyles = {
  root: ({
    instance
  }) => ({
    position: instance.popup ? "absolute" : "relative"
  })
};
var classes = {
  root: ({
    instance
  }) => ["p-menu p-component", {
    "p-menu-overlay": instance.popup
  }],
  start: "p-menu-start",
  list: "p-menu-list",
  submenuLabel: "p-menu-submenu-label",
  separator: "p-menu-separator",
  end: "p-menu-end",
  item: ({
    instance,
    item,
    id
  }) => ["p-menu-item", {
    "p-focus": instance.focusedOptionId() && id === instance.focusedOptionId(),
    "p-disabled": instance.disabled(item.disabled)
  }, item.styleClass],
  itemContent: "p-menu-item-content",
  itemLink: "p-menu-item-link",
  itemIcon: ({
    item
  }) => ["p-menu-item-icon", item.icon, item.iconClass],
  itemLabel: "p-menu-item-label"
};
var MenuStyle = class _MenuStyle extends BaseStyle {
  name = "menu";
  style = style;
  classes = classes;
  inlineStyles = inlineStyles;
  static ɵfac = /* @__PURE__ */ (() => {
    let ɵMenuStyle_BaseFactory;
    return function MenuStyle_Factory(__ngFactoryType__) {
      return (ɵMenuStyle_BaseFactory || (ɵMenuStyle_BaseFactory = ɵɵgetInheritedFactory(_MenuStyle)))(__ngFactoryType__ || _MenuStyle);
    };
  })();
  static ɵprov = ɵɵdefineInjectable({
    token: _MenuStyle,
    factory: _MenuStyle.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MenuStyle, [{
    type: Injectable
  }], null, null);
})();
var MenuClasses;
(function(MenuClasses2) {
  MenuClasses2["root"] = "p-menu";
  MenuClasses2["start"] = "p-menu-start";
  MenuClasses2["list"] = "p-menu-list";
  MenuClasses2["submenuItem"] = "p-menu-submenu-item";
  MenuClasses2["separator"] = "p-menu-separator";
  MenuClasses2["end"] = "p-menu-end";
  MenuClasses2["item"] = "p-menu-item";
  MenuClasses2["itemContent"] = "p-menu-item-content";
  MenuClasses2["itemLink"] = "p-menu-item-link";
  MenuClasses2["itemIcon"] = "p-menu-item-icon";
  MenuClasses2["itemLabel"] = "p-menu-item-label";
})(MenuClasses || (MenuClasses = {}));
var MENU_INSTANCE = new InjectionToken("MENU_INSTANCE");
var SafeHtmlPipe = class _SafeHtmlPipe {
  platformId;
  sanitizer;
  constructor(platformId, sanitizer) {
    this.platformId = platformId;
    this.sanitizer = sanitizer;
  }
  transform(value) {
    if (!value || !isPlatformBrowser(this.platformId)) {
      return value;
    }
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
  static ɵfac = function SafeHtmlPipe_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SafeHtmlPipe)(ɵɵdirectiveInject(PLATFORM_ID, 16), ɵɵdirectiveInject(DomSanitizer, 16));
  };
  static ɵpipe = ɵɵdefinePipe({
    name: "safeHtml",
    type: _SafeHtmlPipe,
    pure: true
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SafeHtmlPipe, [{
    type: Pipe,
    args: [{
      name: "safeHtml",
      standalone: true
    }]
  }], () => [{
    type: void 0,
    decorators: [{
      type: Inject,
      args: [PLATFORM_ID]
    }]
  }, {
    type: DomSanitizer
  }], null);
})();
var MenuItemContent = class _MenuItemContent extends BaseComponent {
  item;
  itemTemplate;
  menuitemId = input("", ...ngDevMode ? [{
    debugName: "menuitemId"
  }] : []);
  idx = input(0, ...ngDevMode ? [{
    debugName: "idx"
  }] : []);
  onMenuItemClick = new EventEmitter();
  menu;
  _componentStyle = inject(MenuStyle);
  hostName = "Menu";
  constructor(menu) {
    super();
    this.menu = menu;
  }
  onItemClick(event, item) {
    this.onMenuItemClick.emit({
      originalEvent: event,
      item
    });
  }
  getPTOptions(key) {
    return this.menu.getPTOptions(key, this.item, this.idx(), this.menuitemId());
  }
  static ɵfac = function MenuItemContent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MenuItemContent)(ɵɵdirectiveInject(forwardRef(() => Menu)));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _MenuItemContent,
    selectors: [["", "pMenuItemContent", ""]],
    inputs: {
      item: [0, "pMenuItemContent", "item"],
      itemTemplate: "itemTemplate",
      menuitemId: [1, "menuitemId"],
      idx: [1, "idx"]
    },
    outputs: {
      onMenuItemClick: "onMenuItemClick"
    },
    features: [ɵɵProvidersFeature([MenuStyle]), ɵɵInheritDefinitionFeature],
    attrs: _c0,
    decls: 5,
    vars: 6,
    consts: [["itemContent", ""], ["htmlLabel", ""], [3, "click", "pBind"], [4, "ngIf"], ["pRipple", "", 3, "class", "ngStyle", "target", "pBind", 4, "ngIf"], ["routerLinkActive", "p-menu-item-link-active", "pRipple", "", 3, "routerLink", "queryParams", "routerLinkActiveOptions", "class", "ngStyle", "target", "fragment", "queryParamsHandling", "preserveFragment", "skipLocationChange", "replaceUrl", "state", "pBind", 4, "ngIf"], ["pRipple", "", 3, "ngStyle", "target", "pBind"], [4, "ngTemplateOutlet", "ngTemplateOutletContext"], ["routerLinkActive", "p-menu-item-link-active", "pRipple", "", 3, "routerLink", "queryParams", "routerLinkActiveOptions", "ngStyle", "target", "fragment", "queryParamsHandling", "preserveFragment", "skipLocationChange", "replaceUrl", "state", "pBind"], [3, "class", "pBind", "ngStyle", 4, "ngIf"], [3, "class", "ngStyle", "pBind", 4, "ngIf", "ngIfElse"], [3, "styleClass", "value", "pt", "unstyled", 4, "ngIf"], [3, "pBind", "ngStyle"], [3, "ngStyle", "pBind"], [3, "ngStyle", "innerHTML", "pBind"], [3, "styleClass", "value", "pt", "unstyled"]],
    template: function MenuItemContent_Template(rf, ctx) {
      if (rf & 1) {
        const _r1 = ɵɵgetCurrentView();
        ɵɵelementStart(0, "div", 2);
        ɵɵlistener("click", function MenuItemContent_Template_div_click_0_listener($event) {
          ɵɵrestoreView(_r1);
          return ɵɵresetView(ctx.onItemClick($event, ctx.item));
        });
        ɵɵtemplate(1, MenuItemContent_ng_container_1_Template, 3, 2, "ng-container", 3)(2, MenuItemContent_ng_container_2_Template, 2, 4, "ng-container", 3)(3, MenuItemContent_ng_template_3_Template, 5, 4, "ng-template", null, 0, ɵɵtemplateRefExtractor);
        ɵɵelementEnd();
      }
      if (rf & 2) {
        ɵɵclassMap(ctx.cx("itemContent"));
        ɵɵproperty("pBind", ctx.getPTOptions("itemContent"));
        ɵɵattribute("data-pc-section", "content");
        ɵɵadvance();
        ɵɵproperty("ngIf", !ctx.itemTemplate);
        ɵɵadvance();
        ɵɵproperty("ngIf", ctx.itemTemplate);
      }
    },
    dependencies: [CommonModule, NgIf, NgTemplateOutlet, NgStyle, RouterModule, RouterLink, RouterLinkActive, Ripple, TooltipModule, Bind, BadgeModule, Badge, SharedModule, BindModule, SafeHtmlPipe],
    encapsulation: 2
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MenuItemContent, [{
    type: Component,
    args: [{
      selector: "[pMenuItemContent]",
      standalone: true,
      imports: [CommonModule, RouterModule, Ripple, TooltipModule, BadgeModule, SharedModule, SafeHtmlPipe, BindModule],
      template: ` <div [class]="cx('itemContent')" (click)="onItemClick($event, item)" [attr.data-pc-section]="'content'" [pBind]="getPTOptions('itemContent')">
        <ng-container *ngIf="!itemTemplate">
            <a
                *ngIf="!item?.routerLink"
                [attr.title]="item.title"
                [attr.href]="item.url || null"
                [attr.data-automationid]="item.automationId"
                [attr.tabindex]="-1"
                [class]="cn(cx('itemLink'), item?.linkClass)"
                [ngStyle]="item?.linkStyle"
                [target]="item.target"
                [pBind]="getPTOptions('itemLink')"
                pRipple
            >
                <ng-container *ngTemplateOutlet="itemContent; context: { $implicit: item }"></ng-container>
            </a>
            <a
                *ngIf="item?.routerLink"
                [routerLink]="item.routerLink"
                [attr.data-automationid]="item.automationId"
                [attr.tabindex]="-1"
                [attr.title]="item.title"
                [queryParams]="item.queryParams"
                routerLinkActive="p-menu-item-link-active"
                [routerLinkActiveOptions]="item.routerLinkActiveOptions || { exact: false }"
                [class]="cn(cx('itemLink'), item?.linkClass)"
                [ngStyle]="item?.linkStyle"
                [target]="item.target"
                [fragment]="item.fragment"
                [queryParamsHandling]="item.queryParamsHandling"
                [preserveFragment]="item.preserveFragment"
                [skipLocationChange]="item.skipLocationChange"
                [replaceUrl]="item.replaceUrl"
                [state]="item.state"
                [pBind]="getPTOptions('itemLink')"
                pRipple
            >
                <ng-container *ngTemplateOutlet="itemContent; context: { $implicit: item }"></ng-container>
            </a>
        </ng-container>

        <ng-container *ngIf="itemTemplate">
            <ng-template *ngTemplateOutlet="itemTemplate; context: { $implicit: item }"></ng-template>
        </ng-container>

        <ng-template #itemContent>
            <span [class]="cn(cx('itemIcon', { item }), item.iconClass)" [pBind]="getPTOptions('itemIcon')" *ngIf="item.icon" [ngStyle]="item.iconStyle" [attr.data-pc-section]="'itemicon'"></span>
            <span [class]="cn(cx('itemLabel'), item.labelClass)" [ngStyle]="item.labelStyle" [pBind]="getPTOptions('itemLabel')" [attr.data-pc-section]="'itemlabel'" *ngIf="item.escape !== false; else htmlLabel">{{ item.label }}</span>
            <ng-template #htmlLabel><span [class]="cn(cx('itemLabel'), item.labelClass)" [ngStyle]="item.labelStyle" [attr.data-pc-section]="'itemlabel'" [innerHTML]="item.label | safeHtml" [pBind]="getPTOptions('itemLabel')"></span></ng-template>
            <p-badge *ngIf="item.badge" [styleClass]="item.badgeStyleClass" [value]="item.badge" [pt]="getPTOptions('pcBadge')" [unstyled]="unstyled()" />
        </ng-template>
    </div>`,
      encapsulation: ViewEncapsulation.None,
      providers: [MenuStyle]
    }]
  }], () => [{
    type: Menu,
    decorators: [{
      type: Inject,
      args: [forwardRef(() => Menu)]
    }]
  }], {
    item: [{
      type: Input,
      args: ["pMenuItemContent"]
    }],
    itemTemplate: [{
      type: Input
    }],
    menuitemId: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "menuitemId",
        required: false
      }]
    }],
    idx: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "idx",
        required: false
      }]
    }],
    onMenuItemClick: [{
      type: Output
    }]
  });
})();
var Menu = class _Menu extends BaseComponent {
  overlayService;
  /**
   * An array of menuitems.
   * @group Props
   */
  model;
  /**
   * Defines if menu would displayed as a popup.
   * @group Props
   */
  popup;
  /**
   * Inline style of the component.
   * @group Props
   */
  style;
  /**
   * Style class of the component.
   * @group Props
   */
  styleClass;
  /**
   * Whether to automatically manage layering.
   * @group Props
   */
  autoZIndex = true;
  /**
   * Base zIndex value to use in layering.
   * @group Props
   */
  baseZIndex = 0;
  /**
   * Transition options of the show animation.
   * @deprecated since v21.0.0, use `motionOptions` instead.
   * @group Props
   */
  showTransitionOptions = ".12s cubic-bezier(0, 0, 0.2, 1)";
  /**
   * Transition options of the hide animation.
   * @deprecated since v21.0.0, use `motionOptions` instead.
   * @group Props
   */
  hideTransitionOptions = ".1s linear";
  /**
   * Defines a string value that labels an interactive element.
   * @group Props
   */
  ariaLabel;
  /**
   * Identifier of the underlying input element.
   * @group Props
   */
  ariaLabelledBy;
  /**
   * Current id state as a string.
   * @group Props
   */
  id;
  /**
   * Index of the element in tabbing order.
   * @group Props
   */
  tabindex = 0;
  /**
   * Target element to attach the overlay, valid values are "body" or a local ng-template variable of another element (note: use binding with brackets for template variables, e.g. [appendTo]="mydiv" for a div element having #mydiv as variable name).
   * @defaultValue 'self'
   * @group Props
   */
  appendTo = input(void 0, ...ngDevMode ? [{
    debugName: "appendTo"
  }] : []);
  /**
   * The motion options.
   * @group Props
   */
  motionOptions = input(void 0, ...ngDevMode ? [{
    debugName: "motionOptions"
  }] : []);
  computedMotionOptions = computed(() => {
    return __spreadValues(__spreadValues({}, this.ptm("motion")), this.motionOptions());
  }, ...ngDevMode ? [{
    debugName: "computedMotionOptions"
  }] : []);
  /**
   * Callback to invoke when overlay menu is shown.
   * @group Emits
   */
  onShow = new EventEmitter();
  /**
   * Callback to invoke when overlay menu is hidden.
   * @group Emits
   */
  onHide = new EventEmitter();
  /**
   * Callback to invoke when the list loses focus.
   * @param {Event} event - blur event.
   * @group Emits
   */
  onBlur = new EventEmitter();
  /**
   * Callback to invoke when the list receives focus.
   * @param {Event} event - focus event.
   * @group Emits
   */
  onFocus = new EventEmitter();
  listViewChild = viewChild("list", ...ngDevMode ? [{
    debugName: "listViewChild"
  }] : []);
  containerViewChild = viewChild("container", ...ngDevMode ? [{
    debugName: "containerViewChild"
  }] : []);
  $appendTo = computed(() => this.appendTo() || this.config.overlayAppendTo(), ...ngDevMode ? [{
    debugName: "$appendTo"
  }] : []);
  container;
  scrollHandler;
  documentClickListener;
  documentResizeListener;
  preventDocumentDefault;
  target;
  visible;
  focusedOptionId = computed(() => {
    return this.focusedOptionIndex() !== -1 ? this.focusedOptionIndex() : null;
  }, ...ngDevMode ? [{
    debugName: "focusedOptionId"
  }] : []);
  focusedOptionIndex = signal(-1, ...ngDevMode ? [{
    debugName: "focusedOptionIndex"
  }] : []);
  selectedOptionIndex = signal(-1, ...ngDevMode ? [{
    debugName: "selectedOptionIndex"
  }] : []);
  focused = false;
  overlayVisible = false;
  $pcMenu = inject(MENU_INSTANCE, {
    optional: true,
    skipSelf: true
  }) ?? void 0;
  _componentStyle = inject(MenuStyle);
  bindDirectiveInstance = inject(Bind, {
    self: true
  });
  onAfterViewChecked() {
    this.bindDirectiveInstance.setAttrs(this.ptm("host"));
  }
  constructor(overlayService) {
    super();
    this.overlayService = overlayService;
    this.id = this.id || s("pn_id_");
  }
  getPTOptions(key, item, index, id) {
    return this.ptm(key, {
      context: {
        item,
        index,
        focused: this.isItemFocused(id),
        disabled: this.disabled(item.disabled)
      }
    });
  }
  /**
   * Toggles the visibility of the popup menu.
   * @param {Event} event - Browser event.
   * @group Method
   */
  toggle(event) {
    if (this.visible) this.hide();
    else this.show(event);
    this.preventDocumentDefault = true;
  }
  /**
   * Displays the popup menu.
   * @param {Event} event - Browser event.
   * @group Method
   */
  show(event) {
    if (this.container && !this.overlayVisible) {
      this.container = void 0;
    }
    this.target = event.currentTarget;
    this.visible = true;
    this.preventDocumentDefault = true;
    this.overlayVisible = true;
    this.cd.markForCheck();
  }
  onInit() {
    if (!this.popup) {
      this.bindDocumentClickListener();
    }
  }
  /**
   * Defines template option for start.
   * @group Templates
   */
  startTemplate;
  _startTemplate;
  /**
   * Defines template option for end.
   * @group Templates
   */
  endTemplate;
  _endTemplate;
  /**
   * Defines template option for header.
   * @group Templates
   */
  headerTemplate;
  _headerTemplate;
  /**
   * Custom item template.
   * @param {MenuItemTemplateContext} context - item context.
   * @see {@link MenuItemTemplateContext}
   * @group Templates
   */
  itemTemplate;
  _itemTemplate;
  /**
   * Custom submenu header template.
   * @param {MenuSubmenuHeaderTemplateContext} context - submenu header context.
   * @see {@link MenuSubmenuHeaderTemplateContext}
   * @group Templates
   */
  submenuHeaderTemplate;
  _submenuHeaderTemplate;
  templates;
  onAfterContentInit() {
    this.templates?.forEach((item) => {
      switch (item.getType()) {
        case "start":
          this._startTemplate = item.template;
          break;
        case "end":
          this._endTemplate = item.template;
          break;
        case "item":
          this._itemTemplate = item.template;
          break;
        case "submenuheader":
          this._submenuHeaderTemplate = item.template;
          break;
        default:
          this._itemTemplate = item.template;
          break;
      }
    });
  }
  getTabIndexValue() {
    return this.tabindex !== void 0 ? this.tabindex.toString() : null;
  }
  onOverlayBeforeEnter(event) {
    this.container = event.element;
    if (this.container) {
      const nativeElementOuterWidth = v(this.containerViewChild()?.nativeElement);
      S(this.container, {
        width: nativeElementOuterWidth + "px"
      });
      S(this.container, {
        position: "absolute",
        top: "0"
      });
      this.appendOverlay();
      this.moveOnTop();
      this.$attrSelector && this.container?.setAttribute(this.$attrSelector, "");
      this.bindDocumentClickListener();
      this.bindDocumentResizeListener();
      this.bindScrollListener();
      D(this.container, this.target);
      bt(this.listViewChild()?.nativeElement);
      this.onShow.emit({});
    }
  }
  onOverlayAfterLeave() {
    this.restoreOverlayAppend();
    this.onOverlayHide();
    this.onHide.emit({});
  }
  appendOverlay() {
    if (this.$appendTo() && this.$appendTo() !== "self") {
      if (this.$appendTo() === "body") {
        ut(this.document.body, this.container);
      } else {
        ut(this.$appendTo(), this.container);
      }
    }
  }
  restoreOverlayAppend() {
    if (this.container && this.$appendTo() !== "self") {
      ut(this.el.nativeElement, this.container);
    }
  }
  moveOnTop() {
    if (this.autoZIndex) {
      zindexutils.set("menu", this.container, this.baseZIndex + this.config.zIndex.menu);
    }
  }
  /**
   * Hides the popup menu.
   * @group Method
   */
  hide() {
    this.visible = false;
    this.overlayVisible = false;
    this.cd.markForCheck();
  }
  onWindowResize() {
    if (this.visible && !Yt()) {
      this.hide();
    }
  }
  menuitemId(item, id, index, childIndex) {
    return item?.id ?? `${id}_${index}${childIndex !== void 0 ? "_" + childIndex : ""}`;
  }
  isItemFocused(id) {
    return this.focusedOptionId() === id;
  }
  label(label) {
    return typeof label === "function" ? label() : label;
  }
  disabled(disabled) {
    return typeof disabled === "function" ? disabled() : typeof disabled === "undefined" ? false : disabled;
  }
  activedescendant() {
    return this.focused ? this.focusedOptionId() : void 0;
  }
  onListFocus(event) {
    if (!this.focused) {
      this.focused = true;
      !this.popup && this.changeFocusedOptionIndex(0);
      this.onFocus.emit(event);
    }
  }
  onListBlur(event) {
    if (this.focused) {
      this.focused = false;
      this.changeFocusedOptionIndex(-1);
      this.selectedOptionIndex.set(-1);
      this.focusedOptionIndex.set(-1);
      this.onBlur.emit(event);
    }
  }
  onListKeyDown(event) {
    switch (event.code) {
      case "ArrowDown":
        this.onArrowDownKey(event);
        break;
      case "ArrowUp":
        this.onArrowUpKey(event);
        break;
      case "Home":
        this.onHomeKey(event);
        break;
      case "End":
        this.onEndKey(event);
        break;
      case "Enter":
        this.onEnterKey(event);
        break;
      case "NumpadEnter":
        this.onEnterKey(event);
        break;
      case "Space":
        this.onSpaceKey(event);
        break;
      case "Escape":
      case "Tab":
        if (this.popup) {
          bt(this.target);
          this.hide();
        }
        this.overlayVisible && this.hide();
        break;
      default:
        break;
    }
  }
  onArrowDownKey(event) {
    const optionIndex = this.findNextOptionIndex(this.focusedOptionIndex());
    this.changeFocusedOptionIndex(optionIndex);
    event.preventDefault();
  }
  onArrowUpKey(event) {
    if (event.altKey && this.popup) {
      bt(this.target);
      this.hide();
      event.preventDefault();
    } else {
      const optionIndex = this.findPrevOptionIndex(this.focusedOptionIndex());
      this.changeFocusedOptionIndex(optionIndex);
      event.preventDefault();
    }
  }
  onHomeKey(event) {
    this.changeFocusedOptionIndex(0);
    event.preventDefault();
  }
  onEndKey(event) {
    this.changeFocusedOptionIndex(Y(this.containerViewChild()?.nativeElement, 'li[data-pc-section="menuitem"][data-p-disabled="false"]').length - 1);
    event.preventDefault();
  }
  onEnterKey(event) {
    const element = z(this.containerViewChild()?.nativeElement, `li[id="${`${this.focusedOptionIndex()}`}"]`);
    const anchorElement = element && (z(element, '[data-pc-section="itemlink"]') || z(element, "a,button"));
    this.popup && bt(this.target);
    anchorElement ? anchorElement.click() : element && element.click();
    event.preventDefault();
  }
  onSpaceKey(event) {
    this.onEnterKey(event);
  }
  findNextOptionIndex(index) {
    const links = Y(this.containerViewChild()?.nativeElement, 'li[data-pc-section="menuitem"][data-p-disabled="false"]');
    const matchedOptionIndex = [...links].findIndex((link) => link.id === index);
    return matchedOptionIndex > -1 ? matchedOptionIndex + 1 : 0;
  }
  findPrevOptionIndex(index) {
    const links = Y(this.containerViewChild()?.nativeElement, 'li[data-pc-section="menuitem"][data-p-disabled="false"]');
    const matchedOptionIndex = [...links].findIndex((link) => link.id === index);
    return matchedOptionIndex > -1 ? matchedOptionIndex - 1 : 0;
  }
  changeFocusedOptionIndex(index) {
    const links = Y(this.containerViewChild()?.nativeElement, 'li[data-pc-section="menuitem"][data-p-disabled="false"]');
    if (links.length > 0) {
      let order = index >= links.length ? links.length - 1 : index < 0 ? 0 : index;
      order > -1 && this.focusedOptionIndex.set(links[order].getAttribute("id"));
    }
  }
  itemClick(event, id) {
    const {
      originalEvent,
      item
    } = event;
    if (!this.focused) {
      this.focused = true;
      this.onFocus.emit();
    }
    if (item.disabled) {
      originalEvent.preventDefault();
      return;
    }
    if (!item.url && !item.routerLink) {
      originalEvent.preventDefault();
    }
    if (item.command) {
      item.command({
        originalEvent,
        item
      });
    }
    if (this.popup) {
      this.hide();
    }
    if (!this.popup && this.focusedOptionIndex() !== id) {
      this.focusedOptionIndex.set(id);
    }
  }
  onOverlayClick(event) {
    if (this.popup) {
      this.overlayService.add({
        originalEvent: event,
        target: this.el.nativeElement
      });
    }
    this.preventDocumentDefault = true;
  }
  bindDocumentClickListener() {
    if (!this.documentClickListener && isPlatformBrowser(this.platformId)) {
      const documentTarget = this.el ? this.el.nativeElement.ownerDocument : "document";
      this.documentClickListener = this.renderer.listen(documentTarget, "click", (event) => {
        const isOutsideContainer = this.containerViewChild()?.nativeElement && !this.containerViewChild()?.nativeElement.contains(event.target);
        const isOutsideTarget = !(this.target && (this.target === event.target || this.target.contains(event.target)));
        if (!this.popup && isOutsideContainer && isOutsideTarget) {
          this.onListBlur(event);
        }
        if (this.preventDocumentDefault && this.overlayVisible && isOutsideContainer && isOutsideTarget) {
          this.hide();
          this.preventDocumentDefault = false;
        }
      });
    }
  }
  unbindDocumentClickListener() {
    if (this.documentClickListener) {
      this.documentClickListener();
      this.documentClickListener = null;
    }
  }
  bindDocumentResizeListener() {
    if (!this.documentResizeListener && isPlatformBrowser(this.platformId)) {
      const window = this.document.defaultView;
      this.documentResizeListener = this.renderer.listen(window, "resize", this.onWindowResize.bind(this));
    }
  }
  unbindDocumentResizeListener() {
    if (this.documentResizeListener) {
      this.documentResizeListener();
      this.documentResizeListener = null;
    }
  }
  bindScrollListener() {
    if (!this.scrollHandler && isPlatformBrowser(this.platformId)) {
      this.scrollHandler = new ConnectedOverlayScrollHandler(this.target, () => {
        if (this.visible) {
          this.hide();
        }
      });
    }
    this.scrollHandler?.bindScrollListener();
  }
  unbindScrollListener() {
    if (this.scrollHandler) {
      this.scrollHandler.unbindScrollListener();
      this.scrollHandler = null;
    }
  }
  onOverlayHide() {
    this.unbindDocumentClickListener();
    this.unbindDocumentResizeListener();
    this.unbindScrollListener();
    this.preventDocumentDefault = false;
    if (!this.cd.destroyed) {
      this.target = null;
    }
    if (this.container) {
      if (this.autoZIndex) {
        zindexutils.clear(this.container);
      }
      this.container = void 0;
    }
  }
  onDestroy() {
    if (this.popup) {
      if (this.scrollHandler) {
        this.scrollHandler.destroy();
        this.scrollHandler = null;
      }
      if (this.container) {
        if (this.autoZIndex) {
          zindexutils.clear(this.container);
        }
        this.container = void 0;
      }
      this.restoreOverlayAppend();
      this.onOverlayHide();
    }
    if (!this.popup) {
      this.unbindDocumentClickListener();
    }
  }
  hasSubMenu() {
    return this.model?.some((item) => item.items) ?? false;
  }
  isItemHidden(item) {
    if (item.separator) {
      return item.visible === false || item.items && item.items.some((subitem) => subitem.visible !== false);
    }
    return item.visible === false;
  }
  get dataP() {
    return this.cn({
      popup: this.popup
    });
  }
  static ɵfac = function Menu_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Menu)(ɵɵdirectiveInject(OverlayService));
  };
  static ɵcmp = ɵɵdefineComponent({
    type: _Menu,
    selectors: [["p-menu"]],
    contentQueries: function Menu_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        ɵɵcontentQuery(dirIndex, _c4, 4)(dirIndex, _c5, 4)(dirIndex, _c6, 4)(dirIndex, _c7, 4)(dirIndex, _c8, 4)(dirIndex, PrimeTemplate, 4);
      }
      if (rf & 2) {
        let _t;
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.startTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.endTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.headerTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.itemTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.submenuHeaderTemplate = _t.first);
        ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.templates = _t);
      }
    },
    viewQuery: function Menu_Query(rf, ctx) {
      if (rf & 1) {
        ɵɵviewQuerySignal(ctx.listViewChild, _c9, 5)(ctx.containerViewChild, _c10, 5);
      }
      if (rf & 2) {
        ɵɵqueryAdvance(2);
      }
    },
    inputs: {
      model: "model",
      popup: [2, "popup", "popup", booleanAttribute],
      style: "style",
      styleClass: "styleClass",
      autoZIndex: [2, "autoZIndex", "autoZIndex", booleanAttribute],
      baseZIndex: [2, "baseZIndex", "baseZIndex", numberAttribute],
      showTransitionOptions: "showTransitionOptions",
      hideTransitionOptions: "hideTransitionOptions",
      ariaLabel: "ariaLabel",
      ariaLabelledBy: "ariaLabelledBy",
      id: "id",
      tabindex: [2, "tabindex", "tabindex", numberAttribute],
      appendTo: [1, "appendTo"],
      motionOptions: [1, "motionOptions"]
    },
    outputs: {
      onShow: "onShow",
      onHide: "onHide",
      onBlur: "onBlur",
      onFocus: "onFocus"
    },
    features: [ɵɵProvidersFeature([MenuStyle, {
      provide: MENU_INSTANCE,
      useExisting: _Menu
    }, {
      provide: PARENT_INSTANCE,
      useExisting: _Menu
    }]), ɵɵHostDirectivesFeature([Bind]), ɵɵInheritDefinitionFeature],
    decls: 4,
    vars: 1,
    consts: [["sharedcontent", ""], ["container", ""], ["list", ""], ["htmlSubmenuLabel", ""], ["name", "p-anchored-overlay", 3, "visible", "appear", "options"], ["name", "p-anchored-overlay", 3, "onBeforeEnter", "onAfterLeave", "visible", "appear", "options"], [4, "ngTemplateOutlet"], [3, "click", "ngStyle", "pBind"], [3, "class", "pBind", 4, "ngIf"], ["role", "menu", 3, "focus", "blur", "keydown", "pBind"], [4, "ngIf"], [3, "pBind"], ["ngFor", "", 3, "ngForOf"], ["role", "separator", 3, "class", "pBind", 4, "ngIf"], ["pTooltip", "", "role", "none", 3, "class", "pBind", "tooltipOptions", "pTooltipUnstyled", 4, "ngIf"], ["role", "separator", 3, "pBind"], ["pTooltip", "", "role", "none", 3, "pBind", "tooltipOptions", "pTooltipUnstyled"], [4, "ngTemplateOutlet", "ngTemplateOutletContext"], [4, "ngIf", "ngIfElse"], [3, "innerHTML"], ["pTooltip", "", "role", "menuitem", 3, "class", "pMenuItemContent", "itemTemplate", "idx", "menuitemId", "style", "tooltipOptions", "pTooltipUnstyled", "unstyled", "onMenuItemClick", 4, "ngIf"], ["pTooltip", "", "role", "menuitem", 3, "onMenuItemClick", "pMenuItemContent", "itemTemplate", "idx", "menuitemId", "tooltipOptions", "pTooltipUnstyled", "unstyled"], ["pTooltip", "", "role", "menuitem", 3, "class", "pMenuItemContent", "itemTemplate", "idx", "menuitemId", "ngStyle", "tooltipOptions", "unstyled", "pTooltipUnstyled", "onMenuItemClick", 4, "ngIf"], ["pTooltip", "", "role", "menuitem", 3, "onMenuItemClick", "pMenuItemContent", "itemTemplate", "idx", "menuitemId", "ngStyle", "tooltipOptions", "unstyled", "pTooltipUnstyled"]],
    template: function Menu_Template(rf, ctx) {
      if (rf & 1) {
        ɵɵconditionalCreate(0, Menu_Conditional_0_Template, 2, 4, "p-motion", 4)(1, Menu_Conditional_1_Template, 1, 1, "ng-container");
        ɵɵtemplate(2, Menu_ng_template_2_Template, 8, 21, "ng-template", null, 0, ɵɵtemplateRefExtractor);
      }
      if (rf & 2) {
        ɵɵconditional(ctx.popup ? 0 : 1);
      }
    },
    dependencies: [CommonModule, NgForOf, NgIf, NgTemplateOutlet, NgStyle, RouterModule, MenuItemContent, TooltipModule, Tooltip, Bind, BadgeModule, SharedModule, BindModule, MotionModule, Motion, SafeHtmlPipe],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Menu, [{
    type: Component,
    args: [{
      selector: "p-menu",
      standalone: true,
      imports: [CommonModule, RouterModule, MenuItemContent, TooltipModule, BadgeModule, SharedModule, SafeHtmlPipe, BindModule, MotionModule],
      template: `
        @if (popup) {
            <p-motion [visible]="visible" [appear]="popup" name="p-anchored-overlay" [options]="computedMotionOptions()" (onBeforeEnter)="onOverlayBeforeEnter($event)" (onAfterLeave)="onOverlayAfterLeave()">
                <ng-container *ngTemplateOutlet="sharedcontent"></ng-container>
            </p-motion>
        } @else {
            <ng-container *ngTemplateOutlet="sharedcontent"></ng-container>
        }
        <ng-template #sharedcontent>
            <div #container [class]="cn(cx('root'), styleClass)" [style]="sx('root')" [ngStyle]="style" (click)="onOverlayClick($event)" [attr.id]="id" [pBind]="ptm('root')" [attr.data-p]="dataP">
                <div *ngIf="startTemplate ?? _startTemplate" [class]="cx('start')" [pBind]="ptm('start')" [attr.data-pc-section]="'start'">
                    <ng-container *ngTemplateOutlet="startTemplate ?? _startTemplate"></ng-container>
                </div>
                <ul
                    #list
                    [class]="cx('list')"
                    [pBind]="ptm('list')"
                    role="menu"
                    [attr.id]="id + '_list'"
                    [attr.tabindex]="getTabIndexValue()"
                    [attr.data-pc-section]="'menu'"
                    [attr.aria-activedescendant]="activedescendant()"
                    [attr.aria-label]="ariaLabel"
                    [attr.aria-labelledBy]="ariaLabelledBy"
                    (focus)="onListFocus($event)"
                    (blur)="onListBlur($event)"
                    (keydown)="onListKeyDown($event)"
                >
                    <ng-template ngFor let-submenu let-i="index" [ngForOf]="model" *ngIf="hasSubMenu()">
                        <li [class]="cx('separator')" [pBind]="ptm('separator')" *ngIf="submenu.separator && submenu.visible !== false" role="separator" [attr.data-pc-section]="'separator'"></li>
                        <li
                            [class]="cx('submenuLabel')"
                            [pBind]="ptm('submenuLabel')"
                            [attr.data-automationid]="submenu.automationId"
                            *ngIf="!submenu.separator"
                            pTooltip
                            [tooltipOptions]="submenu.tooltipOptions"
                            [pTooltipUnstyled]="unstyled()"
                            role="none"
                            [attr.id]="menuitemId(submenu, id, i)"
                            [attr.data-pc-section]="'submenulabel'"
                        >
                            <ng-container *ngIf="!submenuHeaderTemplate && !_submenuHeaderTemplate">
                                <span *ngIf="submenu.escape !== false; else htmlSubmenuLabel">{{ submenu.label }}</span>
                                <ng-template #htmlSubmenuLabel><span [innerHTML]="submenu.label | safeHtml"></span></ng-template>
                            </ng-container>
                            <ng-container *ngTemplateOutlet="submenuHeaderTemplate ?? _submenuHeaderTemplate; context: { $implicit: submenu }"></ng-container>
                        </li>
                        <ng-template ngFor let-item let-j="index" [ngForOf]="submenu.items">
                            <li [class]="cx('separator')" [pBind]="ptm('separator')" *ngIf="item.separator && (item.visible !== false || submenu.visible !== false)" role="separator" [attr.data-pc-section]="'separator'"></li>
                            <li
                                [class]="cn(cx('item', { item, id: menuitemId(item, id, i, j) }), item?.styleClass)"
                                *ngIf="!item.separator && item.visible !== false && (item.visible !== undefined || submenu.visible !== false)"
                                [pMenuItemContent]="item"
                                [itemTemplate]="itemTemplate ?? _itemTemplate"
                                [idx]="j"
                                [menuitemId]="menuitemId(item, id, i, j)"
                                [style]="item.style"
                                (onMenuItemClick)="itemClick($event, menuitemId(item, id, i, j))"
                                pTooltip
                                [tooltipOptions]="item.tooltipOptions"
                                [pTooltipUnstyled]="unstyled()"
                                [unstyled]="unstyled()"
                                role="menuitem"
                                [attr.data-pc-section]="'menuitem'"
                                [attr.aria-label]="label(item.label)"
                                [attr.data-p-focused]="isItemFocused(menuitemId(item, id, i, j))"
                                [attr.data-p-disabled]="disabled(item.disabled)"
                                [attr.aria-disabled]="disabled(item.disabled)"
                                [attr.id]="menuitemId(item, id, i, j)"
                            ></li>
                        </ng-template>
                    </ng-template>
                    <ng-template ngFor let-item let-i="index" [ngForOf]="model" *ngIf="!hasSubMenu()">
                        <li [class]="cx('separator')" [pBind]="ptm('separator')" *ngIf="item.separator && item.visible !== false" role="separator" [attr.data-pc-section]="'separator'"></li>
                        <li
                            [class]="cn(cx('item', { item, id: menuitemId(item, id, i) }), item?.styleClass)"
                            *ngIf="!item.separator && item.visible !== false"
                            [pMenuItemContent]="item"
                            [itemTemplate]="itemTemplate ?? _itemTemplate"
                            [idx]="i"
                            [menuitemId]="menuitemId(item, id, i)"
                            [ngStyle]="item.style"
                            (onMenuItemClick)="itemClick($event, menuitemId(item, id, i))"
                            pTooltip
                            [tooltipOptions]="item.tooltipOptions"
                            [unstyled]="unstyled()"
                            [pTooltipUnstyled]="unstyled()"
                            role="menuitem"
                            [attr.data-pc-section]="'menuitem'"
                            [attr.aria-label]="label(item.label)"
                            [attr.data-p-focused]="isItemFocused(menuitemId(item, id, i))"
                            [attr.data-p-disabled]="disabled(item.disabled)"
                            [attr.aria-disabled]="disabled(item.disabled)"
                            [attr.id]="menuitemId(item, id, i)"
                        ></li>
                    </ng-template>
                </ul>
                <div *ngIf="endTemplate ?? _endTemplate" [class]="cx('end')" [pBind]="ptm('end')" [attr.data-pc-section]="'end'">
                    <ng-container *ngTemplateOutlet="endTemplate ?? _endTemplate"></ng-container>
                </div>
            </div>
        </ng-template>
    `,
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      providers: [MenuStyle, {
        provide: MENU_INSTANCE,
        useExisting: Menu
      }, {
        provide: PARENT_INSTANCE,
        useExisting: Menu
      }],
      hostDirectives: [Bind]
    }]
  }], () => [{
    type: OverlayService
  }], {
    model: [{
      type: Input
    }],
    popup: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    style: [{
      type: Input
    }],
    styleClass: [{
      type: Input
    }],
    autoZIndex: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    baseZIndex: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    showTransitionOptions: [{
      type: Input
    }],
    hideTransitionOptions: [{
      type: Input
    }],
    ariaLabel: [{
      type: Input
    }],
    ariaLabelledBy: [{
      type: Input
    }],
    id: [{
      type: Input
    }],
    tabindex: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    appendTo: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "appendTo",
        required: false
      }]
    }],
    motionOptions: [{
      type: Input,
      args: [{
        isSignal: true,
        alias: "motionOptions",
        required: false
      }]
    }],
    onShow: [{
      type: Output
    }],
    onHide: [{
      type: Output
    }],
    onBlur: [{
      type: Output
    }],
    onFocus: [{
      type: Output
    }],
    listViewChild: [{
      type: ViewChild,
      args: ["list", {
        isSignal: true
      }]
    }],
    containerViewChild: [{
      type: ViewChild,
      args: ["container", {
        isSignal: true
      }]
    }],
    startTemplate: [{
      type: ContentChild,
      args: ["start", {
        descendants: false
      }]
    }],
    endTemplate: [{
      type: ContentChild,
      args: ["end", {
        descendants: false
      }]
    }],
    headerTemplate: [{
      type: ContentChild,
      args: ["header", {
        descendants: false
      }]
    }],
    itemTemplate: [{
      type: ContentChild,
      args: ["item", {
        descendants: false
      }]
    }],
    submenuHeaderTemplate: [{
      type: ContentChild,
      args: ["submenuheader", {
        descendants: false
      }]
    }],
    templates: [{
      type: ContentChildren,
      args: [PrimeTemplate]
    }]
  });
})();
var MenuModule = class _MenuModule {
  static ɵfac = function MenuModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MenuModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _MenuModule,
    imports: [Menu, SharedModule, SafeHtmlPipe],
    exports: [Menu, SharedModule, SafeHtmlPipe]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [Menu, SharedModule, SharedModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MenuModule, [{
    type: NgModule,
    args: [{
      imports: [Menu, SharedModule, SafeHtmlPipe],
      exports: [Menu, SharedModule, SafeHtmlPipe]
    }]
  }], null, null);
})();
export {
  Menu,
  MenuClasses,
  MenuItemContent,
  MenuModule,
  MenuStyle,
  SafeHtmlPipe
};
//# sourceMappingURL=primeng_menu.js.map
