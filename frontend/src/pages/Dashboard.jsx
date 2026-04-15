import { useEffect, useState } from "react"
import { Link } from "react-router";
import { Eye, Trash2, Check, AlertOctagon } from "lucide-react";
import { getAllClaims, updateClaim } from '../services/claimsService'
import { getCategories } from '../services/categorySerivce'
import { sharedStyles } from "../constants/styles";
import { toast } from "react-toastify";

const Dashboard = () => {
    //data states
    const [allClaims, setAllClaims] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    //filter statse
    const [search, setSearch] = useState('');
    const [locationFilter, setLocationFilter] = useState('all') //defaults to 'all' as in unfiltered
    const [categoryFilter, setCategoryFilter] = useState('all')

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                const [claimsResult, categoriesResult] = await Promise.all([
                    getAllClaims(),
                    getCategories(),
                ]);

                if (claimsResult?.success) {
                    setAllClaims(claimsResult.data);
                }

                if (categoriesResult?.success) {
                    setCategories(categoriesResult.data);
                }

            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            };
        };
        fetchData();
    }, []);

    // for check mark button 
    const handleComplete = async (claimId) => {
        const result = await updateClaim(claimId, {status : 'COMPLETE'});
        if (!result?.success) {
            toast.error('Could not mark as complete.');
            return;
        };

        setAllClaims(allClaims.filter((claim) => claim._id !== claimId));
        toast.success('Claim marked as complete.');
    };

    //filters
    //pending claims
    const pendingClaims = allClaims.filter((claim) => {
        return claim.status !== 'COMPLETE';
    });

    //location
    const locationFiltered = pendingClaims.filter((claims) => {
        if (locationFilter === 'all') return true;
        return claims.location === locationFilter;
    });

    //category
    const categoryFiltered = locationFiltered.filter((claim) => {
        if (categoryFilter === 'all') return true;
        if (categoryFilter === 'none') return !claim.categoryId;
        return claim.categoryId === categoryFilter;
    });

    //search text
    const filteredClaims = categoryFiltered.filter((claim) => {
        const searchTerm = search.toLowerCase();

        if (!search) return true;

        const matchesReceipt = claim.receiptNumber
            .toLowerCase()
            .includes(searchTerm);

        const matchesDesc = claim.description
            .toLowerCase()
            .includes(searchTerm);

        return matchesReceipt || matchesDesc;
    });

    if (isLoading) return <p className="text-gray-500 text-sm">Loading...</p>;

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className={sharedStyles.pageTitle}>Expense Claims</h1>
                <p className="text-sm text-gray-500 mt-1">Manage and track all your submitted claims</p>
            </div>

            <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex gap-3">
                    <select
                        className={sharedStyles.select}
                        value={locationFilter}
                        onChange={(event) => setLocationFilter(event.target.value)}
                    >
                        <option value="all">All locations</option>
                        <option value="SINGAPORE">Singapore</option>
                        <option value="OVERSEAS">Overseas</option>
                    </select>

                    <select
                        className={sharedStyles.select}
                        value={categoryFilter}
                        onChange={(event) => setCategoryFilter(event.target.value)}
                    >
                        <option value="all">All Categories</option>
                        <option value="none">Uncategorized</option>
                        {/* render user's category inputs */}
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <input
                    className={`${sharedStyles.input} w-56`}
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                ></input>
            </div>

            {/* claims table */}
            <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                {filteredClaims.length === 0 ? (
                    <p className="text-sm text-gray-400 p-6">No claims found</p>
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
                                <th className="px-4 py-3 text-center">SGD</th>
                                <th className="px-4 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredClaims.map((claim) => (
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

                                    {/* category */}
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
                                    <td className="px-4 py-3 text-center font-semibold text-sgd-blue">
                                        S$ {claim.totalSGD.toFixed(2)}
                                        <span className={`ml-2 text-xs px-1.5 py-0.5 rounded font-medium
                                            ${claim.location === 'OVERSEAS'
                                                ? 'bg-red-100 text-red-600'
                                                : 'bg-blue-100 text-blue-700'}`}>
                                            {claim.location === 'OVERSEAS' ? 'O/S' : 'SG'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-4">
                                            {/* completed - wip */}
                                            <button className="text-gray-400 hover:text-green-600"
                                            onClick={()=>handleComplete(claim._id)}
                                            >
                                                <Check size={15}></Check>
                                            </button>

                                            {/* Claims details */}
                                            <Link to={`/claims/${claim._id}`}
                                                className="text-gray-400 hover:text-gray-700">
                                                <Eye size={15}></Eye>
                                            </Link>

                                            {/* delete claim - wip */}
                                            <button className="text-gray-400 hover:text-red-500">
                                                <Trash2 size={15}></Trash2>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Dashboard;