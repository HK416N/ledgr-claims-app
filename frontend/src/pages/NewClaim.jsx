import { useState } from "react"
import { useNavigate, Link } from "react-router"
import { toast } from "react-toastify";
import { sharedStyles } from "../constants/styles";
import { CURRENCIES } from "../constants/currencies";
import { createClaim } from "../services/claimsService";

const DUMMY_CATEGORIES = ['Meals', 'Transport', 'Accommodation', 'Entertainment'];

const NewClaim = () => {

    const navigate= useNavigate();
    
    //states
    const [categoryInput, setCategoryInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData,setFormData] = useState({
        receiptNumber: '',
        date: '',
        description: '',
        location: 'SINGAPORE',
        currencyOriginal: 'SGD',
        totalOriginal: '',
        tax: '',
        fxRate: '1',
        fxSource: 'MANUAL',
    });

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value});
    };

    //compute totalSGD
    const totalSGD =
    formData.totalOriginal && formData.fxRate 
    ? (
        Math.round(parseFloat(formData.totalOriginal) * parseFloat(formData.fxRate) *100)/100).toFixed(2) 
    : (
        '—'
    )

    const handleSubmit = async (event) => {
        event.preventDefault();

        if(!formData.fxRate) {
            toast.error('Please enter an FX rate');
            return;
        };
        
        setIsLoading(true);
        
        const result = await createClaim({
            ...formData,
            totalOriginal: parseFloat(formData.totalOriginal),
            tax: formData.tax ? parseFloat(formData.tax) : 0,
            fxRate: parseFloat(formData.fxRate),
            categoryId: null,
        });

        setIsLoading(false);

        if(!result?.success) {
            toast.error(result?.error || 'Failed to create claim.');
            return;
        };
        
        toast.success('Claim created');
        navigate('/dashboard');
    };

    return (
        <div className="flex flex-col gap-6 max-w-2xl">
            <div>
                <h1 className={sharedStyles.pageTitle}>New Claim</h1>
                <p className="text-sm text-gray-500 mt-1">Fill in the details for your expense claim</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 shadow-sm flex flex-col gap-5">

                {/* Row 1: Receipt No + Date */}
                <div className="grid grid-cols-2 gap-4">
                    <div className={sharedStyles.field}>
                        <label className={sharedStyles.label}>Receipt No.</label>
                        <input
                            className={sharedStyles.input}
                            type="text"
                            name="receiptNumber"
                            value={formData.receiptNumber}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={sharedStyles.field}>
                        <label className={sharedStyles.label}>Date</label>
                        <input
                            className={sharedStyles.input}
                            type="date" //https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/date
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* Row 2: Description */}
                <div className={sharedStyles.field}>
                    <label className={sharedStyles.label}>Description</label>
                    <input
                        className={sharedStyles.input}
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                {/* Row 3: Location + Category */}
                <div className="grid grid-cols-2 gap-4">
                    <div className={sharedStyles.field}>
                        <label className={sharedStyles.label}>Location</label>
                        <select
                            className={sharedStyles.input}
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                        >
                            <option value="SINGAPORE">Singapore</option>
                            <option value="OVERSEAS">Overseas</option>
                        </select>
                    </div>

                    <div className={sharedStyles.field}>
                        <label className={sharedStyles.label}>Category</label>
                        <input
                            className={sharedStyles.input}
                            type="text"
                            placeholder="e.g. Meals, Transport..."
                            value={categoryInput}
                            onChange={(e) => setCategoryInput(e.target.value)}
                        />
                        {/* Dummy chips — display only, clicking fills the input but has no effect on submit */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {DUMMY_CATEGORIES.map((name) => (
                                <button
                                    key={name}
                                    type="button"
                                    onClick={() => setCategoryInput(name)}
                                    className="bg-gray-100 rounded-full px-2.5 py-1 text-xs text-gray-600 hover:text-gray-900"
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Row 4: Currency + Amount + Tax */}
                <div className="grid grid-cols-3 gap-4">
                    <div className={sharedStyles.field}>
                        <label className={sharedStyles.label}>Currency</label>
                        <select
                            className={sharedStyles.input}
                            name="currencyOriginal"
                            value={formData.currencyOriginal}
                            onChange={handleChange}
                        >
                            {CURRENCIES.map((c) => (
                                <option key={c.code} value={c.code}>{c.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className={sharedStyles.field}>
                        <label className={sharedStyles.label}>Amount</label>
                        <input
                            className={sharedStyles.input}
                            type="number"
                            name="totalOriginal"
                            value={formData.totalOriginal}
                            onChange={handleChange}
                            min="0"
                            step="0.01" //https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/step
                            required
                        />
                    </div>

                    <div className={sharedStyles.field}>
                        <label className={sharedStyles.label}>Tax</label>
                        <input
                            className={sharedStyles.input}
                            type="number"
                            name="tax"
                            value={formData.tax}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                        />
                    </div>
                </div>

                {/* Row 5: FX Rate + SGD total */}
                <div className="grid grid-cols-2 gap-4">
                    <div className={sharedStyles.field}>
                        <label className={sharedStyles.label}>FX Rate</label>
                        <input
                            className={sharedStyles.input}
                            type="number"
                            name="fxRate"
                            value={formData.fxRate}
                            onChange={handleChange}
                            step="0.000001"
                            placeholder="e.g. 0.7401"
                        />
                    </div>

                    <div className={sharedStyles.field}>
                        <label className={sharedStyles.label}>Total (SGD)</label>
                        <input
                            className={`${sharedStyles.input} bg-gray-50 text-gray-500`}
                            type="text"
                            value={`S$ ${totalSGD}`}
                            readOnly
                        />
                    </div>
                </div>

                {/* submit /cancle */}
                <div className="flex justify-end gap-3 pt-2">
                    <Link
                        to="/dashboard"
                        className="border border-gray-200 rounded px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={sharedStyles.button}
                    >
                        {isLoading ? 'Saving...' : 'Submit Claim'}
                    </button>
                </div>
            </form>
        </div>
    );
};


export default NewClaim;