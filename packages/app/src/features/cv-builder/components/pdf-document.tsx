import type { FormData } from "@quickcv/shared-schema";
import { formatDateRange } from "@quickcv/shared-utils";
import {
	Document,
	Font,
	Image,
	Page,
	StyleSheet,
	Text,
	View,
} from "@react-pdf/renderer";
import type React from "react";
import { RichTextPDFRenderer } from "@/lib/rich-text-pdf-renderer";

Font.register({
	family: "RethinkSans",
	fonts: [
		{
			src: "/rethink/RethinkSans-Regular.ttf",
			fontWeight: "normal",
			fontStyle: "normal",
		},
		{
			src: "/rethink/RethinkSans-Medium.ttf",
			fontWeight: "medium",
			fontStyle: "normal",
		},
		{
			src: "/rethink/RethinkSans-SemiBold.ttf",
			fontWeight: "semibold",
			fontStyle: "normal",
		},
		{
			src: "/rethink/RethinkSans-Bold.ttf",
			fontWeight: "bold",
			fontStyle: "normal",
		},
	],
});

const styles = StyleSheet.create({
	page: {
		fontFamily: "RethinkSans",
		fontSize: 12,
		padding: 32,
		lineHeight: 1.3,
		backgroundColor: "#ffffff",
		color: "#000000",
	},
	header: {
		flexDirection: "row",
		gap: 16,
		alignItems: "flex-start",
	},
	headerContent: {
		flex: 1,
	},
	profilePhoto: {
		width: 52,
		height: 52,
		borderRadius: 40,
		objectFit: "cover",
	},
	fullName: {
		fontSize: 14,
		fontWeight: "600",
		marginBottom: 2,
		letterSpacing: "-0.5px",
		color: "#000000",
		lineHeight: 1.2,
	},
	professionalTitle: {
		fontSize: 12,
		fontWeight: "600",
		letterSpacing: "-0.5px",
		color: "#71717a", // zinc-500 equivalent
		marginBottom: 4,
	},
	about: {
		fontSize: 9,
		color: "#27272a", // zinc-800 equivalent
		lineHeight: 1.3,
		marginTop: 16,
	},
	section: {
		marginTop: 10,
	},
	sectionTitle: {
		fontSize: 12,
		fontWeight: "600",
		color: "#000000",
		lineHeight: 1.4,
	},
	jobHeader: {
		flexDirection: "row",
		alignItems: "flex-start",
		marginBottom: 4,
	},
	jobMainInfo: {
		display: "flex",
		flexDirection: "column",
		gap: 2,
	},
	dateText: {
		marginTop: 2,
		fontSize: 9,
		fontWeight: "normal",
		color: "#71717a", // zinc-500
		width: "110px",
	},
	jobTitle: {
		fontSize: 10,
		fontWeight: "600",
		color: "#000000",
	},
	jobLocation: {
		fontSize: 9,
		color: "#71717a", // zinc-500
	},
	skillsContainer: {
		gap: 4,
		marginBottom: 8,
	},
	jobDescription: {
		fontSize: 9,
		color: "#27272a", // zinc-800
		lineHeight: 1.4,
		marginTop: 2,
		marginLeft: 110,
	},
	listItem: {
		fontSize: 9,
		color: "#27272a",
		lineHeight: 1.4,
		marginBottom: 4,
	},
	socialItem: {
		flexDirection: "row",
		marginTop: 8,
		alignItems: "center",
	},
	socialName: {
		fontSize: 9,
		fontWeight: "500",
		color: "#000000",
		width: 80,
	},
	socialUrl: {
		fontSize: 9,
		color: "#6366f1", // blue-500
		textDecoration: "underline",
	},
	// Experience badge styling
	experienceSection: {
		marginTop: 10,
	},
	experienceBadge: {
		color: "#71717a",
		fontSize: 9,
		fontWeight: "500",
	},
});

interface PDFDocumentProps {
	data: FormData;
}

