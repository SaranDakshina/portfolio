"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Experience } from "@/data/experience";
import TimelineStar from "./TimelineStar";
import styles from "./careerTimeline.module.scss";

type MarkerState = "completed" | "active" | "future";

interface CareerTimelineItemProps {
  experience: Experience;
  markerState: MarkerState;
  isActive: boolean;
  onMarkerClick: (id: string) => void;
  itemRef: (el: HTMLLIElement | null) => void;
  markerRef: (el: HTMLButtonElement | null) => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function CareerTimelineItem({
  experience,
  markerState,
  isActive,
  onMarkerClick,
  itemRef,
  markerRef,
}: CareerTimelineItemProps) {
  const reducedMotion = useReducedMotion();
  const dateLabel = `${experience.startDate} — ${experience.endDate}`;
  const companyLine = [
    experience.company,
    experience.location,
    experience.workMode,
  ]
    .filter(Boolean)
    .join(" · ");

  const motionProps = reducedMotion
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.3 },
      };

  const transition = (delay: number) =>
    reducedMotion
      ? { duration: 0 }
      : { duration: 0.45, ease: "easeOut" as const, delay };

  return (
    <li
      ref={itemRef}
      id={`experience-${experience.id}`}
      data-experience-id={experience.id}
      data-active={isActive}
      className={styles.item}
    >
      <time
        className={styles.date}
        dateTime={`${experience.startDate}/${experience.endDate}`}
        data-active={isActive}
        data-completed={markerState === "completed"}
      >
        {dateLabel}
      </time>

      <div className={styles.markerCell}>
        <button
          ref={markerRef}
          type="button"
          className={styles.marker}
          data-state={markerState}
          aria-label={`Go to ${experience.title} at ${experience.company}`}
          aria-current={markerState === "active" ? "step" : undefined}
          onClick={() => onMarkerClick(experience.id)}
        >
          <TimelineStar state={markerState} />
        </button>
      </div>

      <div className={styles.content}>
        <motion.div {...motionProps} variants={fadeUp} transition={transition(0)}>
          <h3 className={styles.title}>{experience.title}</h3>
          <p className={styles.company}>{companyLine}</p>
        </motion.div>

        <motion.p
          className={styles.summary}
          {...motionProps}
          variants={fadeUp}
          transition={transition(0.08)}
        >
          {experience.summary}
        </motion.p>

        <motion.ul
          className={styles.achievements}
          {...motionProps}
          variants={fadeUp}
          transition={transition(0.14)}
        >
          {experience.achievements.map((achievement) => (
            <li key={achievement} className={styles.achievement}>
              <span className={styles.bullet} aria-hidden="true" />
              {achievement}
            </li>
          ))}
        </motion.ul>

        <motion.ul
          className={styles.technologies}
          aria-label="Technologies"
          {...motionProps}
          variants={fadeUp}
          transition={transition(0.2)}
        >
          {experience.technologies.map((tech) => (
            <li key={tech} className={styles.tech}>
              {tech}
            </li>
          ))}
        </motion.ul>
      </div>
    </li>
  );
}
