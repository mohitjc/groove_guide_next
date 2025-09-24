import Link from "next/link";

type Props = {
    className?: string;
    children?: any;
    target?: string;
    href?: string;
    to?: string;
    onClick?: (e?: any) => void;
}

export function LinkHtml({ className = '', children, target = '', href = '', to = '', onClick = () => { } }:Props) {
    return <>
        {to ? <>
            <Link
                target={target}
                href={to}
                onClick={onClick}
                className={className}
            >
                {children}
            </Link>
        </> : <>
            <a
                onClick={onClick}
                target={target}
                href={href}
                className={className}
            >
                {children}
            </a>
        </>}
    </>
}