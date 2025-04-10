export const staticSteps = [
  {
    stepNumber: 1,
    title: "Welcome to the Program",
    description: "Watch the introduction video and answer the questions.",
    media: {
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      image: "https://cdn.example.com/images/welcome.jpg"
    },
    questions: [
      { label: "What is your full name?", type: "text" },
      { label: "What is your learning goal?", type: "textarea" },
      { label: "Preferred learning style?", type: "radio", options: ["Visual", "Auditory", "Reading/Writing", "Kinesthetic"] },
      { label: "Topics of interest", type: "multiselect", options: ["AI", "Web Development", "UI/UX", "Project Management"] },
      { label: "Confidence level", type: "slider", min: 1, max: 10, step: 1 },
      { label: "Message to mentors", type: "textarea" }
    ]
  },
  {
    stepNumber: 2,
    title: "About the Program",
    description: "Read about the program and provide your expectations.",
    media: {
      video: null,
      image: "https://cdn.example.com/images/about.jpg"
    },
    questions: [
      { label: "What do you expect to gain from this program?", type: "textarea" },
      { label: "What skills are you most interested in?", type: "text" },
      { label: "Preferred session timing", type: "radio", options: ["Morning", "Afternoon", "Evening"] },
      { label: "Support needed", type: "multiselect", options: ["Mentorship", "Technical Help", "Resources"] },
      { label: "Readiness to commit", type: "slider", min: 1, max: 10, step: 1 },
      { label: "Suggestions or ideas", type: "textarea" }
    ]
  },
  {
    stepNumber: 3,
    title: "Tools & Resources",
    description: "Watch the tools overview and submit your understanding.",
    media: {
      video: "https://www.youtube.com/embed/oHg5SJYRHA0",
      image: null
    },
    questions: [
      { label: "Which tool are you excited to use?", type: "text" },
      { label: "Why is it important?", type: "textarea" },
      { label: "Tool familiarity", type: "radio", options: ["Beginner", "Intermediate", "Advanced"] },
      { label: "Tools you have used", type: "multiselect", options: ["Figma", "Notion", "Trello", "VSCode"] },
      { label: "Ease of use rating", type: "slider", min: 1, max: 5 },
      { label: "Comments", type: "textarea" }
    ]
  },
  {
    stepNumber: 4,
    title: "Project Pitch",
    description: "Write your initial project idea and its impact.",
    media: {
      video: null,
      image: null
    },
    questions: [
      { label: "Project title", type: "text" },
      { label: "Describe your project idea", type: "textarea" },
      { label: "Project value", type: "radio", options: ["Educational", "Technical", "Social", "Commercial"] },
      { label: "Target audience", type: "multiselect", options: ["Students", "Professionals", "Businesses"] },
      { label: "Impact potential", type: "slider", min: 1, max: 10 },
      { label: "Challenges expected", type: "textarea" }
    ]
  },
  {
    stepNumber: 5,
    title: "Prototype Design",
    description: "Attach design inspiration or initial mockups.",
    media: {
      video: null,
      image: "https://cdn.example.com/images/prototype.png"
    },
    questions: [
      { label: "Design tools to use", type: "text" },
      { label: "Describe your first mockup", type: "textarea" },
      { label: "Design clarity", type: "radio", options: ["Clear", "Moderate", "Unclear"] },
      { label: "Feedback source", type: "multiselect", options: ["Peers", "Mentors", "Online" ] },
      { label: "Design readiness", type: "slider", min: 1, max: 10 },
      { label: "Design improvement ideas", type: "textarea" }
    ]
  },
  {
    stepNumber: 6,
    title: "Technical Skills Assessment",
    description: "Take the skill check video and self-assess.",
    media: {
      video: "https://www.youtube.com/embed/tgbNymZ7vqY",
      image: null
    },
    questions: [
      { label: "Current skill level", type: "slider", min: 1, max: 10 },
      { label: "Support needed", type: "textarea" },
      { label: "Preferred tech stack", type: "radio", options: ["MERN", "MEAN", "Django", "Laravel"] },
      { label: "Languages you use", type: "multiselect", options: ["JavaScript", "Python", "Java", "C++"] },
      { label: "Skill confidence", type: "slider", min: 1, max: 10 },
      { label: "Comment on your journey", type: "textarea" }
    ]
  },
  {
    stepNumber: 7,
    title: "Submit CV or LinkedIn",
    description: "Provide your professional background.",
    media: {
      video: null,
      image: null
    },
    questions: [
      { label: "LinkedIn or CV URL", type: "text" },
      { label: "Top 3 achievements", type: "textarea" },
      { label: "Career stage", type: "radio", options: ["Student", "Graduate", "Professional"] },
      { label: "Soft skills", type: "multiselect", options: ["Communication", "Leadership", "Teamwork"] },
      { label: "Career readiness", type: "slider", min: 1, max: 10 },
      { label: "Message to recruiters", type: "textarea" }
    ]
  },
  {
    stepNumber: 8,
    title: "Teamwork & Collaboration",
    description: "Watch team collaboration practices.",
    media: {
      video: "https://www.youtube.com/embed/kxopViU98Xo",
      image: "https://cdn.example.com/images/team.jpg"
    },
    questions: [
      { label: "Teamwork experience", type: "textarea" },
      { label: "Ideal team role", type: "text" },
      { label: "Collaboration preference", type: "radio", options: ["In-person", "Remote", "Hybrid"] },
      { label: "Team tools used", type: "multiselect", options: ["Slack", "Zoom", "Trello"] },
      { label: "Team collaboration rating", type: "slider", min: 1, max: 10 },
      { label: "Teamwork improvement suggestion", type: "textarea" }
    ]
  },
  {
    stepNumber: 9,
    title: "Time Management",
    description: "Learn about planning & task prioritization.",
    media: {
      video: "https://www.youtube.com/embed/hJwFobPlFh0",
      image: null
    },
    questions: [
      { label: "Daily planning strategy", type: "textarea" },
      { label: "Time management tools", type: "text" },
      { label: "Preferred task style", type: "radio", options: ["To-do Lists", "Calendar Blocking", "Pomodoro"] },
      { label: "Productivity apps", type: "multiselect", options: ["Notion", "Google Calendar", "Asana"] },
      { label: "Productivity score", type: "slider", min: 1, max: 10 },
      { label: "Advice for others", type: "textarea" }
    ]
  },
  {
    stepNumber: 10,
    title: "Final Review",
    description: "Answer the final reflection questions.",
    media: {
      video: null,
      image: "https://cdn.example.com/images/final-check.png"
    },
    questions: [
      { label: "Most enjoyable part?", type: "textarea" },
      { label: "Improvement areas?", type: "textarea" },
      { label: "Readiness for next step?", type: "text" },
      { label: "Program satisfaction", type: "radio", options: ["Very Satisfied", "Satisfied", "Neutral", "Unsatisfied"] },
      { label: "Suggestions for future", type: "multiselect", options: ["More content", "Better tools", "More mentors"] },
      { label: "Overall experience score", type: "slider", min: 1, max: 10 }
    ]
  }
];