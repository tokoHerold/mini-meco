import { useState } from "react";

const CheckboxSelect = ({ options, active, setActive, children }: { options: Array<string>; active: Array<string>; setActive: (s: Array<string>) => void, children: string }) => {
    const [show, setShow] = useState<boolean>(false);
    return (
        <div>
            <button className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center" type="button" onClick={() => setShow(!show)}>
                {children}
                <svg className="w-2.5 h-2.5 ms-3" fill="none" viewBox="0 0 10 6"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" /></svg>
            </button>
            {show &&
                <div className="z-10 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow" style={{ position: "absolute" }}>
                    <ul className="p-3 space-y-3 text-sm text-gray-700">
                        <li className="flex items-center">
                            <input type="checkbox" checked={active.length == options.length} onChange={e => e.target.checked ? setActive(options) : setActive([])} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded" />
                            <label className="ms-2 text-sm font-medium text-gray-900">all</label>
                        </li>
                    </ul>
                    <ul className="p-3 space-y-3 text-sm text-gray-700">
                        {options.map((option, id) => {
                            return (
                                <li key={id} className="flex items-center">
                                    <input type="checkbox" checked={active.includes(option)} onChange={e => e.target.checked ? setActive(active.concat(option)) : setActive(active.filter(a => a != option))} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded" />
                                    <label className="ms-2 text-sm font-medium text-gray-900">{option}</label>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            }
        </div>
    );
}

export default CheckboxSelect;