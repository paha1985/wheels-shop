import { useEffect, useState } from "react";
import { ProductsRow } from "../../components/app-content/components/app-content-body/components/products-row";
import { getProduct, getProducts } from "../../http/productsAPI";
import { AddProductModal } from "./components/add-product-modal";
import { useDispatch, useSelector } from "react-redux";
import { editProduct } from "../../actions/edit-product";
import { setLoading } from "../../actions/set-loading";
import { Pagination } from "../../components/pagination/pagination";
import { selectUserId } from "../../selectors/select-user-id";
import { selectUserRole } from "../../selectors/select-user-role";

export const Products = ({ search, setSearch }) => {
  const [products, setProducts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [isCreating, setIsCreating] = useState(true);
  const [editedId, setEditedId] = useState(0);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(1);
  const limit = 10;

  const dispatch = useDispatch();
  const roleId = useSelector(selectUserRole);

  const category = useSelector(({ app }) => app.currentCategory);
  const loading = useSelector(({ app }) => app.isLoading);
  const userId = useSelector(selectUserId);

  useEffect(() => {
    dispatch(setLoading(true));
    setTimeout(() => {
      getProducts(category, 0, 0, userId, search).then((data) => {
        setProducts(data ? data : []);
        setCount(data.length);
        getProducts(category, page, limit, userId, search).then((data) => {
          setProducts(data ? data : []);
          dispatch(setLoading(false));
        });
      }, 500);
    });
  }, [refresh, category, page, count, userId, search]);

  const AddNewProduct = () => {
    setIsOpen(true);
    setIsCreating(true);
    setEditedId(0);
    dispatch(
      editProduct({
        productId: "",
        price: "",
        markId: "",
        categoryId: "",
      })
    );
  };

  return (
    <>
      <AddProductModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        refresh={refresh}
        setRefresh={setRefresh}
        isCreating={isCreating}
        editedId={editedId}
      />
      {roleId === 1 && (
        <button
          onClick={() => AddNewProduct()}
          style={{ marginLeft: "23px", height: "27px" }}
        >
          Добавить продукт
        </button>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", margin: "0 15px" }}>
        {!loading &&
          (products.length > 0 ? (
            products.map((product) => {
              return (
                <ProductsRow
                  key={product.product_id}
                  product={product}
                  refresh={refresh}
                  setRefresh={setRefresh}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  isCreating={isCreating}
                  setIsCreating={setIsCreating}
                  editedId={editedId}
                  setEditedId={setEditedId}
                />
              );
            })
          ) : (
            <div
              style={{
                color: "var(--app-content-main-color)",
                display: "flex",
                alignItems: "center",
                margin: "auto",
                height: "75vh",
                justifyContent: "center",
              }}
            >
              Нет товаров в данной категории
            </div>
          ))}
        {count > limit && (
          <Pagination
            page={page}
            setPage={setPage}
            lastPage={Math.ceil(count / limit)}
          />
        )}
      </div>
    </>
  );
};
