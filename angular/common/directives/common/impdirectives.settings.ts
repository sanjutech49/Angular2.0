module impdirectives.settings {
    
    /**
    * @desc: Properties that can be set on a impTextarea directive
    */
    export interface IIMPTextareaSettings {
        numberOfRows: number;
        numberOfCharacters: number;
        message: string;
    }

    export class IMPTextareaSettings implements IIMPTextareaSettings {
        numberOfRows: number;
        numberOfCharacters: number;
        message: string;
        constructor(private settings: IIMPTextareaSettings) {
            this.numberOfRows = !!this.settings && !!this.settings.numberOfRows ? this.settings.numberOfRows : 6;
            this.numberOfCharacters = !!this.settings && !!this.settings.numberOfCharacters ? this.settings.numberOfCharacters : 750;
            this.message = !!this.settings && !!this.settings.message ? this.settings.message : 'You have reached max character length!';
        }
    }

    /**
    * @desc: Properties that can be set on a impTextbox directive
    */
    export interface IIMPTextboxSettings {
        textboxDescription: string;
    }

    export class IMPTextboxSettings implements IIMPTextboxSettings {
        textboxDescription: string;
        constructor(private settings?: IIMPTextboxSettings) {
            this.textboxDescription = !!this.settings && !!this.settings.textboxDescription ? this.settings.textboxDescription : '';
        }
    }
}
