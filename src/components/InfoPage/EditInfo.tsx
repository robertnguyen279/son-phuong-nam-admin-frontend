import React from 'react';
import { IEditInfo } from 'types/_components';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Input } from 'components/Form';
import Button from 'components/Button';
import CancelButton from 'components/CancelButton';
import axios from 'services/axios.service';
import { message } from 'antd';

const EditInfo = ({ handleChangeView, info }: IEditInfo): React.ReactElement => {
  const formik = useFormik({
    initialValues: {
      phone: info.phone,
      email: info.email,
      taxCode: info.taxCode,
      address: info.address,
    },
    validationSchema: Yup.object().shape({
      phone: Yup.string().required('Bạn phải nhập mục này'),
      email: Yup.string().email('Email không hợp lệ').required('Bạn phải nhập mục này'),
      taxCode: Yup.string().required('Bạn phải nhập mục này'),
      address: Yup.string().required('Bạn phải nhập mục này'),
    }),
    onSubmit: (submitObject) => {
      console.log(submitObject);
      axios
        .patch('/site', submitObject)
        .then((response) => {
          if (response.data.statusCode === 200) {
            message.success('Cập nhật thông tin thành công');
            handleChangeView();
          }
        })
        .catch((err) => {
          console.log({ ...err });
          message.error('Cập nhật thông tin thất bại');
        });
    },
  });
  return (
    <div className="animate__animated animate__fadeInRight">
      <div className="title md:pt-20 mb-10 text-center font-bold text-2xl">Sửa thông tin liên hệ</div>
      <form onSubmit={formik.handleSubmit} className="form md:pr-10">
        <div className="form_title pt-3 text-sm pb-2 text-left font-normal pl-2">Số điện thoại</div>
        <Input
          type="text"
          name="phone"
          placeholder="Số điện thoại"
          onChange={formik.handleChange}
          value={formik.values.phone}
          error={formik.errors.phone && formik.touched.phone ? formik.errors.phone : false}
        />
        <div className="form_title pt-3 text-sm pb-2 text-left font-normal pl-2">Email</div>
        <Input
          type="text"
          name="email"
          placeholder="Email"
          onChange={formik.handleChange}
          value={formik.values.email}
          error={formik.errors.email && formik.touched.email ? formik.errors.email : false}
        />
        <div className="form_title pt-3 text-sm pb-2 text-left font-normal pl-2">Địa chỉ</div>
        <Input
          type="text"
          name="address"
          placeholder="Địa chỉ"
          onChange={formik.handleChange}
          value={formik.values.address}
          error={formik.errors.address && formik.touched.address ? formik.errors.address : false}
        />
        <div className="form_title pt-3 text-sm pb-2 text-left font-normal pl-2">Mã số thuế</div>
        <Input
          type="text"
          name="taxCode"
          placeholder="Mã số thuế"
          onChange={formik.handleChange}
          value={formik.values.taxCode}
          error={formik.errors.taxCode && formik.touched.taxCode ? formik.errors.taxCode : false}
        />
        <div className="submit_buttons pt-5 flex justify-center items-center">
          <CancelButton className="mx-2" onClick={handleChangeView}>
            Hủy
          </CancelButton>
          <Button type="submit" className="mx-2">
            Sửa thông tin
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditInfo;
