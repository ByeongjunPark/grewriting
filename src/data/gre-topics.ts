export interface GRETopic {
  id: string;
  prompt: string;
  claim?: string;
  reason?: string;
  instruction: string;
  instructionType: 'advantageous' | 'true_false' | 'challenge' | 'claim_reason' | 'two_views' | 'consequences';
  category: string;
}

export const greTopics: GRETopic[] = [
  {
    id: "topic-1",
    prompt: "Governments should place few, if any, restrictions on scientific research and development.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the recommendation and explain your reasoning for the position you take. In developing and supporting your position, describe specific circumstances in which adopting the recommendation would or would not be advantageous and explain how these examples shape your position.",
    instructionType: "advantageous",
    category: "Government & Science"
  },
  {
    id: "topic-2",
    prompt: "The best way to teach is to praise positive actions and ignore negative ones.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the statement and explain your reasoning for the position you take. In developing and supporting your position, you should consider ways in which the statement might or might not hold true and explain how these considerations shape your position.",
    instructionType: "true_false",
    category: "Education"
  },
  {
    id: "topic-3",
    prompt: "Governments should offer college and university education free of charge to all students.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the recommendation and explain your reasoning for the position you take. In developing and supporting your position, describe specific circumstances in which adopting the recommendation would or would not be advantageous and explain how these examples shape your position.",
    instructionType: "advantageous",
    category: "Education & Government"
  },
  {
    id: "topic-4",
    prompt: "The luxuries and conveniences of contemporary life prevent people from developing into truly strong and independent individuals.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the statement and explain your reasoning for the position you take. In developing and supporting your position, you should consider ways in which the statement might or might not hold true and explain how these considerations shape your position.",
    instructionType: "true_false",
    category: "Society & Culture"
  },
  {
    id: "topic-5",
    prompt: "In any field of inquiry, the beginner is more likely than the expert to make important contributions.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the statement and explain your reasoning for the position you take. In developing and supporting your position, you should consider ways in which the statement might or might not hold true and explain how these considerations shape your position.",
    instructionType: "true_false",
    category: "Intellectual Inquiry"
  },
  {
    id: "topic-6",
    prompt: "The surest indicator of a great nation is represented not by the achievements of its rulers, artists, or scientists, but by the general welfare of its people.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the statement and explain your reasoning for the position you take. In developing and supporting your position, you should consider ways in which the statement might or might not hold true and explain how these considerations shape your position.",
    instructionType: "true_false",
    category: "Society & Politics"
  },
  {
    id: "topic-7",
    prompt: "The best way to teach — whether as an educator, employer, or parent — is to praise positive actions and ignore negative ones.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the claim. In developing and supporting your position, be sure to address the most compelling reasons and/or examples that could be used to challenge your position.",
    instructionType: "challenge",
    category: "Education"
  },
  {
    id: "topic-8",
    prompt: "Teachers' salaries should be based on their students' academic performance.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the claim. In developing and supporting your position, be sure to address the most compelling reasons and/or examples that could be used to challenge your position.",
    instructionType: "challenge",
    category: "Education & Economy"
  },
  {
    id: "topic-9",
    prompt: "Society should make efforts to save endangered species only if the potential extinction of those species is the result of human activities.",
    instruction: "Write a response in which you discuss your views on the policy and explain your reasoning for the position you take. In developing and supporting your position, you should consider the possible consequences of implementing the policy and explain how these consequences shape your position.",
    instructionType: "consequences",
    category: "Science & Environment"
  },
  {
    id: "topic-10",
    prompt: "College students should base their choice of a field of study on the availability of jobs in that field.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the claim. In developing and supporting your position, be sure to address the most compelling reasons and/or examples that could be used to challenge your position.",
    instructionType: "challenge",
    category: "Education & Economy"
  },
  {
    id: "topic-11",
    prompt: "As we acquire more knowledge, things do not become more comprehensible, but more complex and mysterious.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the statement and explain your reasoning for the position you take. In developing and supporting your position, you should consider ways in which the statement might or might not hold true and explain how these considerations shape your position.",
    instructionType: "true_false",
    category: "Intellectual Inquiry"
  },
  {
    id: "topic-12",
    prompt: "In any situation, progress requires discussion among people who have contrasting points of view.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the statement and explain your reasoning for the position you take. In developing and supporting your position, you should consider ways in which the statement might or might not hold true and explain how these considerations shape your position.",
    instructionType: "true_false",
    category: "Society & Culture"
  },
  {
    id: "topic-13",
    prompt: "Educational institutions should dissuade students from pursuing fields of study in which they are unlikely to succeed.",
    instruction: "Write a response in which you discuss your views on the policy and explain your reasoning for the position you take. In developing and supporting your position, you should consider the possible consequences of implementing the policy and explain how these consequences shape your position.",
    instructionType: "consequences",
    category: "Education"
  },
  {
    id: "topic-14",
    prompt: "Governments should not fund any scientific research whose consequences are unclear.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the recommendation and explain your reasoning for the position you take. In developing and supporting your position, describe specific circumstances in which adopting the recommendation would or would not be advantageous and explain how these examples shape your position.",
    instructionType: "advantageous",
    category: "Government & Science"
  },
  {
    id: "topic-15",
    prompt: "Society should identify those children who have special talents and provide training for them at an early age to develop their talents.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the recommendation and explain your reasoning for the position you take. In developing and supporting your position, describe specific circumstances in which adopting the recommendation would or would not be advantageous and explain how these examples shape your position.",
    instructionType: "advantageous",
    category: "Education & Society"
  },
  {
    id: "topic-16",
    prompt: "It is primarily through our identification with social groups that we define ourselves.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the statement and explain your reasoning for the position you take. In developing and supporting your position, you should consider ways in which the statement might or might not hold true and explain how these considerations shape your position.",
    instructionType: "true_false",
    category: "Society & Culture"
  },
  {
    id: "topic-17",
    prompt: "College students should be encouraged to pursue subjects that interest them rather than the courses that seem most likely to lead to jobs.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the recommendation and explain your reasoning for the position you take. In developing and supporting your position, describe specific circumstances in which adopting the recommendation would or would not be advantageous and explain how these examples shape your position.",
    instructionType: "advantageous",
    category: "Education & Economy"
  },
  {
    id: "topic-18",
    claim: "When planning courses, educators should take into account the interests and suggestions of their students.",
    reason: "Students are more motivated to learn when they are interested in what they are studying.",
    prompt: "Claim: When planning courses, educators should take into account the interests and suggestions of their students.\nReason: Students are more motivated to learn when they are interested in what they are studying.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the claim and the reason on which that claim is based.",
    instructionType: "claim_reason",
    category: "Education"
  },
  {
    id: "topic-19",
    prompt: "The greatness of individuals can be decided only by those who live after them, not by their contemporaries.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the statement and explain your reasoning for the position you take. In developing and supporting your position, you should consider ways in which the statement might or might not hold true and explain how these considerations shape your position.",
    instructionType: "true_false",
    category: "Society & Culture"
  },
  {
    id: "topic-20",
    prompt: "Students should always question what they are taught instead of accepting it passively.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the statement and explain your reasoning for the position you take. In developing and supporting your position, you should consider ways in which the statement might or might not hold true and explain how these considerations shape your position.",
    instructionType: "true_false",
    category: "Education"
  },
  {
    id: "topic-21",
    prompt: "The increasingly rapid pace of life today causes more problems than it solves.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the statement and explain your reasoning for the position you take. In developing and supporting your position, you should consider ways in which the statement might or might not hold true and explain how these considerations shape your position.",
    instructionType: "true_false",
    category: "Society & Tech"
  },
  {
    id: "topic-22",
    claim: "It is no longer possible for a society to regard any living man or woman as a hero.",
    reason: "The reputation of anyone who is subjected to media scrutiny will eventually be diminished.",
    prompt: "Claim: It is no longer possible for a society to regard any living man or woman as a hero.\nReason: The reputation of anyone who is subjected to media scrutiny will eventually be diminished.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the claim and the reason on which that claim is based.",
    instructionType: "claim_reason",
    category: "Society & Media"
  },
  {
    id: "topic-23",
    prompt: "Competition for high grades seriously limits the quality of learning at all levels of education.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the statement and explain your reasoning for the position you take. In developing and supporting your position, you should consider ways in which the statement might or might not hold true and explain how these considerations shape your position.",
    instructionType: "true_false",
    category: "Education"
  },
  {
    id: "topic-24",
    prompt: "Universities should require every student to take a variety of courses outside the student's field of study.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the recommendation and explain your reasoning for the position you take. In developing and supporting your position, describe specific circumstances in which adopting the recommendation would or would not be advantageous and explain how these examples shape your position.",
    instructionType: "advantageous",
    category: "Education"
  },
  {
    id: "topic-25",
    prompt: "Educators should find out what students want included in the curriculum and then offer it to them.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the recommendation and explain your reasoning for the position you take. In developing and supporting your position, describe specific circumstances in which adopting the recommendation would or would not be advantageous and explain how these examples shape your position.",
    instructionType: "advantageous",
    category: "Education"
  },
  {
    id: "topic-26",
    prompt: "Educators should teach facts only after their students have studied the ideas, trends, and concepts that help explain those facts.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the recommendation and explain your reasoning for the position you take. In developing and supporting your position, describe specific circumstances in which adopting the recommendation would or would not be advantageous and explain how these examples shape your position.",
    instructionType: "advantageous",
    category: "Education"
  },
  {
    id: "topic-27",
    claim: "We can usually learn much more from people whose views we share than from those whose views contradict our own.",
    reason: "Disagreement can cause stress and inhibit learning.",
    prompt: "Claim: We can usually learn much more from people whose views we share than from those whose views contradict our own.\nReason: Disagreement can cause stress and inhibit learning.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the claim and the reason on which that claim is based.",
    instructionType: "claim_reason",
    category: "Intellectual Inquiry"
  },
  {
    id: "topic-28",
    prompt: "Government officials should rely on their own judgment rather than unquestioningly carry out the will of the people they serve.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the recommendation and explain your reasoning for the position you take. In developing and supporting your position, describe specific circumstances in which adopting the recommendation would or would not be advantageous and explain how these examples shape your position.",
    instructionType: "advantageous",
    category: "Government & Politics"
  },
  {
    id: "topic-29",
    prompt: "Young people should be encouraged to pursue long-term, realistic goals rather than seek immediate fame and recognition.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the recommendation and explain your reasoning for the position you take. In developing and supporting your position, describe specific circumstances in which adopting the recommendation would or would not be advantageous and explain how these examples shape your position.",
    instructionType: "advantageous",
    category: "Society & Culture"
  },
  {
    id: "topic-30",
    prompt: "If a goal is worthy, then any means taken to attain it are justifiable.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the statement and explain your reasoning for the position you take. In developing and supporting your position, you should consider ways in which the statement might or might not hold true and explain how these considerations shape your position.",
    instructionType: "true_false",
    category: "Philosophy & Ethics"
  },
  {
    id: "topic-31",
    prompt: "In order to become well-rounded individuals, all college students should be required to take courses in which they read poetry, novels, mythology, and other types of imaginative literature.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the recommendation and explain your reasoning for the position you take. In developing and supporting your position, describe specific circumstances in which adopting the recommendation would or would not be advantageous and explain how these examples shape your position.",
    instructionType: "advantageous",
    category: "Education & Humanities"
  },
  {
    id: "topic-32",
    prompt: "In order for any work of art — for example, a film, a novel, a poem, or a song — to have merit, it must be understandable to most people.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the statement and explain your reasoning for the position you take. In developing and supporting your position, you should consider ways in which the statement might or might not hold true and explain how these considerations shape your position.",
    instructionType: "true_false",
    category: "Arts & Culture"
  },
  {
    id: "topic-33",
    prompt: "Many important discoveries or creations are accidental: it is usually while seeking the answer to one question that we come across the answer to another.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the statement and explain your reasoning for the position you take. In developing and supporting your position, you should consider ways in which the statement might or might not hold true and explain how these considerations shape your position.",
    instructionType: "true_false",
    category: "Intellectual Inquiry & Science"
  },
  {
    id: "topic-34",
    prompt: "The main benefit of the study of history is to dispel the illusion that people living now are significantly different from people who lived in earlier times.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the statement and explain your reasoning for the position you take. In developing and supporting your position, you should consider ways in which the statement might or might not hold true and explain how these considerations shape your position.",
    instructionType: "true_false",
    category: "History & Humanities"
  },
  {
    id: "topic-35",
    prompt: "Learning is primarily a matter of personal discipline; students cannot be motivated by school or college alone.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the statement and explain your reasoning for the position you take. In developing and supporting your position, you should consider ways in which the statement might or might not hold true and explain how these considerations shape your position.",
    instructionType: "true_false",
    category: "Education"
  },
  {
    id: "topic-36",
    prompt: "Scientists and other researchers should focus their research on areas that are likely to benefit the greatest number of people.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the recommendation and explain your reasoning for the position you take. In developing and supporting your position, describe specific circumstances in which adopting the recommendation would or would not be advantageous and explain how these examples shape your position.",
    instructionType: "advantageous",
    category: "Science & Society"
  },
  {
    id: "topic-37",
    prompt: "Politicians should pursue common ground and reasonable consensus rather than elusive ideals.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the recommendation and explain your reasoning for the position you take. In developing and supporting your position, describe specific circumstances in which adopting the recommendation would or would not be advantageous and explain how these examples shape your position.",
    instructionType: "advantageous",
    category: "Government & Politics"
  },
  {
    id: "topic-38",
    prompt: "People should undertake risky action only after they have carefully considered its consequences.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the recommendation and explain your reasoning for the position you take. In developing and supporting your position, describe specific circumstances in which adopting the recommendation would or would not be advantageous and explain how these examples shape your position.",
    instructionType: "advantageous",
    category: "Philosophy & Behavior"
  },
  {
    id: "topic-39",
    prompt: "Leaders are created by the demands that are placed on them.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the statement and explain your reasoning for the position you take. In developing and supporting your position, you should consider ways in which the statement might or might not hold true and explain how these considerations shape your position.",
    instructionType: "true_false",
    category: "Leadership"
  },
  {
    id: "topic-40",
    prompt: "There is little justification for society to make extraordinary efforts — especially at a great cost in money and jobs — to save endangered animal or plant species.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the statement and explain your reasoning for the position you take. In developing and supporting your position, you should consider ways in which the statement might or might not hold true and explain how these considerations shape your position.",
    instructionType: "true_false",
    category: "Science & Environment"
  },
  {
    id: "topic-41",
    prompt: "The human mind will always be superior to machines because machines are only tools of human minds.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the statement and explain your reasoning for the position you take. In developing and supporting your position, you should consider ways in which the statement might or might not hold true and explain how these considerations shape your position.",
    instructionType: "true_false",
    category: "Technology & Society"
  },
  {
    id: "topic-42",
    prompt: "People who are the most deeply committed to an idea or policy are also the most critical of it.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the statement and explain your reasoning for the position you take. In developing and supporting your position, you should consider ways in which the statement might or might not hold true and explain how these considerations shape your position.",
    instructionType: "true_false",
    category: "Intellectual Inquiry"
  },
  {
    id: "topic-43",
    prompt: "Some people believe that society should try to save every plant and animal species, despite the expense to humans in effort, time, and financial well-being. Others believe that society need not make extraordinary efforts, especially at a great cost in money and jobs, to save endangered species.",
    instruction: "Write a response in which you discuss which view more closely aligns with your own position and explain your reasoning for the position you take. In developing and supporting your position, you should address both of the views presented.",
    instructionType: "two_views",
    category: "Science & Environment"
  },
  {
    id: "topic-44",
    prompt: "Some people believe that the purpose of education is to free the mind and the spirit. Others believe that formal education tends to restrain our minds and spirits rather than set them free.",
    instruction: "Write a response in which you discuss which view more closely aligns with your own position and explain your reasoning for the position you take. In developing and supporting your position, you should address both of the views presented.",
    instructionType: "two_views",
    category: "Education"
  },
  {
    id: "topic-45",
    prompt: "Some people believe it is often necessary, even desirable, for political leaders to withhold information from the public. Others believe that the public has a right to be fully informed.",
    instruction: "Write a response in which you discuss which view more closely aligns with your own position and explain your reasoning for the position you take. In developing and supporting your position, you should address both of the views presented.",
    instructionType: "two_views",
    category: "Government & Society"
  },
  {
    id: "topic-46",
    prompt: "Some people believe that in order to thrive, a society must put its own overall success before the well-being of its individual citizens. Others believe that the well-being of a society can only be measured by the general welfare of all its people.",
    instruction: "Write a response in which you discuss which view more closely aligns with your own position and explain your reasoning for the position you take. In developing and supporting your position, you should address both of the views presented.",
    instructionType: "two_views",
    category: "Society & Politics"
  },
  {
    id: "topic-47",
    prompt: "Nations should suspend government funding for the arts when significant numbers of their citizens are hungry or unemployed.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the recommendation and explain your reasoning for the position you take. In developing and supporting your position, describe specific circumstances in which adopting the recommendation would or would not be advantageous and explain how these examples shape your position.",
    instructionType: "advantageous",
    category: "Arts & Government"
  },
  {
    id: "topic-48",
    prompt: "All parents should be required to volunteer time to their children's schools.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the recommendation and explain your reasoning for the position you take. In developing and supporting your position, describe specific circumstances in which adopting the recommendation would or would not be advantageous and explain how these examples shape your position.",
    instructionType: "advantageous",
    category: "Education & Society"
  },
  {
    id: "topic-49",
    prompt: "Colleges and universities should require their students to spend at least one semester studying in a foreign country.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the recommendation and explain your reasoning for the position you take. In developing and supporting your position, describe specific circumstances in which adopting the recommendation would or would not be advantageous and explain how these examples shape your position.",
    instructionType: "advantageous",
    category: "Education"
  },
  {
    id: "topic-50",
    prompt: "It is no longer possible for a society to regard any living man or woman as a hero.",
    instruction: "Write a response in which you discuss the extent to which you agree or disagree with the claim. In developing and supporting your position, be sure to address the most compelling reasons and/or examples that could be used to challenge your position.",
    instructionType: "challenge",
    category: "Society & Culture"
  }
];
