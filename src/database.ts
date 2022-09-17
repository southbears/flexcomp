import { AmountUnit, OfferData } from "./types";

const offerOverrides: Record<string, Partial<Pick<OfferData, 'candidate' | 'company'>>> = {
  'tobi': {
    candidate: { firstName: 'Tobi' },
    company: {
      name: 'Shopify',
      imageUrl: 'https://www.joykal.com/wp-content/uploads/2019/09/s-1.png',
    },
  },
}

export const getOffer = (id: string): OfferData => ({
  id: '123',
  candidate: { firstName: 'Tobi' },
  company: {
    name: 'Shopify',
    imageUrl: 'https://www.joykal.com/wp-content/uploads/2019/09/s-1.png',
  },
  cash: {
    min: 150000,
    max: 170000,
    unit: AmountUnit.USD,
    frequency: 'yearly',
  },
  equity: {
    min: 10000,
    max: 50000,
    unit: AmountUnit.USD,
    frequency: 'yearly',
  },
  default: 0.5,
  perks: [/*{
    type: PerkType.SIGNING_BONUS,
    name: 'Signing Bonus',
    amount: {
      min: 20000,
      max: 20000,
      unit: AmountUnit.USD,
      frequency: 'once',
    },
  }*/],
  growthProjections: [
    {
      label: 'No growth',
      rate: 1,
    }, {
      label: 'Expected growth (20%/year)',
      rate: 1.2,
      default: true,
    }, {
      label: 'Stellar growth (50%/year)',
      rate: 1.5,
    },
  ],
  ...offerOverrides[id],
})
