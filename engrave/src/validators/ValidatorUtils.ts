export class ValidatorUtils {
    
    static isExist(value: any) {
        if (value != null && value != undefined) return true;
        else return false;
    }

    static isEmpty(value: any) {
        if (value == "") return true;
        else return false;
    }
}