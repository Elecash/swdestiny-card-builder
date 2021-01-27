const symbols = {
    M: 'A',
    G: 'B',
    I: 'C',
    S: 'D',
    R: 'E',
    D: 'F',
    C: 'G',
    F: 'H',
    O: 'I',
    B: 'J',
    '': ''
};

const costSymbols = {
    I: 'C',
    R: 'E'
};

export const parseDieValue = (value) => value.replace('/+', '+').replace('P', '').replace('-', '');

export const parseDieSymbol = (symbol) => symbols[symbol];

export const parseDieCostValue = (cost) => cost.length ? cost.slice(0, 1) : '';

export const parseDieCostSymbol = (cost) => cost.length ? costSymbols[cost.slice(1, 2)] : '';

export const parseIsModifier = (value) => parseDieValue(value).slice(0, 1) === '+';

export const parseIsFeral = (value) => value.slice(0, 1) === 'P';

export const parseHasDie = (card) => card[10] !== '' || card[11] !== '' || card[12] !== '';

export const parseCardText = (text => {
    Object.keys(symbols).forEach(s => {
        text = text.replace(
            new RegExp('\\$' + s + '\\$', 'g'),
            `@${symbols[s]}@`
        );
    });
    text = text.replace(/@/g, `$`);

    return text;
});
