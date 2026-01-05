"use client";

import styles from "./CreateProductForm.module.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createProduct } from "@/actions/product";
import { InputGlow } from "@/components/ui/InputGlow";
import { NeonButton } from "@/components/ui/NeonButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { useRouter } from "next/navigation";
import { UploadCloud, CheckCircle2, AlertCircle, X, Sparkles } from "lucide-react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { generateProductCopy } from "@/actions/ai-marketing";

// Schema
const productSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Price must be a positive number",
    }),
    stock: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "Stock must be a non-negative number",
    }),
});

type FormData = z.infer<typeof productSchema>;

export function CreateProductForm() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [images, setImages] = useState<string[]>([]);
    const [serverError, setServerError] = useState("");

    const onDrop = (acceptedFiles: File[]) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                setImages((prev) => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 3
    });

    const removeImage = (index: number) => {
        setImages(imgs => imgs.filter((_, i) => i !== index));
    };

    const {
        register,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
        trigger,
        watch,
        setValue,
    } = useForm<FormData>({
        resolver: zodResolver(productSchema),
        mode: "onChange",
    });

    const [isGenerating, setIsGenerating] = useState(false);
    const productName = watch("name");

    const handleMagicCopy = async () => {
        if (!productName || productName.length < 3) return;
        setIsGenerating(true);
        try {
            const result = await generateProductCopy(productName);
            setValue("description", result.description, { shouldValidate: true });
        } catch (e) {
            console.error(e);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleNext = async () => {
        const isStepValid = await trigger(["name", "description"]);
        if (isStepValid) setCurrentStep(2);
    };

    const onSubmit = async (data: FormData) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", data.price);
        formData.append("stock", data.stock);

        formData.append("stock", data.stock);
        // Serialize images to JSON string for SQLite storage
        formData.append("images", JSON.stringify(images));

        const result = await createProduct(formData);

        if (result.error) {
            setServerError(result.error);
        } else {
            router.push("/products");
            router.refresh();
        }
    };

    return (
        <GlassCard className={styles.formCard}>
            <div className={styles.steps}>
                <div className={`${styles.step} ${currentStep >= 1 ? styles.stepActive : ""}`}>1. Details</div>
                <div className={styles.line} />
                <div className={`${styles.step} ${currentStep >= 2 ? styles.stepActive : ""}`}>2. Pricing & Stock</div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                {currentStep === 1 && (
                    <div className={styles.stepContent}>
                        <InputGlow
                            label="Product Name"
                            placeholder="e.g. Cyberpunk Jacket"
                            {...register("name")}
                            error={errors.name?.message}
                        />
                        <div className={styles.textareaWrapper}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label className={styles.label}>Description</label>
                                <button
                                    type="button"
                                    onClick={handleMagicCopy}
                                    disabled={isGenerating || !productName}
                                    className={styles.magicBtn}
                                >
                                    <Sparkles size={14} />
                                    {isGenerating ? "Generating..." : "Magic Copy"}
                                </button>
                            </div>
                            <textarea
                                className={styles.textarea}
                                placeholder="Describe your artifact..."
                                {...register("description")}
                                rows={4}
                            />
                            {errors.description && <span className={styles.error}>{errors.description.message}</span>}
                            <div className={styles.glowLine} />
                        </div>

                        <NeonButton type="button" onClick={handleNext} className={styles.nextBtn}>
                            Next Step
                        </NeonButton>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className={styles.stepContent}>
                        <div className={styles.row}>
                            <InputGlow
                                label="Price ($)"
                                placeholder="0.00"
                                type="number"
                                step="0.01"
                                {...register("price")}
                                error={errors.price?.message}
                            />
                            <InputGlow
                                label="Stock"
                                placeholder="0"
                                type="number"
                                {...register("stock")}
                                error={errors.stock?.message}
                            />
                        </div>

                        {/* Image Upload Area */}
                        <div
                            {...getRootProps()}
                            className={`${styles.uploadArea} ${isDragActive ? styles.dragActive : ''}`}
                        >
                            <input {...getInputProps()} />
                            <UploadCloud size={40} className={styles.uploadIcon} />
                            {isDragActive ? (
                                <p>Drop the files here ...</p>
                            ) : (
                                <p>Drag & drop product images here, or click to select</p>
                            )}
                            <span className={styles.subtext}>(Local Preview Mode)</span>
                        </div>

                        {/* Previews */}
                        {images.length > 0 && (
                            <div className={styles.previews}>
                                {images.map((img, index) => (
                                    <div key={index} className={styles.previewContainer}>
                                        <Image
                                            src={img}
                                            alt="Preview"
                                            width={80}
                                            height={80}
                                            className={styles.previewImage}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className={styles.removeBtn}
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {serverError && (
                            <div className={styles.serverError}>
                                <AlertCircle size={18} />
                                {serverError}
                            </div>
                        )}

                        <div className={styles.actions}>
                            <NeonButton type="button" variant="secondary" onClick={() => setCurrentStep(1)}>
                                Back
                            </NeonButton>
                            <NeonButton type="submit" isLoading={isSubmitting}>
                                <CheckCircle2 size={18} />
                                Create Product
                            </NeonButton>
                        </div>
                    </div>
                )}
            </form>
        </GlassCard>
    );
}
