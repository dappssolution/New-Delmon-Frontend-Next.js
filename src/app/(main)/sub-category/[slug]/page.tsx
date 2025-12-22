import CategoryPageClient from "@/src/components/products/CategoryPageClient";

export default async function SubCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    return <CategoryPageClient slug={slug} categoryType="sub-category" />;
}