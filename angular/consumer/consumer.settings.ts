
module docusign {
    export class settings {
        //Will be set by razor
        public static apiRoot: string = '';
        public static isSecureLinkTestMode: boolean = false;
        public static isTokenValid: boolean = false; 
        public static authenticationViewModel: cls.SecureLinkAuthenticationViewModel = null;  
    } 
}