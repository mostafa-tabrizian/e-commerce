import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Form, Formik } from 'formik';

import LocationSchemaValidation from '@/formik/schema/location';
import FormikInput from '@/formik/input';
import { MuiColorInput } from 'mui-color-input';
import { Switch } from '@mui/material';

const CreateLocationForm = ({
   selectedProduct,
}: {
   selectedProduct: string | null;
}) => {
   const onSubmit = async (
      values: {
         publicState: boolean;
         price: number | null;
         discount: number | null;
         size: number | null;
         quantity: number | null;
         color: string;
      },
      { resetForm }: any,
   ) => {
      const payload = { ...values, productId: selectedProduct };

      if (!selectedProduct) return toast.warning(`هیچ محصولی انتخاب نشده است!`);

      try {
         const res = await axios.post(`/api/product/location/add`, payload);
         if (res.status === 200) {
            resetForm();
            return toast.success(`چهره جدید محصول با موفقیت اضافه شد.`);
         } else {
            toast.error(`در ثبت چهره جدید محصول خطایی رخ داد!`);
            console.log(
               'err: در ثبت چهره جدید محصول خطایی رخ داد! res not 200',
               res,
            );
         }
      } catch (err) {
         toast.error(`در ثبت چهره جدید محصول خطایی رخ داد!`);
         console.log('err: در ثبت چهره جدید محصول خطایی رخ داد!', err);
      }
   };

   return (
      <Formik
         initialValues={{
            publicState: true,
            price: null,
            discount: null,
            size: null,
            quantity: null,
            color: '',
         }}
         validationSchema={LocationSchemaValidation}
         onSubmit={onSubmit}
      >
         {({
            values,
            isSubmitting,
            handleChange,
            setFieldValue,
            errors,
            touched,
         }) => (
            <Form className="space-y-5">
               <h1 className="text-center">افزودن چهره</h1>

               <div className="flex justify-end">
                  <Switch
                     defaultChecked
                     name="publicState"
                     onChange={handleChange}
                  />
               </div>

               <FormikInput
                  label="قیمت"
                  name="price"
                  type="number"
                  placeholder="قیمت به تومان"
               />
               <FormikInput
                  label="تخفیف"
                  name="discount"
                  type="number"
                  placeholder="تخفیف به درصد"
               />
               <FormikInput
                  label="سایز"
                  name="size"
                  type="number"
                  placeholder="سایز"
               />
               <FormikInput
                  label="تعداد موجود"
                  name="quantity"
                  type="number"
                  placeholder="تعداد موجود"
               />

               <div className="flex justify-between items-center">
                  <MuiColorInput
                     name="color"
                     value={values.color}
                     format="hex"
                     onChange={(e) => setFieldValue('color', e)}
                     sx={{
                        border:
                           errors.color && touched.color ? '2px solid red' : '',
                        borderRadius: '10px',
                     }}
                  />
                  <h5>رنگ چهره محصول</h5>
               </div>

               {errors.color && touched.color ? (
                  <p className="text-sm text-red-500">{errors.color}</p>
               ) : (
                  ''
               )}

               <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-5 py-3 mt-10 border border-green-500 rounded hover:text-black hover:bg-green-500"
               >
                  {isSubmitting ? (
                     <div className="flex justify-center">
                        <svg
                           aria-hidden="true"
                           className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-white fill-green-800"
                           viewBox="0 0 100 101"
                           fill="none"
                           xmlns="http://www.w3.org/2000/svg"
                        >
                           <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                           />
                           <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                           />
                        </svg>
                     </div>
                  ) : (
                     'افزودن'
                  )}
               </button>
            </Form>
         )}
      </Formik>
   );
};

export default CreateLocationForm;