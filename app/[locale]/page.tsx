// app/[locale]/page.tsx
import { reader } from "@/lib/keystatic-reader";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { MobileFooter } from "@/components/HeroHeader";
interface PageProps {
  params: Promise<{ locale: string }>;
}
type CountItem = {
  postSlug: string;
  _count: {
    _all: number;
  };
};

function getExcerpt(content: any, maxLength = 200): string {
  if (!content) return "";

  let plainText = "";

  if (typeof content === "string") {
    plainText = content;
  } else if (Array.isArray(content)) {
    const extractText = (nodes: any[]): string => {
      return nodes
        .map((node) => {
          if (node.text) return node.text;
          if (node.children) return extractText(node.children);
          return "";
        })
        .join(" ");
    };
    plainText = extractText(content);
  }

  const cleaned = plainText
    .replace(/[#*`_~>[\]()!]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.slice(0, maxLength).trim() + "...";
}

// محاسبه زمان تقریبی مطالعه (بر اساس ۲۰۰ کلمه در دقیقه)
function estimateReadingTime(content: any): number {
  let text = "";
  if (typeof content === "string") {
    text = content;
  } else if (Array.isArray(content)) {
    const extractText = (nodes: any[]): string =>
      nodes
        .map((n) => n.text || (n.children ? extractText(n.children) : ""))
        .join(" ");
    text = extractText(content);
  }

  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function formatDate(dateLike: string | Date | undefined, locale: string) {
  if (!dateLike) return "—";
  const d = typeof dateLike === "string" ? new Date(dateLike) : dateLike;

  if (Number.isNaN(d.getTime())) return String(dateLike);

  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(d);
}

// آیکون‌های مینیمال
function ClockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      className="fill-none stroke-current stroke-2"
    >
      <path d="M12 8v5l3 2" />
      <path d="M12 22a10 10 0 1 0-10-10 10 10 0 0 0 10 10z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      className="fill-none stroke-current stroke-2"
    >
      <path d="M12 21s-7-4.4-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.6-9.5 9-9.5 9z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      className="fill-none stroke-current stroke-2"
    >
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
    </svg>
  );
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Posts" });
  const rawPosts = await reader.collections.posts.all();

  // گرفتن همه اسلاگ‌ها برای کوئری دیتابیس
  const slugs = rawPosts.map((p) => p.slug);

  // دریافت آمار لایک و کامنت تمام پست‌ها به صورت تجمیعی از دیتابیس Prisma

  const posts = await Promise.all(
    rawPosts.map(async (post) => {
      let fullContent: any = "";
      if (typeof post.entry.content === "function") {
        fullContent = await post.entry.content();
      } else {
        fullContent =
          post.entry.content || (post.entry as any).description || "";
      }

      const excerpt = getExcerpt(
        (post.entry as any).description || fullContent,
        200,
      );
      const readingTime = estimateReadingTime(fullContent);

      return {
        ...post,
        excerpt,
        readingTime,
      };
    }),
  );

  const isFa = locale === "fa";

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* تیتر لیست مقالات */}
      <div className="flex items-center gap-3 mb-8">
        <span className="w-2.5 h-2.5 rounded-full bg-accent-orange" />
        <h2 className="text-2xl sm:text-3xl font-extrabold text-text-main tracking-tight">
          {t("title")}
        </h2>
      </div>

      {/* لیست کارت‌های عریض با کادر و افکت هاور */}
      <div className="space-y-6">
        {posts.map((post) => {
          const dateRaw = (post.entry as any).date as string | undefined;

          return (
            <article
              key={post.slug}
              className="group p-6 sm:p-8 rounded-2xl bg-bg-card border border-border-subtle hover:border-accent-orange/40 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            >
              {/* بدنه متنی کارت */}
              <div className="flex-1 min-w-0">
                {/* ردیف متادیتا: تاریخ | زمان مطالعه | لایک | کامنت */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-text-muted mb-3 font-mono">
                  {dateRaw && (
                    <>
                      <span>{formatDate(dateRaw, locale)}</span>
                      <span className="opacity-40">•</span>
                    </>
                  )}

                  <span className="inline-flex items-center gap-1.5">
                    <ClockIcon />
                    <span>
                      {post.readingTime} {isFa ? "دقیقه مطالعه" : "min read"}
                    </span>
                  </span>

                  <span className="opacity-40">•</span>

                  <span
                    className="inline-flex items-center gap-1.5"
                    title="Likes"
                  >
                    <HeartIcon />
                  </span>

                  <span className="opacity-40">•</span>

                  <span
                    className="inline-flex items-center gap-1.5"
                    title="Comments"
                  >
                    <CommentIcon />
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-text-main group-hover:text-accent-orange transition-colors duration-200 mb-3 leading-snug">
                  <Link href={`/posts/${post.slug}`}>{post.entry.title}</Link>
                </h3>

                <p className="text-text-muted text-sm sm:text-base leading-relaxed line-clamp-2 sm:line-clamp-3 mb-4">
                  {post.excerpt}
                </p>

                <div>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="text-accent-orange hover:opacity-80 text-sm font-semibold inline-flex items-center gap-2 transition-all group/btn"
                  >
                    <span>{isFa ? "ادامه مطلب" : "Read More"}</span>
                    <span className="transition-transform group-hover/btn:translate-x-1 duration-200">
                      {isFa ? "←" : "→"}
                    </span>
                  </Link>
                </div>
              </div>

              {/* تصویر بندانگشتی در کادر */}
              {post.entry.coverImage ? (
                <Link
                  href={`/posts/${post.slug}`}
                  className="relative w-full sm:w-36 sm:h-36 h-48 shrink-0 rounded-xl overflow-hidden border border-border-subtle group-hover:scale-[1.02] transition-transform duration-300"
                >
                  <img
                    src={post.entry.coverImage}
                    alt={post.entry.title}
                    className="w-full h-full object-cover"
                  />
                </Link>
              ) : null}
            </article>
          );
        })}
      </div>
      <MobileFooter locale={locale} />
    </div>
  );
}
