// components/LikeButton.tsx
"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

export default function LikeButton({ slug }: { slug: string }) {
  const t = useTranslations("Post");
  const [likes, setLikes] = useState<number>(0);
  const [liked, setLiked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // آدرس دقیق بر اساس ساختار پوشه‌های شما
    fetch(`/api/posts/${slug}/like`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setLikes(data.likes || 0);
        setLiked(data.liked || false);
      })
      .catch((err) => console.error(err));
  }, [slug]);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/posts/${slug}/like`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setLikes(data.likes);
        setLiked(data.liked);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        liked
          ? "bg-red-500 text-white hover:bg-red-600"
          : "bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700"
      }`}
    >
      ❤️ {likes} {liked ? t("liked") : t("like")}
    </button>
  );
}
