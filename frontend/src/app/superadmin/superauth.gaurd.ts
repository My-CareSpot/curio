import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from "@angular/router";
import { Observable } from "rxjs";
import { LocalService } from '../local.service';

@Injectable({
  providedIn: "root"
})
export class SuperAdminAuthGuard implements CanActivate {
  constructor(private myRoute: Router,private localServ: LocalService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    
    if (this.localServ.getJsonValue("isSuperAdmin")) {
      return true;
    } else {
      this.myRoute.navigate(["admin"]);
      return false;
    }
  }
}
