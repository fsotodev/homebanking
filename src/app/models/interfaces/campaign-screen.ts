import {TemplateType} from '@apps/models/types/types';

interface Benefit {
    benefitId: string;
    priority: number;
}

interface Button {
    backgroundColor: string;
    color: string;
    fixed: boolean;
    page: string;
    pagePWA: boolean;
    params: string;
    paramsPWA: string;
    show: boolean;
    text: string;
}

interface ExitButton {
    color: string;
    right: boolean;
    show: boolean;
    text: string;
}

interface Box {
    iconURL: string;
    show: boolean;
    text: string;
}

interface Detail {
    active: boolean;
    amount: number;
    quota: number;
}


export interface ICampaignScreen {
    id?: string;
    backgroundColor?: string;
    backgroundColorTop?: string;
    benefits?: Benefit[];
    button?: Button;
    defaultBenefits?: Benefit[];
    details?: Detail;
    exitButton?: ExitButton;
    infoBox?: Box;
    mainTitle?: Box;
    normalBenefits?: Benefit[];
    productsForExclusiveBenefits?: Array<string>;
    redirectBenefits?: boolean;
    showBenefitMiniature?: boolean;
    subTitle?: Box;
    template?: TemplateType;
    useSlider?: boolean;
    wave?: { invert: boolean; show: boolean };
}

export interface CustomBannerSlider {
    principalTitle: string;
    boxTitle: string;
    boxInner: string;
    boxFooterFirstPart: string;
    boxFooterSecondPart: string;
    boxFooterThirdPart: string;
    boxFooterFourthPart: string;
    informationHeader: string;
    informationFirstPart: string;
    informationSecondPart: string;
    informationThirdPart: string;
    informationFourthPart: string;
    informationFifthPart: string;
    page: string;
}
