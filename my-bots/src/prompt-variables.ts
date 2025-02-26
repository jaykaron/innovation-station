export interface PromptVariable {
  replacementToken: string;
  value: string;
}

export const PATIENT_MESSAGE_SUMMARY_VARIABLES = [
  {
    replacementToken: "{{message1}}",
    value: "Hi Dr. Johnson, I hope you're having a good week. I'm writing because I've been having these terrible headaches for about a month now. They usually start right behind my eyes and then spread to the whole front of my head. The pain is really intense, like someone's squeezing my brain, and it makes it hard to focus on anything. I work as an accountant, so I'm looking at screens all day, which seems to make it worse. The headaches come on almost every day, usually in the afternoon, and last for several hours. I've been taking over-the-counter painkillers, usually two or three Tylenol, but they barely take the edge off. I've also tried drinking more water and cutting back on caffeine, but it hasn't helped much. Last week, I had one headache that was so bad it made me feel nauseous, and I had to leave work early. I'm worried this might be something serious, like a tumor or something. My aunt had brain cancer a few years ago, and it started with headaches, so I'm a bit freaked out. I've never had migraines before, but could this be what they're like? Should I be concerned about my vision? I haven't noticed any changes, but I'm due for an eye exam anyway. Do you think I should come in for a check-up, or maybe get some tests done? I'd really appreciate your advice on this. Thanks for your time, Dr. Johnson."
  },
  {
    replacementToken: "{{summary1}}",
    value: `
      * Experiencing severe headaches for 1 month, starting behind eyes and spreading to front of head
      * Headaches occur daily, usually in afternoon, lasting several hours
      * OTC painkillers (Tylenol) provide minimal relief
      * Symptoms worsen with screen use at work
      * One episode caused nausea and early departure from work
      * Concerned about possible serious causes (e.g., tumor, vision issues)
      * Requesting advice on need for check-up or further testing
    `,
  },
  {
    replacementToken: "{{message2}}",
    value: `Dear Dr. Garcia, I hope this message finds you well. I'm reaching out because I've been having some troubling symptoms lately that I'm not sure what to make of. For the past three weeks, I've been feeling really tired all the time, no matter how much sleep I get. I usually aim for 7-8 hours a night, but even after that, I wake up feeling exhausted. It's affecting my work at the construction site - I'm having trouble concentrating and feeling weak when I'm lifting materials. I've also noticed that I'm losing weight without trying. I've dropped about 10 pounds in the last month, even though I haven't changed my diet or exercise routine. In fact, I've been eating more than usual because I feel hungry all the time. Another strange thing is that I've been feeling really thirsty, drinking water constantly, and using the bathroom much more frequently than normal, especially at night. It's disrupting my sleep, having to get up 3-4 times to use the restroom. I've also noticed some blurry vision, particularly when I'm trying to read or look at my phone. At first, I thought it was just from being tired, but it's not going away. I don't have a family history of any major illnesses, but I'm worried this could be something serious. Could it be diabetes? Or maybe a thyroid problem? I've never had issues like this before. Should I come in for some tests? I appreciate any guidance you can provide. Thank you for your time and expertise.`,
  },
  {
    replacementToken: "{{summary2}}",
    value: `
      * Experiencing persistent fatigue for 3 weeks despite adequate sleep
      * Unintentional weight loss of 10 pounds in 1 month
      * Increased thirst and frequent urination, especially at night
      * Blurry vision, particularly when reading or using phone
      * Difficulty concentrating and weakness at work
      * Increased appetite
      * Concerned about possible diabetes or thyroid issues
      * Requesting advice on need for testing
    `,
  },
  {
    replacementToken: "{{message3}}",
    value: `Hello Dr. Patel, I hope I'm not bothering you, but I've been having some chest discomfort that's got me worried. It started about a week ago - I feel this tightness in my chest, kind of like someone's sitting on it. It comes and goes, but I've noticed it happens more when I'm walking up the stairs to my apartment or when I'm stressed at work. Sometimes it spreads to my left arm and I feel a bit of numbness there. The other day, while I was rushing to catch the bus, I got really short of breath and felt dizzy. I had to sit down for a few minutes before I felt okay again. I know I'm only 45, but my dad had a heart attack at 50, so I'm pretty anxious about this. I smoke about half a pack a day and I know I could stand to lose a few pounds. My job as a truck driver means I sit for long hours and don't get much exercise. I've been taking some antacids thinking it might be heartburn, but they don't seem to help much. My wife is really pushing me to get this checked out, especially since I've been feeling more tired than usual lately. Do you think this could be heart-related? Should I come in for an appointment, or do I need to go to the ER? I don't want to overreact, but I also don't want to ignore something serious. Thanks for your help, Dr. Patel.`,
  },
  {
    replacementToken: "{{summary3}}",
    value: `
      * Experiencing intermittent chest tightness for 1 week, worse with exertion or stress
      * Pain/numbness radiating to left arm
      * Episode of shortness of breath and dizziness after physical exertion
      * Family history of early heart attack (father at 50)
      * Current smoker (1/2 pack/day)
      * Sedentary lifestyle due to work as truck driver
      * Increased fatigue recently
      * Antacids ineffective for symptoms
      * Concerned about possible cardiac issues
      * Requesting advice on whether to schedule appointment or seek emergency care
    `,
  },
];

