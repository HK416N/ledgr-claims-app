import { Link } from "react-router"
import { sharedStyles } from "../constants/styles";
import { CURRENCIES } from "../constants/currencies";


const DUMMY_CATEGORIES = ['Meals', 'Transport', 'Accommodation', 'Entertainment'];

const ClaimsForm = ({ title, FormData, handleChange, handleSubmit, isLoading , categoryInput, totalSGD , handleCategoryChange}) => {


    return (
        <div className="flex flex-col gap-6 max-w-2xl">
            <div>
                {/* -- Title to be made dynamic based on whether it's New or Edit -- */}
                <h1 className={sharedStyles.pageTitle}>{title}</h1>
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
                            value={FormData.receiptNumber}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={sharedStyles.field}>
                        <label className={sharedStyles.label}>Date</label>
                        <input
                            className={sharedStyles.input}
                            type="date" //https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/date
                            name="date"
                            value={FormData.date}
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
                        value={FormData.description}
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
                            value={FormData.location}
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
                            onChange={handleCategoryChange}
                        />
                        {/* Dummy chips — display only, clicking fills the input but has no effect on submit */}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {DUMMY_CATEGORIES.map((name) => (
                                <button
                                    key={name}
                                    type="button"
                                    onClick={() => handleCategoryChange({ target: { value: name } })}
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
                            value={FormData.currencyOriginal}
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
                            value={FormData.totalOriginal}
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
                            value={FormData.tax}
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
                            value={FormData.fxRate}
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


export default ClaimsForm;