import Link from "next/link";

type Props = {
post: { title: string;
        slug: string;
        description: string;
};};

export default function PostCard({ post }: Props) {
return (
<Link href={`/blog/${post.slug}`} className="p-5 border border-foreground/20 rounded-xl hover:bg-foreground/5 transition block">
<h2 className="text-xl font-semibold mb-2">{post.title}</h2>
<p className="opacity-70 text-sm">{post.description}</p>
</Link>
);
}