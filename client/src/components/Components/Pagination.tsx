const Pagination = ({ curPage, nbPages, onChange }: { curPage: number; nbPages: number; onChange: (p: number) => void }) => {
    const start = Math.max(Math.max(curPage - 2, 0) + Math.min(curPage + 3, nbPages) - curPage - 3, 0);
    const end = Math.min(Math.max(curPage - 2, 0) + Math.min(curPage + 3, nbPages) - curPage + 2, nbPages);

    const previous = curPage > 0 ?
        <li onClick={() => onChange(curPage - 1)} className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700">
            Previous
        </li> :
        <li className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-gray-100 border border-gray-300 rounded-s-lg hover:text-gray-500">
            Previous
        </li>;

    const next = curPage < nbPages - 1 ?
        <li onClick={() => onChange(curPage + 1)} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700">
            Next
        </li> :
        <li className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-gray-100 border border-gray-300 rounded-e-lg hover:text-gray-500">
            Next
        </li>;

    const pages = [];
    for (let i = start; i < end; i++) {
        if (curPage == i) {
            pages.push(
                <li key={i} onClick={() => onChange(i)} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-blue-50 border border-gray-300 hover:bg-gray-100 hover:text-gray-700">
                    {i + 1}
                </li>
            )
        } else {
            pages.push(
                <li key={i} onClick={() => onChange(i)} className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700">
                    {i + 1}
                </li>
            )
        }
    }

    return (
        <nav className="flex items-center flex-nowrap flex-row justify-between select-none">
            <ul className="inline-flex -space-x-px text-sm h-8">
                {previous}
                {pages}
                {next}
            </ul>
        </nav>
    )
}

export default Pagination;