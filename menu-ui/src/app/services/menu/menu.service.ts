import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ItemSummary} from "./item-summary.model";
import {MenuKey} from "./menu-key.model";
import {ItemDetail} from "./item-detail.model";
import {MenuInfo} from "./menu-info.model";
import {map} from "rxjs/operators";

@Injectable()
export class MenuService {
  private readonly apiURL: string = environment._API_URL_V2;

  constructor(private http: HttpClient) {
  }

  public createEmptyMenu(destination, location): Observable<any> {
    return this.http.post(`${this.apiURL}/emm/${destination}/${location}`, {responseType: 'text'});
  }

  public copyMenu(menuCopy): Observable<any> {
    return this.http.post(`${this.apiURL}/emm/menu-copy`, menuCopy);
  }

  public getMenuItems(menuKey: MenuKey, path: string = '$.categories'): Observable<ItemSummary[]> {
    return this.http.get<ItemSummary[]>(`${this.getMenuBaseUrl(menuKey)}?path=${encodeURI(path)}`);
  }

  public getMenuItem(menuKey: MenuKey, path: string): Observable<ItemDetail> {
    return this.http.get<ItemDetail>(`${this.getMenuBaseUrl(menuKey)}?path=${encodeURI(path)}`);
  }

  private getMenuBaseUrl(menuKey: MenuKey): string {
    return `${this.apiURL}/emm/${menuKey.destination}/${menuKey.location}`;
  }

  public getMenuInfo(menuKey: MenuKey): Observable<MenuInfo> {
    return this.http.get<MenuInfo>(`${this.getMenuBaseUrl(menuKey)}/info`);
  }

  public updateMenuItem(menuKey: MenuKey, path: string, updates: Object): Observable<ItemDetail> {
    return this.http.put<ItemDetail>(`${this.getMenuBaseUrl(menuKey)}?path=${encodeURI(path)}`, updates);
  }

  public deleteMenuItem(menuKey: MenuKey, item): Observable<any> {
    return this.patchMenu(menuKey, [{
      op: 'remove',
      path: item.jsonPath
    }]);
  }

  public deleteMenuItemCascade(menuKey: MenuKey, jsonPath): Observable<any> {
    console.log('Delete cascade path: ' + jsonPath);
    return this.patchMenu(menuKey, [{
      op: 'remove',
      path: jsonPath
    }]);
  }

  public evaluateJsonPath(menuKey: MenuKey, path: string): Observable<any> {
    return this.http.get(`${this.apiURL}/emm/json-path/${menuKey.destination}/${menuKey.location}?path=` + encodeURI(path));
  }

  public getDeleteCascadePath(parentPath, childTag) {
    return parentPath + '..items' + this.getNodeTag(childTag);
  }

  public getParentCascadePathForAll(parentTag) {
    return '$..' + this.getNodeTag(parentTag);
  }

  public getParentCascadePathForSubmenu(subMenuPath, parentTag) {
    return subMenuPath + '..' + this.getNodeTag(parentTag);
  }

  public getNodeTag(tag) {
    return '[?(@.tag == \'' + tag + '\')]';
  }

  public moveMenuItem(menuKey: MenuKey, from: String, to: String): Observable<any> {
    return this.http.patch(`${this.getMenuBaseUrl(menuKey)}`, [{
      op: 'move',
      from,
      path: to
    }]);
  }

  public addMenuItem(menuKey: MenuKey, parent, child): Observable<any> {
    return this.patchMenu(menuKey, [{
      op: 'add',
      path: parent ? parent.jsonPath : '$',
      value: child.tag
    }]);
  }

  public addMenuItemCascade(menuKey: MenuKey, parentPath, childTag): Observable<any> {
    console.log('Add cascade path: ' + parentPath);
    return this.patchMenu(menuKey, [{
      op: 'add',
      path: parentPath,
      value: childTag
    }]);
  }

  public resetMenu(menuKey: MenuKey): Observable<any> {
    return this.http.get(`${this.apiURL}/menu/reset/${menuKey.destination}/${menuKey.location}`);
  }

  private patchMenu(menuKey: MenuKey, patch: Object[]) {
    return this.http.patch(`${this.getMenuBaseUrl(menuKey)}`, patch);
  }
}
