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

export const dietaryChange=(key:string,dietaryKeys:any)=>{
    let payload:any={};
    dietaryList.map(itm=>{
      payload={
        ...payload,
        [itm.id]:dietaryKeys?.[itm.id]?true:false,
        [key]:dietaryKeys?.[key]?false:true
      }
    })

    Object.keys(payload).find(key=>{
        if(!payload[key]) delete payload[key]
    })
   
    return payload
  }