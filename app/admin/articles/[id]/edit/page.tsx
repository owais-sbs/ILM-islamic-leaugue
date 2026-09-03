import ArticleEditor from '@/components/admin/ArticleEditor';

export default function EditArticlePage({ params }: { params: { id: string } }) {
  return <ArticleEditor articleId={params.id} />;
}
