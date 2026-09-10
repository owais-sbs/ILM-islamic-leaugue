import { redirect } from 'next/navigation';

export default function LibrarySlugRedirect({ params }: { params: { slug: string } }) {
  redirect(`/articles/${params.slug}`);
}
