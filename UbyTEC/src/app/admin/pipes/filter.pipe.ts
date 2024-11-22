// Crear un nuevo archivo filter.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter',
    standalone: true
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], cedulaAdmin: string, field: string): any[] {
        if (!items || !cedulaAdmin) return [];
        return items.filter(item => item[field] === cedulaAdmin);
    }
}
