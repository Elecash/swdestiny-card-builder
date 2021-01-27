import { Pipe, PipeTransform } from '@angular/core';
import { parseCardText } from '../die/die.utils';

@Pipe({
    name: 'swdTextFormat'
})
export class TextFormatPipe implements PipeTransform{
    transform(value: string): string {
        const symbols = value.match(/\$(.*?)\$/g);
        if (symbols) {
            symbols.forEach(s => {
                const symbol = parseCardText(s).replace(/\$/g, '');
                value = value.replace(s, `<span class="swd-icon">${symbol}</span>`);
            });
        }

        const bolds = value.match(/\*(.*?)\*/g);
        if (bolds) {
            bolds.forEach(b => {
                const bold = b.replace(/\*/g, '');
                value = value.replace(b, `<span class="card-text--bold">${bold}</span>`);
            });
        }

        const italics = value.match(/_(.*?)_/g);
        if (italics) {
            italics.forEach(i => {
                const italic = i.replace(/_/g, '');
                value = value.replace(i, `<span class="card-text--italic">${italic}</span>`);
            });
        }

        const lineBreaks = value.match(/\/\//g);
        if (lineBreaks) {
            lineBreaks.forEach(lb => value = value.replace(lb, `<span class='line-break'></span>`));
        }

        return value;
    }
}
