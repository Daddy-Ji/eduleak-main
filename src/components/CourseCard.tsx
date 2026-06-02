import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { PlayCircle, FileText, ExternalLink } from "lucide-react";
import { SignedImage } from "./SignedImage";

type Course = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  course_type: "youtube" | "pdf" | "external";
  coaching?: { name: string; slug: string; logo_url: string | null } | null;
  exam?: { name: string; slug: string } | null;
};

const icon = {
  youtube: PlayCircle,
  pdf: FileText,
  external: ExternalLink,
};

export function CourseCard({ course, index = 0 }: { course: Course; index?: number }) {
  const Icon = icon[course.course_type];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
    >
      <Link
        to="/courses/$slug"
        params={{ slug: course.slug }}
        className="group block rounded-2xl border bg-card overflow-hidden hover:shadow-soft hover:-translate-y-1 transition-all duration-300"
      >
        <div className="aspect-video bg-muted relative overflow-hidden">
          <SignedImage
            bucket="course-covers"
            path={course.cover_url}
            alt={course.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-background/90 backdrop-blur px-3 py-1 text-xs font-medium">
            <Icon className="h-3.5 w-3.5" />
            {course.course_type === "youtube" ? "Video" : course.course_type === "pdf" ? "Notes" : "External"}
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            {course.coaching && <span>{course.coaching.name}</span>}
            {course.coaching && course.exam && <span>•</span>}
            {course.exam && <span>{course.exam.name}</span>}
          </div>
          <h3 className="font-display text-lg font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {course.title}
          </h3>
          {course.description && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{course.description}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
