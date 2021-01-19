import { CoreHelperService, LogOutStaticHelper } from "../services/core-helper.service";

export function CommonUIMethodsDecorator(): Function {
    return (target: Function) => {
        target.prototype.logOutUser = (coreHelperService: CoreHelperService) => {
            return LogOutStaticHelper.logoutUser(coreHelperService);
        }
    }
}