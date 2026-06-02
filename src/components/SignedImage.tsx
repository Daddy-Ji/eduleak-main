import { useEffect, useState } from "react";
import { getSignedUrl } from "@/lib/storage";

type Props = {
  bucket: string;
  path?: string | null;
  alt: string;
  className?: string;
  fallback?: string;
};

export function SignedImage({ bucket, path, alt, className, fallback }: Props) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    if (!path) { setSrc(null); return; }
    getSignedUrl(bucket, path).then((u) => alive && setSrc(u));
    return () => { alive = false; };
  }, [bucket, path]);

  if (!path && !fallback) {
    return (
      <div className={`flex items-center justify-center bg-muted text-muted-foreground text-xs ${className ?? ""}`}>
        {alt.slice(0, 2).toUpperCase()}
      </div>
    );
  }
  return (
    <img
      src={src ?? fallback ?? ""}
      alt={alt}
      loading="lazy"
      className={className}
    />
  );
}
