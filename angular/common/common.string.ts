module common {

    export module string {

        /**
        * @desc Returns true if string is null or white spaces.
        */
        export function isNullOrWhiteSpace(value: string): boolean {
            try {
                return (value == null || value.trim().length === 0);
            } catch (ex) {
                return true;
            }
        }

        /**
        * @desc Returns true if string has the value of Guid.Empty.
        */
        export function isEmptyGuid(value: string): boolean {
            return value === "00000000-0000-0000-0000-000000000000";
        }

        /**
        * @desc Returns true if string guid is null or whitespace or has the value of Guid.Empty.
        */
        export function isEmptyGuidOrNull(value: string): boolean {
            return isNullOrWhiteSpace(value) || isEmptyGuid(value);
        }

        /**
        * @desc Builds comma separated string from collection of strings.
        */
        export function buildCommaSeparatedString(stringCollection: Array<string>): string {
            var retVal: string = '';

            if (stringCollection != null && stringCollection.length > 0) {

                // Build comma separated string.
                for (var i = 0; i < stringCollection.length; i++) {
                    retVal += stringCollection[i];
                    retVal += ', ';
                }

                // Clean up.
                retVal = retVal.trim();

                // Remove trailing comma.
                if (retVal.length > 0 && retVal.substring(retVal.length - 1) == ',')
                    retVal = retVal.substring(0, retVal.length - 1);
            }

            return retVal;
        }

        /**
        * @desc Converts string to boolean.
        */
        export function toBool(value: string): boolean {
            if (!!value) {
                if (value.toLowerCase() == "false" || value == "0") {
                    return false;
                }
                else if (value.toLowerCase() == "true" || value == "1") {
                    return true;
                }
                else {
                    throw new Error("Invalid cast");
                }
            }

            return null;
        }
    }
}