import envirnment from "@/envirnment";

export const socialOptions = ["Word of Mouth",
    "Drive By",
    "Internet Search",
    "Google Maps",
    "Facebook",
    "Instagram",
    "YouTube",
    "TikTok",
    "Yelp",
    "Shroom Locator",
    "Blog",
    "Flyer",
    "Event",
    "QR Code Sticker",
    "Guest Sign-In",
    "Club Programs",
    "Twitter",
    "Website",
    "Walk-In",
    "Friends & Family",
    "Google",
    "Apple Maps",
    "Other"
]
    .sort()
    .map(itm => ({ id: itm.toLowerCase(), name: itm }))

export const dietaryList = [
    { id: 'vegan', name: 'Vegan' },
    { id: 'dairyFree', name: 'Dairy Free' },
    { id: 'glutenFree', name: 'Gluten Free' },
    { id: 'nutFree', name: 'Nut Free' },
]

export const primaryUseList = [
    { id: 'Therapeutic Use', name: 'Therapeutic' },
    { id: 'Health & Wellness', name: 'Functional/Medicinal' },
]

export const dietaryChange = (key: string, dietaryKeys: any) => {
    let payload: any = {};
    dietaryList.map(itm => {
        payload = {
            ...payload,
            [itm.id]: dietaryKeys?.[itm.id] ? true : false,
            [key]: dietaryKeys?.[key] ? false : true
        }
    })

    Object.keys(payload).find(key => {
        if (!payload[key]) delete payload[key]
    })

    return payload
}

export const craftPlanPrice = envirnment.env == 'staging' ? 1 : 97
export const friendsPlanPrice = envirnment.env == 'staging' ? 1 : 50
export const shippingFee = envirnment.env == 'staging' ? 1 : 19.95

export const getPlanPrice = (plan: string) => {
    let value = craftPlanPrice

    if (plan?.toLowerCase()?.includes('friends & fam')) value = craftPlanPrice
    //    if(plan?.toLowerCase()?.includes('friends & fam')) value=friendsPlanPrice
    return value
}


export const paymentTypeList = [
    { id: 'one_time', name: 'One Time' },
    { id: 'recurring', name: 'Add To Monthly Membership' },
];

export const paymentMethodList = [
    { id: "Clover", name: 'Clover (Manual)' },
    { id: "Credit Card (Manual)", name: 'Credit Card (Manual)' },
    { id: "Credit Card (Auto)", name: 'Credit Card (Auto)' },
]

export function paymentMethodName(id: string) {
    const ext = paymentMethodList.find(itm => itm.id == id)
    return ext ? ext.name : id
}

export const billingAddress = {
    "billing_address_1": "18932 Woodward Avenue,",
    "billing_address_2": "",
    "billing_city": "Detroit",
    "billing_state": "MI",
    "billing_postcode": "48203",
    "billing_country": "US",
}

export const boxPreferenceList = [
    { id: 'Canna Discovery Box', name: 'Canna Discovery Box', info: 'Explore new benefits with curated monthly selections.' },
    { id: 'Canna Flower Only Box', name: 'Canna Flower Only Box', info: 'Pure flower products for natural effects.' },
    { id: 'Canna Treats Only Box', name: 'Canna Treats Only Box', info: 'Delicious edibles for convenient, long-lasting relief.' },
    { id: 'Shroom Discovery Box', name: 'Shroom Discovery Box', info: 'Explore with new curated monthly selections.' },
    { id: 'Dried Shrooms Only Box', name: 'Dried Shrooms Only Box', info: 'Pure, dried shrooms for natural effects.' },
    { id: 'Shroom Treats Only Box', name: 'Shroom Treats Only Box', info: 'Delicious shroom-infused edibles, drinks, and more for wellness.' },
    { id: 'Balance Discovery Box', name: 'Balance Discovery Box', info: 'Curated cannabis and mushroom wellness blend.' },
    { id: 'Balance Flower & Dried Only Box', name: 'Balance Flower & Dried Only Box', info: 'Pure cannabis flower and dried mushrooms combined.' },
    { id: 'Balance Treats Only Box', name: 'Balance Treats Only Box', info: 'Cannabis edibles and mushroom treats together.' },
]



export const customizationList = [
    "Peanuts and Tree Nuts",
    "Dairy-Free",
    "Gluten-Free",
    "Vegan",
    "Other",
].map(itm => ({ name: itm, id: itm }))

export const boxtrackUrl = (no: string | number | undefined) => {
    const url = `https://tools.usps.com/go/TrackConfirmAction.action?tLabels=${no}`
    window.open(url, '_new')
}

export const contentMainCategory = [
    {
        id: 'Therapeutic & Functional Mushrooms',
        name: '🌱 Therapeutic & Functional Mushrooms',
        description: 'Health benefits, effects, dosing, & education.',
        image: '/assets/img/v2/c1.png'
    },
    {
        id: 'Live Unboxings & Product Reviews',
        name: '📦 Live Unboxings & Product Reviews',
        description: 'Monthly box breakdowns, product insights, and reviews.',
        image: '/assets/img/v2/c2.png'
    },
    {
        id: 'Research & Expert Insights',
        name: '📖 Research & Expert Insights',
        description: 'Science-backed studies, guides, & infographics.',
        image: '/assets/img/v2/c3.png'
    },
    {
        id: 'Community Stories & Shared Experiences',
        name: '💬 Community Stories & Shared Experiences',
        description: 'Real user journeys, reflections, and peer-driven discussions.',
        image: '/assets/img/v2/c4.png'
    }
]

export const contentTypes = [
    { name: '🎥 Videos & Shorts', id: 'video' },
    { name: '🎧 Audio Insights', id: 'audio' },
    { name: '📖 Guides & Infographics', id: 'guide' },
]

export const receivingMethodList = [
    { id: "local_pickup", name: 'Pickup' },
    { id: "shipping", name: 'Delivery' },
]

export const getDiscountList = (row:any) => {
    const arr = row?.lineItems?.elements || []
    let discounts = row?.discounts?.elements
    if (!discounts?.length) {
        discounts = arr.filter((itm:any) => itm.discounts).reduce((acc:any, itm:any) => [...acc, ...itm.discounts?.elements], []);
    }
    return discounts
}

export const getDiscout = (row:any) => {
    const arr:any[] = row?.lineItems?.elements || []
    let itemtotal = 0;
    if (arr.length) itemtotal = arr.reduce((sum, itm) => sum + (itm.price / 100), 0);
    const discounts=getDiscountList(row)
    let value = 0
    if (discounts?.length) {
      value = discounts?.reduce((acc:any, item:any) => {
        if (item?.amount) {
          acc += -(item.amount / 100);
        }
        if (item?.percentage) {
          acc += (itemtotal * item.percentage) / 100;
        }
        return acc;
      }, 0);
    }
    return value
}
