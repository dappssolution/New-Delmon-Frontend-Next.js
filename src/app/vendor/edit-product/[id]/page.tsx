import EditProduct from "@/src/components/vendor/EditProduct";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
    const { id } = await params;
    return <EditProduct productId={id} />;
}
