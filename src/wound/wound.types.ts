import { WoundArea, WoundStatus, Wound } from './entity/wound.entity';

export interface WoundGroupResult {
    area: WoundArea;
    wounds: Wound[];
    count: number;
    statusBreakdown: {
        [key in WoundStatus]: number;
    };
    mainGroup: number;
}

export interface WoundMainGroups {
    'Head and Neck': WoundGroupResult[];
    'Upper Extremity': WoundGroupResult[];
    'Thorax and Abdomen': WoundGroupResult[];
    'Lower Extremity': WoundGroupResult[];
    'Other': WoundGroupResult[];
}