import { CreateOrderForm } from "@/components/orders/CreateOrderForm";
import { getProducts } from "@/actions/product";

export default async function NewOrderPage() {
    const rawProducts = await getProducts();
    const products = rawProducts.map((p: any) => ({
        ...p,
        price: Number(p.price)
    }));

    return (
        <div style={{ padding: "2rem" }}>
            <CreateOrderForm products={products} />
        </div>
    );
}
