// import type { NextConfig } from "next";
// import createMDX from "@next/mdx";
// const nextConfig: NextConfig = {
//   // فعال‌سازی پسوندهای md و mdx برای صفحات
//   pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
//   /* سایر تنظیمات اختیاری شما در اینجا قرار می‌گیرند */
// };
// const withMDX = createMDX({
//   // پلاگین‌های اختیاری در صورت نیاز اینجا اضافه می‌شوند
// });

// export default withMDX(nextConfig);
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// // آدرس فایل کانفیگ i18n
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

// const nextConfig: NextConfig = {
//   // تنظیمات دیگر شما در صورت وجود اینجا قرار می‌گیرد
// };


const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/**": ["./content/**/*"],
  },
  typescript: {
    // نادیده گرفتن خطاهای تایپ‌اسکریپت در بیلد
    ignoreBuildErrors: true,
  }
};
export default withNextIntl(nextConfig);

