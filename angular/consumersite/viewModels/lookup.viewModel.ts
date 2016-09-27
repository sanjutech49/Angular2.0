/// <reference path='../../../angular/ts/extendedViewModels/asset.extendedViewModel.ts' />

module consumersite.vm {

    export interface ILookupEntry<T> {
        text: string;
        value: T;
        isDisabled?: boolean;
        context?: Object;
    }
}