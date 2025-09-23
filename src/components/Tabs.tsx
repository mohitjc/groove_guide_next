export default function Tabs({list=[],active='',setActive=(e:any)=>{},className=''}:any) {

    return <>
        <div className={`text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 ${className}`}>
            <ul className="flex flex-wrap -mb-px">
                {list.map((itm:any,i:any)=>{
                    return <li className="me-2" key={i}>
                    <span onClick={()=>setActive(itm.id)} className={`inline-block p-4 border-b-2 cursor-pointer rounded-t-lg ${itm.id==active?'text-primary border-primary active dark:text-blue-500 dark:border-blue-500':'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}>{itm.name}</span>
                </li>
                })}
            </ul>
        </div>
    </>
}