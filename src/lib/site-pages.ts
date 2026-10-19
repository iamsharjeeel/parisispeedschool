export const pageLinks = [
  {
    href: '/programs',
    label: 'Training programs',
    description:
      'Find the right starting point for your athlete’s age and stage.',
  },
  {
    href: '/speed-agility',
    label: 'Speed & agility',
    description:
      'Explore acceleration, running mechanics, and change of direction.',
  },
  {
    href: '/strength-conditioning',
    label: 'Strength & conditioning',
    description: 'Build a foundation for the physical demands of your sport.',
  },
  {
    href: '/athlete-evaluation',
    label: 'Free athlete evaluation',
    description:
      'Learn about the 60-minute evaluation and request your next step.',
  },
  {
    href: '/coaching',
    label: 'Our coaching approach',
    description:
      'Purposeful training. Personal attention. A coach in your corner.',
  },
  {
    href: '/faqs',
    label: 'Frequently asked questions',
    description: 'Straight answers for athletes and families getting started.',
  },
  {
    href: '/contact',
    label: 'Contact & directions',
    description: 'Talk with the Horsham team or plan your visit.',
  },
] as const;

type Feature = { title: string; text: string };
export type TrainingPage = {
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  emphasis: string;
  intro: string;
  marker: string;
  markerLabel: string;
  sectionLabel: string;
  sectionTitle: string;
  sectionIntro: string;
  features: Feature[];
  note?: string;
  stepsTitle?: string;
  steps?: Feature[];
};

