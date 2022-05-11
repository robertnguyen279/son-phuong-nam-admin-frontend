import React from 'react';
import CreateProduct from './CreateProduct';
import Button from 'components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reducers/index.reducer';
import { getProducts, deleteProduct } from 'actions/product.action';
import { Table, Space, message, Popconfirm, Skeleton } from 'antd';
import { convertDate } from 'services/common.service';
import { Product } from 'types';
import EditProduct from './EditProduct';

const ProductPage = (): React.ReactElement => {
  const [view, setView] = React.useState({
    type: 'view',
    productUrl: null,
  });
  const [productList, setProductList] = React.useState([]);
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.productReducer.products);
  const getProductsError = useSelector((state: RootState) => state.productReducer.getProductsError);
  const deleteProductSuccess = useSelector((state: RootState) => state.productReducer.deleteProductSuccess);
  const deleteProductError = useSelector((state: RootState) => state.productReducer.deleteProductError);

  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Phân loại',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Ngày khởi tạo',
      key: 'createdAt',
      dataIndex: 'createdAt',
      render: (date: Date) => convertDate(date),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <a className="action_text" onClick={() => setView({ type: 'edit', productUrl: record.urlString })}>
            Sửa
          </a>
          <Popconfirm
            title="Bạn có chắc muốn xóa không?"
            onConfirm={() => handleDeleteProduct(record._id)}
            okText="Có"
            cancelText="Không"
          >
            <a className="action_text">Xóa</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleDeleteProduct = (id: string) => {
    dispatch(deleteProduct(id));
  };

  const handleChangeView = (): void => {
    setView({ type: 'view', productUrl: null });
  };

  const handleCreateProductClick = (): void => {
    setView({ type: 'create', productUrl: null });
  };

  React.useEffect(() => {
    dispatch(getProducts());
  }, []);

  React.useEffect(() => {
    if (getProductsError) {
      message.error('Lấy sản phẩm thất bại');
    }
  }, [getProductsError]);

  React.useEffect(() => {
    if (deleteProductError) {
      message.error('Xóa sản phẩm thất bại');
    }
  }, [deleteProductError]);

  React.useEffect(() => {
    if (deleteProductSuccess) {
      message.success('Xóa sản phẩm thành công');
      dispatch(getProducts());
    }
  }, [deleteProductSuccess]);

  React.useEffect(() => {
    if (products) {
      const productList = (Object.values(products) as Array<Product>).map((product) => ({
        ...product,
        category: product.category.name,
        key: product._id,
      }));
      setProductList(productList);
    }
  }, [products]);

  const renderView = () => {
    if (view && view.type === 'view') {
      return (
        <div className="animate__animated animate__fadeInRight">
          <div className="title md:pt-20 mb-10 text-center font-bold text-2xl">Sản phẩm</div>
          <div className="flex justify-end pr-10">
            <Button className="text-sm" onClick={handleCreateProductClick}>
              Thêm sản phẩm
            </Button>
          </div>
          <div className="table p-10 w-full">
            {productList ? <Table columns={columns} dataSource={productList} /> : <Skeleton />}
          </div>
        </div>
      );
    } else if (view && view.type === 'create') {
      return <CreateProduct handleChangeView={handleChangeView} />;
    } else {
      return <EditProduct handleChangeView={handleChangeView} productUrl={view.productUrl} />;
    }
  };
  return renderView();
};

export default ProductPage;
