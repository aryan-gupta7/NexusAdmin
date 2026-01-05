"use client";

import styles from "@/components/products/CreateProductForm.module.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { updateProduct } from "@/actions/update-product";
import { InputGlow } from "@/components/ui/InputGlow";
import { NeonButton } from "@/components/ui/NeonButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle, X, UploadCloud } from "lucide-react";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

const productSchema = z.object({
    name: z.string().min(3),
    description: z.string().min(10),
    price: z.string().or(z.number()),
    stock: z.string().or(z.number()),
});

type FormData = z.infer<typeof productSchema>;

export function EditProductForm({ product }: { product: any }) {
    const router = useRouter();
    const [serverError, setServerError] = useState("");
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [pendingData, setPendingData] = useState<FormData | null>(null);

    // Image State
    const [existingImages, setExistingImages] = useState<string[]>(() => {
        try {
            return product.images ? JSON.parse(product.images) : [];
        } catch {
            return [];
        }
    });
    const [newImages, setNewImages] = useState<string[]>([]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
        }
    });

    const onDrop = (acceptedFiles: File[]) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                setNewImages((prev) => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] }
    });

    const removeExisting = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const removeNew = (index: number) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmit = (data: FormData) => {
        setPendingData(data);
        setIsConfirmOpen(true);
    };

    const handleConfirm = async () => {
        if (!pendingData) return;

        const finalImages = [...existingImages, ...newImages];
        const formData = new FormData();
        formData.append("name", pendingData.name);
        formData.append("description", pendingData.description);
        formData.append("price", pendingData.price.toString());
        formData.append("stock", pendingData.stock.toString());
        formData.append("images", JSON.stringify(finalImages));

        const result = await updateProduct(product.id, formData);

        if (result.error) {
            setServerError(result.error);
            setIsConfirmOpen(false);
        } else {
            router.push("/products");
            router.refresh();
        }
    };

    return (
        <GlassCard className={styles.formCard}>
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Edit Artifact</h2>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.stepContent}>
                    <InputGlow
                        label="Product Name"
                        {...register("name")}
                        error={errors.name?.message}
                    />
                    <div className={styles.textareaWrapper}>
                        <label className={styles.label}>Description</label>
                        <textarea
                            className={styles.textarea}
                            {...register("description")}
                            rows={4}
                        />
                        {errors.description && <span className={styles.error}>{errors.description.message}</span>}
                        <div className={styles.glowLine} />
                    </div>

                    <div className={styles.row}>
                        <InputGlow
                            label="Price ($)"
                            type="number"
                            step="0.01"
                            {...register("price")}
                            error={errors.price?.message as string}
                        />
                        <InputGlow
                            label="Stock"
                            type="number"
                            {...register("stock")}
                            error={errors.stock?.message as string}
                        />
                    </div>

                    {/* Image Editing Area */}
                    <div style={{ marginTop: '1rem' }}>
                        <label className={styles.label} style={{ marginBottom: '0.5rem', display: 'block' }}>Product Images</label>

                        <div className={styles.previews} style={{ marginBottom: '1rem' }}>
                            {existingImages.map((img, index) => (
                                <div key={`ex-${index}`} className={styles.previewContainer}>
                                    <img src={img} alt="Existing" className={styles.previewImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <button type="button" onClick={() => removeExisting(index)} className={styles.removeBtn}>
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                            {newImages.map((img, index) => (
                                <div key={`new-${index}`} className={styles.previewContainer}>
                                    <img src={img} alt="New" className={styles.previewImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <button type="button" onClick={() => removeNew(index)} className={styles.removeBtn}>
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div
                            {...getRootProps()}
                            className={`${styles.uploadArea} ${isDragActive ? styles.dragActive : ''}`}
                            style={{ padding: '1.5rem' }}
                        >
                            <input {...getInputProps()} />
                            <UploadCloud size={32} className={styles.uploadIcon} />
                            <p style={{ fontSize: '0.875rem' }}>Add more images (Drag & Drop)</p>
                        </div>
                    </div>

                    {serverError && (
                        <div className={styles.serverError}>
                            <AlertCircle size={18} />
                            {serverError}
                        </div>
                    )}

                    <div className={styles.actions} style={{ justifyContent: 'flex-end' }}>
                        <NeonButton type="submit" isLoading={isSubmitting}>
                            <CheckCircle2 size={18} />
                            Save Changes
                        </NeonButton>
                    </div>
                </div>
            </form>

            <ConfirmationModal
                isOpen={isConfirmOpen}
                title="Save Changes"
                description="Are you sure you want to save these changes to the artifact?"
                onConfirm={handleConfirm}
                onCancel={() => setIsConfirmOpen(false)}
                confirmText="Save Changes"
                variant="info"
            />
        </GlassCard>
    );
}