const formatDateRangeForPDF = (dates: {
	current: boolean;
	startDate: string;
	endDate?: string;
}): string => {
	return formatDateRange(dates).replace(" - ", " — ");
};

export const PDFDocument: React.FC<PDFDocumentProps> = ({ data }) => {
	const totalExperience = data.experience.experiences.length;

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				{/* Header Section */}
				<View style={styles.header}>
					{data.generalInfo.photo && (
						<Image style={styles.profilePhoto} src={data.generalInfo.photo} />
					)}
					<View style={styles.headerContent}>
						<Text style={styles.fullName}>{data.generalInfo.fullName}</Text>
						<Text style={styles.professionalTitle}>
							{data.generalInfo.professionalTitle}
						</Text>
					</View>
				</View>

				{data.generalInfo.about && (
					<RichTextPDFRenderer
						content={data.generalInfo.about}
						style={styles.about}
					/>
				)}

				{data.experience.experiences.length > 0 && (
					<View style={styles.section}>
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "flex-start",
							}}
						>
							<Text style={styles.sectionTitle}>Work Experience</Text>
							<Text style={styles.experienceBadge}>
								{totalExperience}+ years
							</Text>
						</View>

						{data.experience.experiences.map((exp, index) => {
							return (
								<View
									key={`${exp.company}-${exp.position}-${index}`}
									style={
										index === data.experience.experiences.length - 1
											? [
													styles.experienceSection,
													{
														borderBottom: "none",
														paddingBottom: 0,
														marginTop: 10,
													},
												]
											: styles.experienceSection
									}
								>
									<View>
										<View style={styles.jobHeader}>
											<Text style={styles.dateText}>
												{formatDateRangeForPDF({
													current: exp.dates.current,
													startDate: exp.dates.startDate,
													endDate: exp.dates.current
														? undefined
														: exp.dates.endDate,
												})}
											</Text>
											<View style={styles.jobMainInfo}>
												<Text style={styles.jobTitle}>
													{exp.position.trim()} at {exp.company}
												</Text>
												{exp.location && (
													<Text style={styles.jobLocation}>{exp.location}</Text>
												)}
											</View>
										</View>
										{exp.description && (
											<RichTextPDFRenderer
												content={exp.description}
												style={styles.jobDescription}
											/>
										)}
									</View>
								</View>
							);
						})}
					</View>
				)}

				{/* Education Section */}
				{data.education.education.length > 0 && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Education</Text>
						{data.education.education.map((edu, index) => (
							<View
								key={`${edu.institution}-${edu.degree}-${index}`}
								style={
									index === data.education.education.length - 1
										? [
												styles.experienceSection,
												{ borderBottom: "none", paddingBottom: 0 },
											]
										: styles.experienceSection
								}
							>
								<View>
									<View style={styles.jobHeader}>
										<Text style={styles.dateText}>
											{formatDateRangeForPDF({
												current: edu.dates.current,
												startDate: edu.dates.startDate,
												endDate: edu.dates.current
													? undefined
													: edu.dates.endDate,
											})}
										</Text>
										<View style={styles.jobMainInfo}>
											<Text style={styles.jobTitle}>
												{edu.degree.trim()} at {edu.institution.trim()}
											</Text>
											{edu.location && (
												<Text style={styles.jobLocation}>
													{edu.location.trim()}
												</Text>
											)}
										</View>
									</View>
									{edu.description && (
										<RichTextPDFRenderer
											content={edu.description}
											style={styles.jobDescription}
										/>
									)}
								</View>
							</View>
						))}
					</View>
				)}

				{/* Socials Section */}
				{data.socials.socials.length > 0 && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Socials</Text>
						{data.socials.socials.map((social, index) => (
							<View
								key={`${social.name}-${social.url}-${index}`}
								style={styles.socialItem}
							>
								<Text style={styles.socialName}>{social.name}</Text>
								<Text style={styles.socialUrl}>{social.url}</Text>
							</View>
						))}
					</View>
				)}
			</Page>
		</Document>
	);
};
