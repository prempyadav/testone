import { Pipe, PipeTransform } from '@angular/core'
import { L10nService } from '../Services/L10n.service'

@Pipe({ name: 'toL10' })
export class L10nPipe implements PipeTransform
{
    constructor(private _l10Service: L10nService)
    {
        
    }
    transform(value: string, language?:string) {
        return this._l10Service.getL10String(value, language);
    }
}