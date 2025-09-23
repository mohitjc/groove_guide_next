import { memo, useEffect, useMemo } from "react"
import datepipeModel from "@/utils/datepipemodel";

type BoxSoonerProps = {
    nextBox?: boolean,
    nextPaymentDate?: string,
    setNextBox?: (value: { next: boolean, date: string }) => void,
    boxLength?: number,
    membershipStatus?: string
}
const BoxSooner = memo(({ nextBox = false, nextPaymentDate = '', setNextBox = () => { }, boxLength = 1, membershipStatus = '' }: BoxSoonerProps) => {
    const currentDate = new Date()
    const currentDateNo = currentDate.getDate()
    const current = useMemo(() => {
        const today = new Date();
        const baseDate = nextPaymentDate ? new Date(nextPaymentDate) : today;
        // Create a date for the 10th of this month
        const todayMonth = new Date(today.getFullYear(), today.getMonth(), 10);
        const tenthOfMonth = new Date(baseDate.getFullYear(), baseDate.getMonth(), 10);
        let value = new Date(baseDate);

        // If today > 10th, move to same date in next month
        if (todayMonth.getTime() > tenthOfMonth.getTime()) {
            value = todayMonth
        }
        return value;
    }, [nextPaymentDate])

    const nextDate = useMemo(() => {
        const currentMonth = current.getMonth() + 1
        const currentYear = current.getFullYear()
        let value = datepipeModel.datetostring(`${currentYear}-${currentMonth}-10`)

        const today = new Date();
        const baseDate = new Date(current);
        const tenthOfMonth = new Date(baseDate.getFullYear(), baseDate.getMonth(), 10);
        // If today > 10th, move to same date in next month
        if (today.getTime() > tenthOfMonth.getTime()) {
            let value1 = new Date(baseDate.setMonth(baseDate.getMonth() + 1));
            value = datepipeModel.datetostring(`${value1.getFullYear()}-${value1.getMonth() + 1}-10`)
        }
        return value
    }, [current])

    const shiftDate = useMemo(() => {
        let shift_date = new Date(current).setMonth(current.getMonth() + boxLength)
        let shift_month = new Date(shift_date).getMonth() + 1
        let shift_year = new Date(shift_date).getFullYear()
        return datepipeModel.datetostring(`${shift_year}-${shift_month}-10`)
    }, [current, boxLength])

    useEffect(() => {
        setNextBox({ next: nextBox, date: nextBox ? nextDate : shiftDate })
    }, [shiftDate, nextDate, nextBox])

    return <>
        <div className="p-3 bg-white shadow-md rounded-lg border border-gray-200" aria-label={nextBox ? nextDate : shiftDate}>
            {(boxLength <= 1) ? <>
                <div className="bg-blue-50 rounded-lg p-3 mb-3">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700">Payment Date:</span>
                        <span className="font-medium text-gray-800">{datepipeModel.date(new Date().toISOString(), "MM/yyyy")}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-700">Next Payment Date:</span>
                        <span className="font-semibold text-primary">{datepipeModel.date((nextBox ? nextDate : shiftDate), "MM/yyyy")}</span>
                    </div>
                </div>

                {(currentDateNo < 10 || nextDate != shiftDate) ? <>
                    <div id="active-member">
                        <div className="border border-gray-300 rounded-lg p-3 hover:border-blue-300 hover:bg-gray-50 cursor-pointer mb-3">
                            <div className="flex items-start gap-2" onClick={() => setNextBox({ next: true, date: nextDate })}>
                                <input
                                    type="checkbox"
                                    checked={nextBox}
                                    style={{ accentColor: "#540C0F" }}
                                    className="w-5 h-5 !mt-1 text-red-600 bg-gray-100 border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                                />
                                <div>
                                    <div className="font-medium text-gray-800">{membershipStatus == 'active' ? 'Keep Cycle' : 'Get Next Box Early'}</div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        Next Payment Date: <span className="text-primary">{datepipeModel.date(nextDate)}</span>
                                        {/* {membershipStatus == 'active' ? 'Next payment will be processed on' : 'Receive the upcoming Oct 10 box right away'}  */}
                                        </div>
                                </div>
                            </div>
                        </div>

                        <div className="border border-gray-300 rounded-lg p-3 hover:border-blue-300 hover:bg-gray-50 cursor-pointer">
                            <div className="flex items-start gap-2" onClick={() => setNextBox({ next: false, date: shiftDate })}>
                                <input
                                    type="checkbox"
                                    checked={!nextBox}
                                    style={{ accentColor: "#540C0F" }}
                                    className="w-5 h-5 !mt-1 text-red-600 bg-gray-100 border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                                />
                                <div>
                                    <div className="font-medium text-gray-800">Push to Next Month</div>
                                    <div className="text-sm text-gray-600 mt-1">Next Payment Date:  <span className="text-primary">{datepipeModel.date(shiftDate)}</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </> : <></>}

            </> : <>
                <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-600 rounded-md">
                    <p className="text-base font-medium text-red-700"> Next Charge Date?</p>
                    <label className="flex items-center gap-2 mt-3">
                        <input
                            type="checkbox"
                            checked={nextBox}
                            style={{ accentColor: "#540C0F" }}
                            onChange={(e) => setNextBox({ next: true, date: nextDate })}
                            className="w-5 h-5 text-red-600 bg-gray-100 border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                        />
                        <span className="text-sm font-medium text-gray-800">
                            Extra Box Now, Keep <span className="text-red-500">{datepipeModel.date(nextDate)}</span>
                        </span>
                    </label>

                    <label className="flex items-center gap-2 mt-3">
                        <input
                            type="checkbox"
                            checked={!nextBox}
                            style={{ accentColor: "#540C0F" }}
                            onChange={(e) => setNextBox({ next: false, date: shiftDate })}
                            className="w-5 h-5 text-red-600 bg-gray-100 border-gray-300 rounded-md focus:ring-2 focus:ring-red-500"
                        />
                        <span className="text-sm font-medium text-gray-800">
                            Extra Box Now, Push to <span className="text-red-500">{datepipeModel.date(shiftDate)}</span>
                        </span>
                    </label>
                </div>
            </>}
        </div>
    </>
})

export default BoxSooner