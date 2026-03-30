import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "src/content/blog");

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  readTime: string;
  image: string;
  date: string;
  content: string;
}

export function getPosts(lang: "en" | "es"): BlogPost[] {
  const directory = path.join(contentDir, lang);
  
  if (!fs.existsSync(directory)) {
    return [];
  }

  const filenames = fs.readdirSync(directory);
  
  const posts = filenames
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const fullPath = path.join(directory, filename);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title?.trim() || "",
        excerpt: data.excerpt?.trim() || "",
        category: data.category?.trim() || "",
        author: data.author?.trim() || "CREI Editorial",
        readTime: data.readTime?.trim() || "",
        image: data.image?.trim() || "",
        date: data.date || new Date().toISOString(),
        content,
      } as BlogPost;
    });

  // Sort posts by date in descending order
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string, lang: "en" | "es"): BlogPost | null {
  const fullPath = path.join(contentDir, lang, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title?.trim() || "",
    excerpt: data.excerpt?.trim() || "",
    category: data.category?.trim() || "",
    author: data.author?.trim() || "CREI Editorial",
    readTime: data.readTime?.trim() || "",
    image: data.image?.trim() || "",
    date: data.date || new Date().toISOString(),
    content,
  };
}
