import type { WizardData } from "@quickcv/shared-schema";
import photo from "./photo";

const mockWizardData: WizardData = {
	generalInfo: {
		fullName: "Denis Marushchak",
		professionalTitle: "Senior Software Engineer",
		about: [
			{
				type: "paragraph",
				children: [
					{
						text: "Passionate software engineer with 8+ years of experience building scalable web applications. Expert in React, Node.js, and cloud technologies. Led teams of 5+ developers and delivered projects serving millions of users.",
					},
				],
			},
		],
		website: "https://dmrk.dev",
		photo,
	},
	experience: {
		experiences: [
			{
				company: "TechCorp Inc.",
				position: "Senior Software Engineer",
				website: "https://techcorp.com",
				location: "San Francisco, CA",
				dates: {
					current: true,
					startDate: "2020-03",
				},
				description: [
					{
						type: "paragraph",
						children: [
							{
								text: "Lead development of microservices architecture serving 2M+ daily active users. Implemented CI/CD pipelines reducing deployment time by 75%. Mentored junior developers and conducted technical interviews.",
							},
						],
					},
				],
			},
			{
				company: "StartupXYZ",
				position: "Full Stack Developer",
				website: "https://startupxyz.com",
				location: "New York, NY",
				dates: {
					current: false,
					startDate: "2018-06",
					endDate: "2020-02",
				},
				description: [
					{
						type: "paragraph",
						children: [
							{
								text: "Built the entire product from scratch using React and Node.js. Scaled the platform from 0 to 50K users. Implemented real-time features using WebSockets and handled high-traffic scenarios.",
							},
						],
					},
				],
			},
			{
				company: "WebAgency Pro",
				position: "Frontend Developer",
				website: "https://webagencypro.com",
				location: "Los Angeles, CA",
				dates: {
					current: false,
					startDate: "2016-08",
					endDate: "2018-05",
				},
				description: [
					{
						type: "paragraph",
						children: [
							{
								text: "Developed responsive websites and web applications for Fortune 500 clients. Specialized in performance optimization and accessibility standards. Collaborated with designers to implement pixel-perfect UIs.",
							},
						],
					},
				],
			},
		],
	},
	education: {
		education: [
			{
				institution: "University of California, Berkeley",
				degree: "Bachelor of Science in Computer Science",
				location: "Berkeley, CA",
				dates: {
					current: false,
					startDate: "2012-09",
					endDate: "2016-05",
				},
				description: [
					{
						type: "paragraph",
						children: [
							{
								text: "Graduated Magna Cum Laude with focus on software engineering and algorithms. Active member of ACM and hackathon winner. Completed coursework in machine learning, databases, and distributed systems.",
							},
						],
					},
				],
			},
		],
	},
	socials: {
		socials: [
			{
				id: "github",
				name: "GitHub",
				url: "https://github.com/johndoe",
			},
			{
				id: "linkedin",
				name: "LinkedIn",
				url: "https://linkedin.com/in/johndoe",
			},
			{
				id: "twitter",
				name: "Twitter",
				url: "https://twitter.com/johndoe",
			},
			{
				id: "website",
				name: "Personal Website",
				url: "https://johndoe.dev",
			},
		],
	},
};

export default mockWizardData;
