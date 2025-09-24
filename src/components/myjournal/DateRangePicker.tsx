import React, { useEffect, useState } from "react";
import { DateRangePicker as DateRange } from 'react-date-range';
import datepipeModel from "@/utils/datepipemodel";

import { useSelector } from 'react-redux';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import "./style.scss";
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
type dateRangeType={
    value:any;
    onChange:(e:any)=>void;
    dynamicStyle:boolean;
    className:string;
    disabled:boolean;
     title:string;
     placeholder:string;
    isCompare :boolean;
    showcustom :boolean;
    showRange :boolean;


}
const DateRangePicker = ({ value, onChange, dynamicStyle = false,
    className = '', disabled = false, title = '', placeholder = '', isCompare = false, 
    showcustom = true,
    showRange = true,
}:dateRangeType) => {
    const user = useSelector((state:any) => state.user?.data)
    const [toggle, setToggle] = useState(false)
    const [range, setRange] = useState('')

    const rangeList = [
        { id: 'This Month', name: "This Month" },
        { id: 'This Year', name: "This Year" },
        { id: 'Last Month', name: "Last Month" },
        { id: 'Last Year', name: "Last Year" },
        { id: '', name: "Custom" }
    ]

    const blockDateChange = (e:any) => {
        const v={
            ...value, ...e, compare: '' 
        }

        v.startDate=datepipeModel.datetostring(v.startDate)
        v.endDate=datepipeModel.datetostring(v.endDate)
        
        onChange({ ...v })
        if (v.startDate != v.endDate) {
            setToggle(false)
        }
    }

    const toggleChange = () => {
        setToggle(!toggle)
    }

    const getBlockValue = () => {
        const v = {
            startDate: value['startDate'] ? new Date(value['startDate']) : new Date(),
            endDate: value['endDate'] ? new Date(value['endDate']) : new Date(),
            key: 'selection'
        }
        return [v]
    }


    const rangeClick = (e:any) => {
        let startDate = ''
        let endDate = ''

        if (e == 'Last Month') {
            const current = new Date()
            let monthdate:any = current.setDate(0)
            monthdate = datepipeModel.datetostring(monthdate)
            startDate = `${monthdate.split('-')[0]}-${monthdate.split('-')[1]}-01`
            endDate = monthdate

        } else if (e == 'This Month') {
            const current = datepipeModel.datetostring(new Date())
            startDate = `${current.split('-')[0]}-${current.split('-')[1]}-01`

            const month2 = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
            endDate = datepipeModel.datetostring(month2)
        }

        else if (e == 'This Year') {
            const current = datepipeModel.datetostring(new Date())
            startDate = `${current.split('-')[0]}-01-01`

            const month2 = new Date(new Date().getFullYear() + 1, 0, 0)
            endDate = datepipeModel.datetostring(month2)
        }
        else if (e == 'Last Year') {
            const current = new Date()
            startDate = `${current.getFullYear() - 1}-01-01`
            const month2 = new Date(current.getFullYear(), 0, 0)
            endDate = datepipeModel.datetostring(month2)
        }
        setRange(e)
        onChange({ ...value, startDate, endDate, compare: '' })
        if (e != '') {
            setToggle(false)
        }
    }

    const getDays = (s:any, e:any) => {
        // Define two date objects
        const startDate:any = new Date(s); // Replace with your start date
        const endDate:any = new Date(e);   // Replace with your end date
        // Calculate the time difference in milliseconds
        const timeDifference= endDate - startDate;
        // Convert milliseconds to days
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        return daysDifference
    }

    const previousYear = () => {
        let start = ''
        let end = ''
        if (value.startDate && value.endDate) {
            const ssplit = value.startDate.split('-')
            const esplit = value.endDate.split('-')
            const year = Number(ssplit[0])
            const eyear = Number(esplit[0])

            const d = new Date(`${year - 1}-${ssplit[1]}-${ssplit[2]}`)
            start = datepipeModel.datetostring(d)

            const ed = new Date(`${eyear - 1}-${esplit[1]}-${esplit[2]}`)
            end = datepipeModel.datetostring(ed)
        }
        return { start, end }
    }

    const previousMonth = () => {
        let start = ''
        let end = ''
        if (value.startDate && value.endDate) {
            // let sMonth=new Date(value.startDate).getMonth()
            // start=new Date(value.startDate).setMonth(sMonth-1)
            // start=datepipeModel.datetostring(start)

            // let eMonth=new Date(value.endDate).getMonth()
            // end=new Date(value.endDate).setMonth(eMonth-1)
            // end=datepipeModel.datetostring(end)

            const current = new Date(value.startDate)
            let monthdate:any = current.setDate(0)
            monthdate = datepipeModel.datetostring(monthdate)
            start = `${monthdate.split('-')[0]}-${monthdate.split('-')[1]}-01`
            end = monthdate
        }
        return { start, end }
    }

    const previousPeriod = () => {
        let start = ''
        let end = ''
        if (value.startDate && value.endDate) {
            const days = getDays(value.startDate, value.endDate) + 1

            const d = new Date(value.startDate)
            d.setDate(d.getDate() - days)
            start = datepipeModel.datetostring(d)

            const ed = new Date(value.startDate)
            ed.setDate(ed.getDate() - 1)
            end = datepipeModel.datetostring(ed)
        }
        return { start, end }
    }

    const compareChange = (e:any) => {
        let start = ''
        let end = ''
        if (e == 'Previous Period') {
            start = previousPeriod().start
            end = previousPeriod().end
        } else if (e == 'Previous Year') {
            start = previousYear().start
            end = previousYear().end
        } else if (e == 'Previous Month') {
            start = previousMonth().start
            end = previousMonth().end
        }

        const v = {
            ...value,
            compareStart: start,
            compareEnd: end,
            compare: e
        }
        setToggle(false)
        onChange({ ...v })
    }

    return <>


        <Menu as="div" className="relative list_box_active_state " title={title}>
            <div>

                <Menu.Button title={title} disabled={disabled} onClick={toggleChange} className=" set-bg rounded-xl lg:px-8 px-4 py-3 bg-[#540C0F] flex items-center gap-1 text-white">
                    {!value?.startDate || !value?.endDate ? <>{placeholder || 'Start Date - End Date'}</> : <>{datepipeModel.date(value?.startDate, user?.companyDateFormat)} -  {datepipeModel.date(value?.endDate, user?.companyDateFormat)}</>}
                    <ChevronDownIcon className="-mr-1 h-5 w-5 text-white-400" aria-hidden="true" />


                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className={`${dynamicStyle ? "" : ""}   focus:!outline-[#a1282f] focus:!outline text-sm absolute z-40 ${className ? className : " min-w-[200px] lg:min-w-[250px]"
                    } left-0  shadow-lg !py-2 !mt-3 overflow-auto bg-white  rounded-lg scrollbar`}>
                    <div className="fffff">
                        <div className="" >
                            {/* <p className="text-center px-2">{!value?.startDate || !value?.endDate ? <>{placeholder || 'Start Date - End Date'}</> : <>{datepipeModel.date(value?.startDate, user?.companyDateFormat)} -  {datepipeModel.date(value?.endDate, user?.companyDateFormat)}</>}</p> */}
                           
                           {showRange?<>
                            <div className="  flex lg:flex-row flex-wrap gap-4 items-center px-4 justify-center mb-0">
                                {rangeList.map(itm => {
                                    return showcustom == false && itm.name == "Custom" ? null : <button className={`btn flex-grow  ${range == itm.id ? 'bg-primary text-white' : 'bg-transparent hover:border-gray-400 border-1 border-gray-400'}`} type="button" onClick={e => rangeClick(itm.id)}>{itm.name}</button>
                                })}
                            </div>
                           </>:<></>}
                           

                            {range || showcustom == false ? <></> : <>
                                <div className="w-full customcalender">
                                    <DateRange
                                        
                                        editableDateInputs={true}
                                        onChange={e => blockDateChange(e.selection)}
                                        moveRangeOnFirstSelection={false}
                                        ranges={getBlockValue()}
                                    />
                                </div>
                            </>}


                            {isCompare ? <>

                                <Menu as="div" className="relative ">
                                    <div className="text-center">
                                        <Menu.Button className="inline-flex w-full justify-center border gap-x-1.5 rounded-md bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                            Compare
                                            <ChevronDownIcon
                                                className="-mr-1 ml-2 h-5 w-5 text-violet-200 hover:text-violet-100"
                                                aria-hidden="true"
                                            />
                                        </Menu.Button>
                                    </div>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 mt-2 w-full origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                                            <div className="px-1 py-1 ">
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <a className={`dropdown-item ${value.compare == 'Previous Month' ? 'active' : ''}`} onClick={e => compareChange('Previous Month')}>Previous Month ({datepipeModel.date(previousMonth().start, user?.companyDateFormat)} - {datepipeModel.date(previousMonth().end, user?.companyDateFormat)})</a>

                                                    )}
                                                </Menu.Item>

                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <a className={`dropdown-item ${value.compare == 'Previous Year' ? 'active' : ''}`} onClick={e => compareChange('Previous Year')}>Previous Year(Same Date) ({datepipeModel.date(previousYear().start, user?.companyDateFormat)} - {datepipeModel.date(previousYear().end, user?.companyDateFormat)})</a>

                                                    )}
                                                </Menu.Item>

                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <a className={`dropdown-item ${value.compare == 'Previous Period' ? 'active' : ''}`} onClick={e => compareChange('Previous Period')}>Previous Period(Custom Dates) ({datepipeModel.date(previousPeriod().start, user?.companyDateFormat)} - {datepipeModel.date(previousPeriod().end, user?.companyDateFormat)})</a>

                                                    )}
                                                </Menu.Item>

                                            </div>


                                        </Menu.Items>
                                    </Transition>
                                </Menu>


                            </> : <></>}

                        </div>

                    </div>
                </Menu.Items>
            </Transition>
        </Menu>

    </>
}
export default DateRangePicker