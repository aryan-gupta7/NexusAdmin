import { CreateProductForm } from "@/components/products/CreateProductForm";
import styles from "./page.module.css";

export default function NewProductPage() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Create Prototype</h1>
                <p className={styles.subtitle}>Forge a new item into existence</p>
            </header>

            <CreateProductForm />
        </div>
    );
}