export const PRIORITY_FROM_PATIENT_MESSAGE_VARIABLES = [
  {
    replacementToken: "{{message1}}",
    value: `Hi Dr. Johnson, I've been having some mild stomach discomfort for the past couple of days. It's not too bad, but I'm wondering if I should make any changes to my diet or if there's anything over-the-counter I could take to help. It doesn't seem to be getting worse, just a bit annoying. Let me know what you think when you have a chance. Thanks!`,
  },
  {
    replacementToken: "{{priority1}}",
    value: "routine",
  },
  {
    replacementToken: "{{message2}}",
    value: `Hello, this is Sarah Miller. I've been having severe chest pain for the last hour. It feels like pressure in the center of my chest and it's radiating to my left arm. I'm also feeling short of breath and a bit dizzy. I'm really scared it might be a heart attack. What should I do?`,
  },
  {
    replacementToken: "{{priority2}}",
    value: "stat",
  },
  {
    replacementToken: "{{message3}}",
    value: `Good morning, I'm calling about my son Tommy. He woke up with a high fever of 103°F and has been complaining of a sore throat. He also has some red spots on his tongue and inside his cheeks. I'm worried it might be strep throat. Can we get an appointment today to have him checked out? He seems pretty miserable.`,
  },
  {
    replacementToken: "{{priority3}}",
    value: "urgent",
  }
];

export const COMMUNICATION_TOPIC_FROM_PATIENT_MESSAGE_VARIABLES = [
  {
    replacementToken: "{{message1}}",
    value: `Hello Dr. Williams, I hope this message finds you well. I've been monitoring my blood pressure as you suggested, and the readings have been consistently high over the past week, despite following the diet and exercise plan we discussed. I'm a bit concerned and wondering if we should consider adjusting my medication. Could we schedule a brief phone consultation to discuss this? I'm available most afternoons this week. Thank you for your time and guidance.`,
  },
  {
    replacementToken: "{{topic1}}",
    value: "phone-consult",
  },
  {
    replacementToken: "{{message2}}",
    value: `Dear Dr. Thompson, I wanted to give you an update on how I'm doing with the new antidepressant medication you prescribed last month. Overall, I've noticed some improvement in my mood and energy levels, which is encouraging. However, I'm experiencing some side effects, mainly dry mouth and occasional headaches. They're not severe, but I wanted to keep you informed. Is this something that typically subsides over time? Should I continue with the current dosage? I appreciate your advice and support through this process.`,
  },
  {
    replacementToken: "{{topic2}}",
    value: "progress-update",
  },
  {
    replacementToken: "{{message3}}",
    value: `Good afternoon, This is a friendly reminder that you have an upcoming appointment with Dr. Rodriguez for your annual physical examination on Monday, June 5th at 10:00 AM. Please remember to fast for at least 12 hours prior to the appointment for accurate blood work results. If you need to reschedule or have any questions, please contact our office at least 48 hours in advance. We look forward to seeing you soon!`,
  },
  {
    replacementToken: "{{topic3}}",
    value: "appointment-reminder",
  }
];

export const TASK_DESCRIPTION_FROM_PATIENT_MESSAGE_VARIABLES = [
  {
    replacementToken: "{{message1}}",
    value: `
      Hi Dr. Johnson, I've been experiencing severe headaches for the past week. They usually start in the afternoon and last for several hours. Over-the-counter pain medications aren't helping much. I'm worried because I've never had headaches this intense before. Could this be a sign of something serious? Should I come in for an appointment?
    `
  },
  {
    replacementToken: "{{taskDescription1}}",
    value: "Evaluate patient for severe headaches and schedule appointment",
  },
  {
    replacementToken: "{{message2}}",
    value: `
      Refill blood pressure medication (Lisinopril 10mg)
    `
  },
  {
    replacementToken: "{{taskDescription2}}",
    value: "Send prescription to pharmacy",
  },
  {
    replacementToken: "{{message3}}",
    value: `
      Dear Dr. Smith, I received my lab results yesterday but I'm having trouble understanding them. My cholesterol levels seem higher than last time, but I'm not sure what that means for my health. Could you please explain the results and let me know if I need to make any changes to my diet or medication? I'd appreciate your guidance.
    `,
  },
  {
    replacementToken: "{{taskDescription3}}",
    value: "Review lab results and provide guidance",
  }
];

export const TASK_CODE_FROM_PATIENT_MESSAGE_VARIABLES = [
  {
    replacementToken: "{{message1}}",
    value: `
      Hi Dr. Johnson, I wanted to let you know that the new medication you prescribed for my high blood pressure seems to be working well. My home readings have been consistently lower over the past two weeks. I haven't experienced any side effects either. Should I continue with the current dosage or do you want me to come in for a follow-up appointment? Thanks for your help!
    `,
  },
  {
    replacementToken: "{{taskCode1}}",
    value: "approve",
  },
  {
    replacementToken: "{{message2}}",
    value: `
      Hello, this is Mark Stevens. I've been taking the antibiotics for my sinus infection as prescribed, but I'm not seeing any improvement after 5 days. The headaches are still severe and I'm having trouble sleeping. Is there something else we should try or should I come in for another examination?
    `
  },
  {
    replacementToken: "{{taskCode2}}",
    value: "change",
  },
  {
    replacementToken: "{{message3}}",
    value: `
      Hi Dr. Patel, I'm calling about my son Tommy. He woke up with a high fever of 103°F and has been complaining of a sore throat. He also has some red spots on his tongue and inside his cheeks. I'm worried it might be strep throat. Can we get an appointment today to have him checked out? He seems pretty miserable.
    `
  },
  {
    replacementToken: "{{taskCode3}}",
    value: "replace",
  }
];
