import fs from "fs";
import path from "path";


export function getPosts() {
const folder = path.join(process.cwd(), "posts");
const files = fs.readdirSync(folder);


return files.map((file) => {
const slug = file.replace(".md", "");
const title = slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());


return {slug, title, description: "A Vyre post."}});}

export function getPostBySlug(slug: string) {
return {
slug,
title: slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
description: "A Vyre post.",
};
}