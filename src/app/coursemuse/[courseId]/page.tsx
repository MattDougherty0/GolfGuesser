import { notFound } from "next/navigation";
import MainWithSidebar from "@/components/layout/MainWithSidebar";
import CourseMuseCourseView from "@/components/coursemuse/CourseMuseCourseView";
import { getAnswerCardById } from "@/data/coursemuse/answer-cards";
import { getCoursePageContent } from "@/data/coursemuse/course-pages";
import { getCourseById } from "@/lib/courses";
import { COURSE_MUSE_COURSE_IDS, isCourseMuseCourseId } from "@/lib/coursemuse/constants";
import type { AnswerCard } from "@/lib/coursemuse/types";

export function generateStaticParams() {
  return COURSE_MUSE_COURSE_IDS.map((courseId) => ({ courseId }));
}

export default async function CourseMuseCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  if (!isCourseMuseCourseId(courseId)) notFound();

  const course = getCourseById(courseId);
  const lab = getCoursePageContent(courseId);
  if (!course || !lab) notFound();

  const cards: AnswerCard[] = lab.cardIds
    .map((id) => getAnswerCardById(id))
    .filter((c): c is AnswerCard => c != null);

  return (
    <MainWithSidebar>
      <CourseMuseCourseView course={course} lab={lab} cards={cards} />
    </MainWithSidebar>
  );
}
