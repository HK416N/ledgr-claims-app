import { useState } from "react";
import { updateClaim, getClaimById } from "../services/claimsService";
import { toast } from "react-toastify";
import { useNavigate, useParams} from "react-router";
import ClaimsForm from "../components/claimForm";


const UpdateClaim = () => {
  
      const navigate= useNavigate();
      
      //states
      const [categoryInput, setCategoryInput] = useState('');
      const [isLoading, setIsLoading] = useState(false);
      const { id } = useParams();
      const [formData,setFormData] = useState({
          receiptNumber: '',
          date: '',
          description: '',
          location: 'SINGAPORE',
          currencyOriginal: 'SGD',
          totalOriginal: '',
          tax: '',
          fxRate: '',
          fxSource: 'MANUAL',
      });
      
      const getClaimDetails = async () => {
        const result = await getClaimById(id);

        if(!result?.success) {
            toast.error(result?.error || 'Failed to fetch claim details.');
            return;
        };


        const claim = result.data;
        setFormData({
            receiptNumber: claim.receiptNumber || '',
            date: claim.date ? claim.date.split('T')[0] : '',
            description: claim.description || '',
            location: claim.location || 'SINGAPORE',
            currencyOriginal: claim.currencyOriginal || 'SGD',
            totalOriginal: claim.totalOriginal ? claim.totalOriginal.toString() : '',
            tax: claim.tax ? claim.tax.toString() : '',
            fxRate: claim.fxRate ? claim.fxRate.toString() : '',
            fxSource: claim.fxSource || 'MANUAL',
        });
      }

      getClaimDetails(id)

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
      const handleCategoryChange = (event) => {
        setCategoryInput(event.target.value);
    }
  
      const handleSubmit = async (event) => {
          event.preventDefault();
  
          if(!formData.fxRate) {
              toast.error('Please enter an FX rate');
              return;
          };
          
          setIsLoading(true);
          
          const result = await updateClaim(id, {
              ...formData,
              totalOriginal: parseFloat(formData.totalOriginal),
              tax: formData.tax ? parseFloat(formData.tax) : 0,
              fxRate: parseFloat(formData.fxRate),
              categoryId: null,
          });
  
          setIsLoading(false);
  
          if(!result?.success) {
              toast.error(result?.error || 'Failed to update claim.');
              return;
          };
          
          toast.success('Claim updated');
          navigate('/dashboard');
      };
    return (
        <div>
            <ClaimsForm FormData={FormData} handleSubmit={handleSubmit} handleChange={handleChange} isLoading={isLoading} categoryInput={categoryInput} totalSGD={totalSGD} handleCategoryChange={handleCategoryChange} />
        </div>
    );
};

export default UpdateClaim;