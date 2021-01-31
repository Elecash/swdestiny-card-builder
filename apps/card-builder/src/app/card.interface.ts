export interface Card {
    googleSheetCSV: string;
    number: string;
    rarity: string;
    title: string;
    subtitle: string;
    life: string;
    unique: string;
    affiliation: string;
    color: string;
    type: string;
    subtype: string;
    cardImage: string;
    cardText: string;
    teamCost: string;
    cardCost: string;
    hasDie: string;
    side1: DieSide;
    side2: DieSide;
    side3: DieSide;
    side4: DieSide;
    side5: DieSide;
    side6: DieSide;
}

export interface DieSide {
    value: string;
    symbol: string;
    costValue: string;
    costSymbol: string;
    isModifier: string;
    isFeral: string;
}
