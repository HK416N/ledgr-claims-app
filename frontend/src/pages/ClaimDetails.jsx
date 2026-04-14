import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Copy } from 'lucide-react';
import { toast } from 'react-toastify';
import { getClaimById } from '../services/claimsService';
import { sharedStyles } from '../constants/styles';


const ClaimDetails = () => {
    const { id } = useParams();
    const [claim, setClaim] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchClaim = async () => {
            const result = await getClaimById(id);
            if (result?.success) {
                setClaim(result.data);
            } else {
                toast.error('Could not load claim.')
            }
            setIsLoading(false);
        };
        fetchClaim();
    }, [id]);

    if (isLoading) return <p className="text-sm text-gray-500">Loading...</p>;
    if (!claim) return <p className="text-sm text-red-500">Claim not found</p>;

    return (
        <div className="flex flex-col gap-6 max-w-2xl">

            {/* back link */}
            <Link className="flex items-center gap-1 
            text-sm text-gray-400 
            hover:text-gray-600 w-fit"
                to="/dashboard">
                <ArrowLeft size={14}></ArrowLeft>
                Back to Dashboard
            </Link>

            {/* Card */}
            <div className={`${sharedStyles.card} p-6 flex flex-col gap-6 items-center`}>

                {/* card header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-gray-800">
                            Claim {claim.receiptNumber || '—'}
                        </h1>

                        <p className="text-sm text-gray-400 mt-0.5">
                            {new Date(claim.date).toLocaleDateString('en-SG',
                                { day: '2-digit', month: 'long', year: 'numeric' })}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        {/* edit - incomplete claims */}
                        {claim.status !== 'COMPLETE' && (
                            <Link className="flex items-center gap-1 
                            border border-gray-200 rounded 
                            px-3 py-1.5 text-sm text-gray-600 
                            hover:bg-gray-50" to={`/claims/${claim._id}/edit`}>
                                Edit
                            </Link>
                        )}

                        {/* `delete` stub */}
                        <button className="flex items-center gap-1 
                        bg-red-500 text-white rounded 
                        px-3 py-1.5 text-sm 
                        hover:bg-red-600">
                            Delete
                        </button>
                    </div>
                </div>

                {/* claim details */}
                <div className="flex flex-col">
                    <p className="text-xs font-semibold text-gray-400 
                    uppercase tracking-wide mb-3">
                        Details
                    </p>

                    {/* receipt # */}
                    <div className="flex justify-between items-center 
                    text-sm py-3 border-b border-gray-100">
                        <span className="text-gray-500">
                            Receipt No.
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-800">
                                {claim.receiptNumber || '—'}
                            </span>
                            <button className="text-gray-300 hover:text-gray-500"
                                onClick={() => navigator.clipboard.writeText(claim.receiptNumber)
                                    .then(() => toast.success('Receipt No. copied!'))}>
                                <Copy size={13}></Copy>
                            </button>
                        </div>
                    </div>

                    {/* date */}
                    <div className="flex justify-between items-center 
                    text-sm py-3 border-b border-gray-100">
                        <span className="text-gray-500">
                            Date
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-800">
                                {new Date(claim.date).toLocaleDateString('en-SG',
                                    { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                            <button className="text-gray-300 hover:text-gray-500"
                                onClick={() => navigator.clipboard.writeText(claim.date)
                                    .then(() => toast.success('Date copied!'))}>
                                <Copy size={13}></Copy>
                            </button>
                        </div>
                    </div>

                    {/*Desc */}
                    <div className="flex justify-between items-center 
                    text-sm py-3 border-b border-gray-100">
                        <span className="text-gray-500">
                            Description
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-800">
                                {claim.description || '—'}
                            </span>
                            <button className="text-gray-300 hover:text-gray-500"
                                onClick={() => navigator.clipboard.writeText(claim.description)
                                    .then(() => toast.success('Description copied!'))}>
                                <Copy size={13}></Copy>
                            </button>
                        </div>
                    </div>

                    {/*Orignal Amount */}
                    <div className="flex justify-between items-center 
                    text-sm py-3 border-b border-gray-100">
                        <span className="text-gray-500">
                            Original Amount
                        </span>
                        <div className="flex items-center gap-2">

                            <span className="font-medium text-gray-800">
                                {claim.currencyOriginal}
                            </span>
                            <button className="text-gray-300 hover:text-gray-500"
                                onClick={() => navigator.clipboard.writeText(
                                    `${claim.currencyOriginal} 
                                ${claim.totalOriginal.toFixed(2)}`)
                                    .then(() => toast.success('Amount copied!'))}>
                                <Copy size={13}></Copy>
                            </button>
                        </div>
                    </div>

                    {/* tax*/}
                    <div className="flex justify-between items-center 
                    text-sm py-3 border-b border-gray-100">
                        <span className="text-gray-500">
                            Tax
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-800">
                                {claim.tax.toFixed(2)}
                            </span>
                            <button className="text-gray-300 hover:text-gray-500"
                                onClick={() => navigator.clipboard.writeText(
                                    `${claim.currencyOriginal} 
                                ${claim.tax.toFixed(2)}`)
                                    .then(() => toast.success('Tax copied!'))}>
                                <Copy size={13}></Copy>
                            </button>
                        </div>
                    </div>

                    {/* fx rates*/}
                    <div className="flex justify-between items-center 
                    text-sm py-3 border-b border-gray-100">
                        <span className="text-gray-500">
                            FX Rate
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-800">
                                {claim.fxRate.toFixed(5)}
                            </span>
                            <button className="text-gray-300 hover:text-gray-500"
                                onClick={() => navigator.clipboard.writeText(claim.fxRate.toFixed(5))
                                    .then(() => toast.success('FX Rate copied!'))}>
                                <Copy size={13}></Copy>
                            </button>
                        </div>
                    </div>

                    {/* SGD */}
                    <div className="flex justify-between items-center 
                    text-sm py-3 border-b border-gray-100">
                        <span className="font-medium text-gray-800">
                            SGD
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-800">
                                S${claim.totalSGD.toFixed(2)}
                            </span>
                            <button className="text-gray-300 hover:text-gray-500"
                                onClick={() => navigator.clipboard.writeText(
                                    `S$${claim.totalSGD.toFixed(2)}`)
                                    .then(() => toast.success('SGD copied!'))}>
                                <Copy size={13}></Copy>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

};

export default ClaimDetails;