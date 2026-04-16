import { useEffect, useState } from "react";
import { updateClaim, getClaimById } from "../services/claimsService";
import { toast } from "react-toastify";
import { useNavigate, useParams} from "react-router";
import ClaimsForm from "../components/ClaimsForm";


const EditClaim = () => {
  
      const navigate= useNavigate();
      
      //states
      const [categoryInput, setCategoryInput] = useState('');
      const [isLoading, setIsLoading] = useState(false);
      const { id } = useParams();
      const [FormData,setFormData] = useState({
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
      const title = 'Edit Claim';        

      useEffect(() => {
        const getClaimDetails = async () => {
            try {
                setIsLoading(true);
                const result = await getClaimById(id);
                console.log('Claim details fetched:', result);
                if (result?.success) {
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
                } else {
                    toast.error(result?.error || 'Failed to fetch claim details.');
                }

            } catch (error) {
                toast.error(error?.message || 'An error occurred while fetching claim details.');
            } finally {
                setIsLoading(false);
            }
      }
      getClaimDetails()
      }, [id]);

      const handleChange = (event) => {
          setFormData({ ...FormData, [event.target.name]: event.target.value});
      };
  
      //compute totalSGD
      const totalSGD =
      FormData.totalOriginal && FormData.fxRate 
      ? (
          Math.round(parseFloat(FormData.totalOriginal) * parseFloat(FormData.fxRate) *100)/100).toFixed(2) 
      : (
          '—'
      )
      const handleCategoryChange = (event) => {
        setCategoryInput(event.target.value);
    }
  
      const handleSubmit = async (event) => {
          event.preventDefault();
  
          if(!FormData.fxRate) {
              toast.error('Please enter an FX rate');
              return;
          };
          
          setIsLoading(true);
          
          const result = await updateClaim(id, {
              ...FormData,
              totalOriginal: parseFloat(FormData.totalOriginal),
              tax: FormData.tax ? parseFloat(FormData.tax) : 0,
              fxRate: parseFloat(FormData.fxRate),
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
            <ClaimsForm title={title} FormData={FormData} handleSubmit={handleSubmit} handleChange={handleChange} isLoading={isLoading} categoryInput={categoryInput} totalSGD={totalSGD} handleCategoryChange={handleCategoryChange} />
        </div>
    );
};

export default EditClaim;