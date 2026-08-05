import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import type {
  CompanyData,
  JobData,
  PersonalInfo,
  ResumeData,
} from "@/types/resume-builder";

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#111111",
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E2DC",
    paddingBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    color: "#8A857E",
    marginBottom: 6,
  },
  contact: {
    fontSize: 9,
    color: "#8A857E",
  },
  section: {
    marginTop: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
    color: "#C4532A",
  },
  body: {
    fontSize: 10,
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 2,
  },
  itemMeta: {
    fontSize: 9,
    color: "#8A857E",
    marginBottom: 4,
  },
  bullet: {
    marginLeft: 10,
    marginBottom: 2,
  },
  skills: {
    fontSize: 10,
  },
});

function ResumeDocument({ resume }: { resume: ResumeData }) {
  const { personalInfo } = resume;
  const contact = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedin,
    personalInfo.github,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.fullName}</Text>
          <Text style={styles.title}>{personalInfo.professionalTitle}</Text>
          <Text style={styles.contact}>{contact}</Text>
        </View>

        {resume.summary ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.body}>{resume.summary}</Text>
          </View>
        ) : null}

        {resume.skills.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text style={styles.skills}>{resume.skills.join(" · ")}</Text>
          </View>
        ) : null}

        {resume.experience.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {resume.experience.map((exp) => (
              <View key={exp.id} style={{ marginBottom: 8 }}>
                <Text style={styles.itemTitle}>
                  {exp.role} — {exp.company}
                </Text>
                <Text style={styles.itemMeta}>
                  {exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate}
                  {exp.location ? ` · ${exp.location}` : ""}
                </Text>
                {exp.achievements.map((achievement, i) => (
                  <Text key={i} style={styles.bullet}>
                    • {achievement}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        ) : null}

        {resume.education.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {resume.education.map((edu) => (
              <View key={edu.id} style={{ marginBottom: 6 }}>
                <Text style={styles.itemTitle}>
                  {edu.qualification}
                  {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}
                </Text>
                <Text style={styles.itemMeta}>
                  {edu.institution}
                  {edu.endDate ? ` · ${edu.endDate}` : ""}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {resume.projects.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {resume.projects.map((project) => (
              <View key={project.id} style={{ marginBottom: 6 }}>
                <Text style={styles.itemTitle}>{project.name}</Text>
                <Text style={styles.body}>{project.description}</Text>
                {project.technologies.length > 0 ? (
                  <Text style={styles.itemMeta}>
                    {project.technologies.join(" · ")}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}
      </Page>
    </Document>
  );
}

function CoverLetterDocument({
  coverLetter,
  personalInfo,
  company,
  job,
}: {
  coverLetter: string;
  personalInfo: PersonalInfo;
  company: CompanyData;
  job: JobData;
}) {
  const date = new Date().toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const paragraphs = coverLetter.split(/\n\n+/).filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.body}>{date}</Text>
        <View style={{ marginTop: 16, marginBottom: 16 }}>
          {company.hiringManagerName ? (
            <Text style={styles.body}>{company.hiringManagerName}</Text>
          ) : null}
          <Text style={styles.body}>{company.companyName}</Text>
          {job.location ? <Text style={styles.body}>{job.location}</Text> : null}
        </View>
        <Text style={[styles.body, { marginBottom: 12 }]}>
          Re: {job.jobTitle}
        </Text>
        {paragraphs.map((paragraph, index) => (
          <Text key={index} style={[styles.body, { marginBottom: 10 }]}>
            {paragraph}
          </Text>
        ))}
        <Text style={[styles.body, { marginTop: 16 }]}>
          Sincerely,{"\n"}
          {personalInfo.fullName}
        </Text>
      </Page>
    </Document>
  );
}

export async function generateResumePdfBlob(resume: ResumeData): Promise<Blob> {
  return pdf(<ResumeDocument resume={resume} />).toBlob();
}

export async function generateCoverLetterPdfBlob(
  coverLetter: string,
  personalInfo: PersonalInfo,
  company: CompanyData,
  job: JobData
): Promise<Blob> {
  return pdf(
    <CoverLetterDocument
      coverLetter={coverLetter}
      personalInfo={personalInfo}
      company={company}
      job={job}
    />
  ).toBlob();
}
