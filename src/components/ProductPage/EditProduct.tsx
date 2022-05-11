import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input, Textarea } from 'components/Form';
import { AutoComplete } from 'components/Form';
import { RootState } from 'reducers/index.reducer';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories } from 'actions/product.action';
import { UploadSingleImage } from 'components/Form';
import Button from 'components/Button';
import CancelButton from 'components/CancelButton';
import { removeNull } from 'services/common.service';
import { message, Skeleton } from 'antd';
import { getProducts } from 'actions/product.action';
import { IEditProduct } from 'types';
import axios from 'services/axios.service';

const EditProduct = ({ handleChangeView, productUrl }: IEditProduct): React.ReactElement => {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = React.useState(true);
  const [id, setId] = React.useState();
  const [options, setOptions] = React.useState([]);
  const categories = useSelector((state: RootState) => state.productReducer.categories);
  const getCategoriesError = useSelector((state: RootState) => state.productReducer.getCategoriesError);
  const createProductSuccess = useSelector((state: RootState) => state.productReducer.createProductSuccess);
  const createProductError = useSelector((state: RootState) => state.productReducer.createProductError);
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      category: '',
      picture: '',
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Bạn phải nhập mục này'),
      description: Yup.string().required('Bạn phải nhập mục này'),
      category: Yup.string().required('Bạn phải nhập mục này'),
      picture: Yup.string().required('Bạn phải nhập mục này'),
    }),
    onSubmit: (submitObject) => {
      const cleanSubmitObject = removeNull(submitObject);
      axios
        .patch(`product/${id}`, cleanSubmitObject)
        .then(() => {
          message.success('Sửa sản phầm thành công');
          dispatch(getProducts());
          handleChangeView();
        })
        .catch((error) => {
          message.error(error.response.data.message);
        });
    },
  });

  const hanldeUploadPicutureSuccess = (url: string) => {
    formik.values.picture = url;
  };

  const handleAutoCompleteChange = (value: string): void => {
    formik.values.category = value;
  };

  React.useEffect(() => {
    axios
      .get(`/product/${productUrl}`)
      .then((response) => {
        const product = response.data.product;
        formik.values.name = product.name;
        formik.values.description = product.description;
        formik.values.category = product.category.name;
        formik.values.picture = product.picture;

        setLoading(false);
        setId(product._id);
      })
      .catch(() => {
        message.error('Lấy thông tin sản phẩm thất bại');
      });
    dispatch(getCategories());
  }, []);

  React.useEffect(() => {
    if (categories) {
      const options = categories.map((category) => {
        return {
          value: category.name,
        };
      });

      setOptions(options);
    }
  }, [categories]);

  React.useEffect(() => {
    if (getCategoriesError) {
      message.error('Lấy phân loại thất bại');
    }
  }, [getCategoriesError]);

  React.useEffect(() => {
    if (createProductSuccess) {
      message.success('Tạo sản phẩm thành công');
      dispatch(getProducts());
      handleChangeView();
    }
  }, [createProductSuccess]);

  React.useEffect(() => {
    if (createProductError && createProductError.includes('name')) {
      message.error('Tên sản phẩm bị trùng');
    } else if (createProductError) {
      message.error(createProductError);
    }
  }, [createProductError]);

  return (
    <div className="animate__animated animate__fadeInRight">
      <div className="title md:pt-20 mb-10 text-center font-bold text-2xl">Sửa sản phẩm</div>
      {isLoading ? (
        <Skeleton />
      ) : (
        <form onSubmit={formik.handleSubmit} className="form md:pr-10">
          <div className="form_title pt-3 text-sm pb-2 text-left font-normal pl-2">Tên sản phẩm</div>
          <Input
            type="text"
            name="name"
            placeholder="Tên sản phẩm"
            onChange={formik.handleChange}
            value={formik.values.name}
            error={formik.errors.name && formik.touched.name ? formik.errors.name : false}
          />
          <div className="form_title pt-3 text-sm pb-2 text-left font-normal pl-2">Mô tả sản phẩm</div>
          <Textarea
            name="description"
            placeholder="Mô tả sản phẩm"
            onChange={formik.handleChange}
            value={formik.values.description}
            error={formik.errors.description && formik.touched.description ? formik.errors.description : false}
          />
          <div className="form_title pt-3 text-sm pb-2 text-left font-normal pl-2">Phân loại</div>
          <AutoComplete
            placeholder="Phân loại sản phẩm"
            options={options || []}
            initialValue={formik.values.category}
            onChange={handleAutoCompleteChange}
            error={formik.errors.category && formik.touched.category ? formik.errors.category : false}
          />
          <div className="form_title pt-3 text-sm pb-2 text-left font-normal pl-2">Ảnh đại diện</div>
          <div className="w-60 relative">
            <UploadSingleImage
              accept="image/png, image/jpeg, image/jpg"
              error={formik.errors.picture && formik.touched.picture ? formik.errors.picture : false}
              handleUploadSuccess={hanldeUploadPicutureSuccess}
              initialPicture={formik.values.picture}
            />
          </div>
          <div className="submit_buttons pt-5 flex justify-center items-center">
            <CancelButton className="mx-2" onClick={handleChangeView}>
              Hủy
            </CancelButton>
            <Button type="submit" className="mx-2">
              Sửa sản phẩm
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditProduct;