export const trainingPages: Record<string, TrainingPage> = {
  programs: {
    title: 'Youth & Athlete Training Programs in Horsham, PA',
    description:
      'Explore Jump Start, Total Performance, and PEAK athletic training at Parisi Horsham. Find an age-appropriate program and request a free evaluation.',
    eyebrow: 'A PATH FOR EVERY STAGE',
    heading: 'GROW INTO',
    emphasis: 'YOUR GAME.',
    intro:
      'Different ages. Different starting points. The same commitment to helping your athlete move with purpose, build confidence, and take their next step.',
    marker: '01 / 02 / 03',
    markerLabel: 'JUMP START / TOTAL PERFORMANCE / PEAK',
    sectionLabel: 'FIND YOUR FIT',
    sectionTitle: 'THE RIGHT CHALLENGE. AT THE RIGHT TIME.',
    sectionIntro:
      'Start with your athlete’s stage of development. The Horsham team will discuss experience, training goals, and the right program fit with you.',
    features: [],
    stepsTitle: 'YOUR PATH STARTS WITH A CONVERSATION.',
    steps: [
      {
        title: 'Tell us about your athlete',
        text: 'Share their age, sport, experience, and what you want to work on. There is no need to pick a program before speaking with the team.',
      },
      {
        title: 'Establish a starting point',
        text: 'An evaluation looks at sprint speed, agility, power, and movement. Coaches use the conversation and assessment to understand your athlete.',
      },
      {
        title: 'Discuss a training plan',
        text: 'Ask about the recommended program, current schedule, and membership options. Submitting an evaluation request does not enroll you in a paid program.',
      },
    ],
  },
  'speed-agility': {
    title: 'Speed & Agility Training in Horsham, PA',
    description:
      'Explore youth and athlete speed and agility training at Parisi Horsham. Work on acceleration, sprint mechanics, and movement with certified Parisi coaches.',
    eyebrow: 'MOVE WITH PURPOSE',
    heading: 'BUILD YOUR',
    emphasis: 'NEXT GEAR.',
    intro:
      'Speed starts with how you move. Develop running mechanics, acceleration, and control with structured coaching that meets your athlete where they are.',
    marker: 'MOVE.',
    markerLabel: 'ACCELERATE / CHANGE DIRECTION / GO AGAIN',
    sectionLabel: 'THE WORK BEHIND THE MOVEMENT',
    sectionTitle: 'MORE PURPOSE IN EVERY REP.',
    sectionIntro:
      'Athletic movement is more than a straight line. Training brings technique and intent to the way an athlete starts, runs, slows down, and changes direction.',
    features: [
      {
        title: 'Acceleration',
        text: 'Focus on the first steps: body position, how force is applied, and running mechanics. Coaches help athletes understand the movement rather than simply race through a drill.',
      },
      {
        title: 'Sprint mechanics',
        text: 'Work on purposeful running technique and movement efficiency. Coaching cues and practice give athletes a clearer understanding of the habits they are building.',
      },
      {
        title: 'Change of direction',
        text: 'Explore how to slow down, redirect, and accelerate again. Agility training gives movement quality and control a place alongside effort.',
      },
    ],
    note: 'Training is tailored to age, experience, and coaching assessment. Specific drills and session content are confirmed by the Horsham team.',
    stepsTitle: 'START WITH A BASELINE. TRAIN WITH DIRECTION.',
    steps: [
      {
        title: 'Sprint timing',
        text: 'The athlete evaluation includes 10, 20, and 40-yard sprint timing using VALD SmartSpeed laser timing.',
      },
      {
        title: 'Agility assessment',
        text: 'A 5-10-5 shuttle explores acceleration and change of direction. It adds another perspective to straight-line sprint times.',
      },
      {
        title: 'A conversation with a coach',
        text: 'Discuss the results, your athlete’s sport, and their training priorities before deciding on the next step.',
      },
    ],
  },
  'strength-conditioning': {
    title: 'Athlete Strength & Conditioning in Horsham, PA',
    description:
      'Build age-appropriate strength, athletic power, and movement foundations at Parisi Speed School Horsham. Explore training and request a free evaluation.',
    eyebrow: 'BUILD YOUR FOUNDATION',
    heading: 'STRONGER FOR',
    emphasis: 'YOUR SPORT.',
    intro:
      'Build strength with purpose. Age-appropriate coaching connects movement quality, athletic power, and the physical demands of training.',
    marker: 'BUILD.',
    markerLabel: 'FOUNDATION / STRENGTH / ATHLETIC POWER',
    sectionLabel: 'PURPOSE BEFORE LOAD',
    sectionTitle: 'GOOD MOVEMENT COMES FIRST.',
    sectionIntro:
      'A productive training environment gives athletes direction and an appropriate challenge. Coaches consider the athlete’s stage of development and experience.',
    features: [
      {
        title: 'Movement foundations',
        text: 'Develop coordination and an understanding of how to move with control. A coach helps athletes practice the fundamentals and understand what they are working toward.',
      },
      {
        title: 'Age-appropriate strength',
        text: 'Training reflects the athlete’s age and experience. The goal is purposeful development with coaching attention to technique and readiness.',
      },
      {
        title: 'Athletic power',
        text: 'Connect the work in training to explosive athletic movement. An evaluation includes a vertical jump to help establish a starting point for power.',
      },
    ],
    note: 'The movement screening is a training assessment, not a medical evaluation or diagnosis. Discuss medical concerns with an appropriate healthcare professional.',
    stepsTitle: 'BUILD FROM YOUR STARTING POINT.',
    steps: [
      {
        title: 'Understand the athlete',
        text: 'Tell the team about your sport, training experience, and goals. That context helps guide the coaching conversation.',
      },
      {
        title: 'Explore movement and power',
        text: 'The evaluation includes a mobility screening and vertical jump alongside sprint and agility testing.',
      },
      {
        title: 'Choose the right environment',
        text: 'Discuss Jump Start, Total Performance, or PEAK with the team and ask which program suits your athlete’s stage.',
      },
    ],
  },
  'athlete-evaluation': {
    title: 'Request a Free Athlete Evaluation in Horsham, PA',
    description:
      'Request a free 60-minute athlete evaluation at Parisi Horsham. Explore sprint timing, agility, vertical jump, and movement screening with a coach.',
    eyebrow: 'YOUR STARTING LINE',
    heading: 'FIND YOUR',
    emphasis: 'NEXT STEP.',
    intro:
      'Get a clearer picture of how your athlete moves. An approximately 60-minute evaluation brings performance testing and a coaching conversation together.',
    marker: '60',
    markerLabel: 'MINUTES TO EXPLORE YOUR STARTING POINT',
    sectionLabel: 'WHAT WE LOOK AT',
    sectionTitle: 'FOUR PERSPECTIVES. ONE STARTING POINT.',
    sectionIntro:
      'Explore acceleration, agility, power, and movement quality. Leave with perspective and guidance on a training path to discuss with the Horsham team.',
    features: [],
    note: 'Free for eligible new athletes, subject to current confirmation by the Horsham team. The mobility screening is a training assessment, not a medical evaluation or diagnosis.',
    stepsTitle: 'WHAT HAPPENS NEXT.',
    steps: [
      {
        title: 'Send your request',
        text: 'Use the form below to share a few details about you and your athlete. Sending a request does not enroll your athlete in a paid program.',
      },
      {
        title: 'Connect with our team',
        text: 'The Horsham team will contact you to discuss eligibility, answer questions, and arrange a time. Your appointment is confirmed directly with the team.',
      },
      {
        title: 'Meet your starting point',
        text: 'Meet with a coach, explore the assessment, and discuss the next step. Ask the team about clothing, footwear, and preparation when arranging your visit.',
      },
    ],
  },
  coaching: {
    title: 'Certified Parisi Speed Coaches in Horsham, PA',
    description:
      'Learn about the coaching approach at Parisi Horsham: certified Parisi Speed Coaches, structured training, and attention to each athlete’s development.',
    eyebrow: 'A COACH IN YOUR CORNER',
    heading: 'PURPOSE IN',
    emphasis: 'EVERY SESSION.',
    intro:
      'Behind every drill is a reason. Behind every athlete is a coach paying attention. Train in an environment built around instruction, effort, and development.',
    marker: 'TOGETHER.',
    markerLabel: 'SHOW UP / PUT IN THE WORK / KEEP GROWING',
    sectionLabel: 'THE PARISI APPROACH',
    sectionTitle: 'COACHING THAT SEES THE ATHLETE.',
    sectionIntro:
      'Training should help an athlete understand the work. Certified Parisi Speed Coaches bring structure and personal attention to the process.',
    features: [
      {
        title: 'Clear instruction',
        text: 'Coaching gives purpose to practice. Athletes receive guidance on movement and technique so they can understand what a drill is intended to develop.',
      },
      {
        title: 'An appropriate challenge',
        text: 'Age, experience, and stage of development matter. Programs offer different starting points, with the team helping families discuss the right fit.',
      },
      {
        title: 'Attention to progress',
        text: 'An evaluation establishes a baseline and opens a conversation about training priorities. The work starts with understanding the individual athlete.',
      },
    ],
    stepsTitle: 'GET TO KNOW YOUR TRAINING ENVIRONMENT.',
    steps: [
      {
        title: 'Bring your questions',
        text: 'Ask how training relates to your athlete’s sport, what a session involves, and how the program fits their current experience.',
      },
      {
        title: 'Start with an evaluation',
        text: 'Sprint timing, agility, power, and movement assessments give the coaching conversation a starting point.',
      },
      {
        title: 'Talk with the Horsham team',
        text: 'The team can discuss current coaches, program availability, schedules, and the next step for your athlete.',
      },
    ],
  },
  faqs: {
    title: 'Athlete Training & Evaluation FAQs | Horsham, PA',
    description:
      'Answers about Parisi Horsham programs, the free athlete evaluation, what happens after a request, and where to find the training facility.',
    eyebrow: 'GOOD QUESTIONS. STRAIGHT ANSWERS.',
    heading: 'BEFORE YOU',
    emphasis: 'GET STARTED.',
    intro:
      'Choosing a training environment is a conversation. Here are the basics about the evaluation, program fit, and planning your first visit.',
    marker: 'ASK.',
    markerLabel: 'YOUR ATHLETE / YOUR QUESTIONS / OUR TEAM',
    sectionLabel: 'THE DETAILS THAT HELP',
    sectionTitle: 'A CLEARER FIRST STEP.',
    sectionIntro:
      'For current pricing, schedules, and availability, speak directly with the Horsham team. They can confirm the details for your athlete and program.',
    features: [],
  },
  contact: {
    title: 'Contact Parisi Speed School Horsham & Directions',
    description:
      'Contact Parisi Horsham at 215-706-8260 or visit 400 Horsham Road, Horsham, PA 19044. Ask about athlete training or request a free evaluation.',
    eyebrow: 'RIGHT HERE IN HORSHAM',
    heading: 'LET’S TALK',
    emphasis: 'PERFORMANCE.',
    intro:
      'Have a question about your athlete’s next step? Talk with the Horsham team about programs, the evaluation, and planning a visit.',
    marker: 'HORSHAM.',
    markerLabel: '400 HORSHAM ROAD / PENNSYLVANIA',
    sectionLabel: 'COME TRAIN WITH US',
    sectionTitle: 'YOUR LOCAL STARTING LINE.',
    sectionIntro:
      'Find us at 400 Horsham Road, Horsham, PA 19044. Contact the team to confirm current hours, session availability, and evaluation arrangements before visiting.',
    features: [],
    stepsTitle: 'BEFORE YOUR FIRST VISIT.',
    steps: [
      {
        title: 'Arrange a time',
        text: 'Request an evaluation or call the team. An online request is the first step; your visit is confirmed when the Horsham team arranges it with you.',
      },
      {
        title: 'Ask about preparation',
        text: 'Confirm appropriate footwear, clothing, and anything else your athlete should bring for their session.',
      },
      {
        title: 'Get directions',
        text: 'Open the map link for directions to 400 Horsham Road. Call if you have questions about finding the facility.',
      },
    ],
  },
};
