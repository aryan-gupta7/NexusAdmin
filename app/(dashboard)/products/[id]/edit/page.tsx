import { EditProductForm } from "@/components/products/EditProductForm";
import { getProduct } from "@/actions/get-product";
import { redirect } from "next/navigation";

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        redirect("/products");
    }

    return (
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <EditProductForm product={product} />
        </div>
    );
}
