import { useState, useEffect } from 'react';
import { getAllClaims } from '../services/claimsService';
import { sharedStyles } from '../constants/styles';

const ClaimsHistory = () => {
    const [allClaims, setAllClaims] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getAllClaims();
                if (result?.success) setAllClaims(result.data);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // History will only show completed claims
    // Note: for future upgrades, history should show completed and rejected 
    // or even expired claims
    const completedClaims = allClaims.filter((claim)=> claim.status === 'COMPLETE');

    const filteredClaims = completedClaims.filter((claim) => {
        if (!search) return true;

        return (
            claim.receiptNumber.toLowerCase().includes(search.toLowerCase()) ||
            claim.description.toLowerCase().includes(search.toLowerCase())
        );
    });

    if (isLoading) return <p className="text-gray-500 text-sm">Loading...</p>;

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className={sharedStyles.pageTitle}>Claims History</h1>
                <p className="text-sm text-gray-500 mt-1">View all completed claims</p>
            </div>

            <div className="flex justify-end">
                <input
                    className={`${sharedStyles.input} w-56`}
                    type="search"
                    placeholder="Search..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                ></input>
            </div>

            {/* claims history table */}
            <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                {filteredClaims.length === 0 ? (
                    <p className="text-sm text-gray-400 p-6">No completed claims yet</p>
                ) : (
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                            <tr>
                                <th className="px-4 py-3">Ref No.</th>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Description</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3 text-left">Original</th>
                                <th className="px-4 py-3 text-right">FX Rate</th>
                                <th className="px-4 py-3 text-right">SGD</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {filteredClaims.map((claim)=> (
                                <tr key={claim._id} className="hover:bg-gray-50">

                                    {/* receipt # */}
                                    <td className="px-4 py-3 text-gray-600">
                                        {claim.receiptNumber || '—'}
                                    </td>

                                    {/* Date */}
                                    <td className="px-4 py-3 text-gray-600">
                                        {new Date(claim.date).toLocaleDateString('en-SG', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </td>

                                    {/* desc */}
                                    <td className="px-4 py-3 text-gray-800">
                                        {claim.description || '—'}
                                    </td>

                                    {/* category - forgot to add it in the wireframes */}
                                    <td className="px-4 py-3 text-gray-500">
                                        {claim.category}
                                    </td>

                                    {/* original amount with currency and fxSource badge */}
                                    <td className="px-4 py-3 text-left text-gray-800">
                                        {claim.currencyOriginal} {claim.totalOriginal.toFixed(2)}
                                        <span className={`ml-2 text-xs px-1.5 py-0.5 rounded font-medium
                                            ${claim.fxSource === 'API'
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-gray-100 text-gray-500'}`}>
                                            {claim.fxSource}
                                        </span>
                                    </td>

                                    {/* fxRates */}
                                    <td className="px-4 py-3 text-right text-gray-600">
                                        {claim.fxRate.toFixed(4)}
                                    </td>

                                    {/* sgd amount and location badge - extra confirmation for converted sgd values*/}
                                    <td className="px-4 py-3 text-right font-semibold text-sgd-blue">
                                        S$ {claim.totalSGD.toFixed(2)}
                                        <span className={`ml-2 text-xs px-1.5 py-0.5 rounded font-medium
                                            ${claim.location === 'OVERSEAS'
                                                ? 'bg-red-100 text-red-600'
                                                : 'bg-blue-100 text-blue-700'}`}>
                                            {claim.location === 'OVERSEAS' ? 'O/S' : 'SG'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )
};

export default ClaimsHistory;

