import { memo, useEffect, useMemo, useState } from "react"
import FormControl from "@/components/FormControl";
import countryStateModel from "../utils/countryStae"
import ApiClientB from "@/utils/Apiclient";
import GooglePlaceAutoComplete from "@/components/GooglePlaceAutoComplete/page"

const EditAddress = memo(({ atype='primary',membership,result=()=>{}}:any) => {
    let type=atype
    const [GetPrimaryCities, setPrimaryCities] = useState([]);
    const [PrimaryPinOptions, setPrimaryPinOptions] = useState([]);

    const {post:getCities,isLoading:isCityLoading}=ApiClientB()
    const {post:getPostalCode,isLoading:isPostalCodeLoading}=ApiClientB()

    const [form, setForm] = useState({
        [`${type}_address_1`]: membership?.[`${type}_address_1`],
        [`${type}_address_2`]: membership?.[`${type}_address_2`],
        [`${type}_country`]: membership?.[`${type}_country`]||'US',
        [`${type}_state`]: membership?.[`${type}_state`],
        [`${type}_city`]: membership?.[`${type}_city`],
        [`${type}_postcode`]: membership?.[`${type}_postcode`],
    })
    const GetCitiesOptions = (p:any = {}) => {
        if (!p?.stateCode) {
            return
        }
        getCities(`shipping/cities`, p).then(res => {
            if (res.success) {
                const data = res?.data?.map((_itm:any) => ({ id: _itm?.name, name: _itm?.name }));
                setPrimaryCities(data)
            }else{
                setPrimaryCities([])
            }
        })
    }

    const GetPrimaryPinOptions = (p:any = {}) => {
        if (!p?.city||!p?.state) {
            return
        }
        getPostalCode(`shipping/validateAddress`, p).then(res => {
            if (res.success) {
                const data = res?.data?.map((_itm:any) => ({ id: _itm?.zip, name: _itm?.zip }));
                setPrimaryPinOptions(data)
            } else {
                setPrimaryPinOptions([])
            }
        })
    }


    useEffect(()=>{
        let state=form?.[`${type}_state`]
        if(state) GetCitiesOptions({ countryCode:form[`${type}_country`], stateCode: state })
        else setPrimaryCities([])
    },[form?.[`${type}_state`]])

    useEffect(()=>{
        let city=form?.[`${type}_city`]
        if(city) GetPrimaryPinOptions({ state: form[`${type}_state`], city: city })
        else setPrimaryPinOptions([])
    },[form?.[`${type}_city`]])


    useEffect(() => {
        let payload = {
            [`${type}_address_1`]: membership?.[`${type}_address_1`],
            [`${type}_address_2`]: membership?.[`${type}_address_2`],
            [`${type}_country`]: membership?.[`${type}_country`] || 'US',
            [`${type}_state`]: membership?.[`${type}_state`],
            [`${type}_city`]: membership?.[`${type}_city`],
            [`${type}_postcode`]: membership?.[`${type}_postcode`],
        };

        let state = membership?.[`${type}_state`]

        if (state) {
            let states = countryStateModel.getStates(form[`${type}_country`])
            let ext = states.find((item:any) => item.id.toLowerCase() == state.toLowerCase().trim() || item.name.toLowerCase() == state.toLowerCase().trim())
            if (ext){
                payload[`${type}_state`] = ext.id
            }
        }

        setForm({ ...payload })
    }, [membership])

    return <>
    <form onSubmit={e=>{e.preventDefault();result({event:'submit',data:form})}}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
               <div className="col-span-full">
                 <label className="text-sm mb-2 block">
              Address <span className="star">*</span>
            </label>
                <GooglePlaceAutoComplete
                placeholder="Enter Address"
                value={form[`${type}_address_1`]}
                required
                result={(e:any)=>{
                    let keys={}
                    if(e.formattedAddress){
                        let address=e.formattedAddress
                        keys={
                            [`${type}_address_1`]: address.address1,
                            [`${type}_country`]: address.country_code || 'US',
                            [`${type}_state`]: address.state_code,
                            [`${type}_city`]: address.city,
                            [`${type}_postcode`]: address.zipCode,
                        }
                    }
                    setForm(prev => ({
                            ...prev,
                            [`${type}_address_1`]: e.value,
                            ...keys
                        }))
                }}
                />
            </div>
            {/* <div className="col-span-full">
                <FormControl
                    label="Address"
                    value={form[`${type}_address_1`]}
                    onChange={e => {
                        setForm(prev => ({
                            ...prev,
                            [`${type}_address_1`]: e
                        }))
                    }}
                    required
                />
            </div> */}

            <div className="">
                <FormControl
                    type="select"
                    theme="option"
                    options={countryStateModel.list}
                    label="Country"
                    position='fixed'
                    value={form[`${type}_country`]}
                    onChange={(e:any) => {
                        setForm(prev => ({
                            ...prev,
                            [`${type}_country`]: e,
                            [`${type}_state`]: '',
                             [`${type}_city`]: '',
                             [`${type}_postcode`]: '',
                        }))
                    }}
                    required
                    isClearable={false}
                />
            </div>
            <div className="">
                <FormControl
                    type="select"
                    theme="option"
                    options={countryStateModel.getStates(form[`${type}_country`])}
                    label="State"
                    position='fixed'
                    value={form[`${type}_state`]}
                    onChange={(e :any)=> {
                        setForm(prev => ({
                            ...prev,
                            [`${type}_state`]: e,
                             [`${type}_city`]: '',
                             [`${type}_postcode`]: '',
                        }))
                    }}
                    required
                />
                {!form[`${type}_country`]?<>
                <div className="text-[12px] text-red-500 ">Please select a country first</div>
                </>:<></>}
            </div>
            <div className="">
                <FormControl
                    label="City"
                    type="select"
                    theme="option"
                    options={GetPrimaryCities}
                    value={form[`${type}_city`]}
                    onChange={(e:any) => {
                        setForm(prev => ({
                            ...prev,
                            [`${type}_city`]: e,
                            [`${type}_postcode`]: ''
                        }))
                    }}
                    position='fixed'
                    isLoading={isCityLoading}
                    required
                />
                {!form[`${type}_state`]?<>
                <div className="text-[12px] text-red-500 ">Please select a state first</div>
                </>:<></>}
            </div>
            <div className="">
                    <FormControl
                        label="Postal Code"
                        theme="option"
                        searchType='number'
                        maxlength="5"
                        isCreate
                        options={PrimaryPinOptions}
                        type={PrimaryPinOptions?.length ? 'select' : 'number'}
                        position='fixed'
                        value={form[`${type}_postcode`]}
                        onChange={(e:any) => {
                            setForm(prev => ({
                                ...prev,
                                [`${type}_postcode`]: e
                            }))
                        }}
                        required
                        isLoading={isPostalCodeLoading}
                    />
                 {!form[`${type}_city`]?<>
                <div className="text-[12px] text-red-500">Please select a city first</div>
                </>:<></>}
            </div>
            <div className="mt-3 col-span-full text-right">
                <button type="submit" className="btn btn-primary">
                    Update
                </button>
            </div>

        </div>
        </form>
    </>
})

export default EditAddress