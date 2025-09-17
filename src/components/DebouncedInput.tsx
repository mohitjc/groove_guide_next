import { memo, useEffect, useRef } from "react";

type Props = {
    type?: string;
    value?: any;
    onChange?: (p: any) => void;
    className?: string;
    time?:number;
    placeholder?:string;
    required?:boolean;
    id?:string;
    maxLength?:number;
    max?:string|number;
    min?:string|number;
}
function DebouncedInput({ type = 'text', value = '', onChange = () => { }, className = '',time=500,placeholder='',required=false,id='',maxLength,max='',min='' }:Props) {
    const timeout = useRef(null as any);
    const inputRef = useRef(null as any)

    useEffect(() => {
        inputRef.current?.addEventListener("input", function (e: any) {
            clearTimeout(timeout.current);
            timeout.current = setTimeout(() => {
                const key = {
                    maxLength,
                    max,
                    min,
                    value:e.target.value
                };
                onChange(key.value)
            }, time);
        })
    }, [])

    useEffect(()=>{
        inputRef.current.value=value
    },[value])

    return <>
        <input
            ref={inputRef}
            id={id||''}
            type={type}
            // onChange={e => inputChange(type=='number'?methodModel.isNumber(e):e.target.value)}
            placeholder={placeholder}
            maxLength={maxLength}
            min={min}
            max={max}
            className={className}
            required={required}
        />
    </>

}

export default memo(DebouncedInput)