import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.activity.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.task.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash('Password@123', 12);

  const [superAdmin, admin, salesOne, salesTwo] = await Promise.all([
    prisma.user.create({ data: { name: 'Sophia Carter', email: 'superadmin@nexus.dev', password, role: 'SUPERADMIN', avatar: 'SC' } }),
    prisma.user.create({ data: { name: 'Daniel Kim', email: 'admin@nexus.dev', password, role: 'ADMIN', avatar: 'DK' } }),
    prisma.user.create({ data: { name: 'Maya Singh', email: 'sales@nexus.dev', password, role: 'SALES', avatar: 'MS' } }),
    prisma.user.create({ data: { name: 'Noah Williams', email: 'sales2@nexus.dev', password, role: 'SALES', avatar: 'NW' } })
  ]);

  const contacts = await Promise.all([
    prisma.contact.create({ data: { firstName: 'Ava', lastName: 'Thompson', email: 'ava@northstar.io', phone: '+1 415 555 0188', company: 'Northstar Labs', jobTitle: 'VP Operations', city: 'San Francisco', country: 'USA' } }),
    prisma.contact.create({ data: { firstName: 'Ethan', lastName: 'Miller', email: 'ethan@greengrid.co', phone: '+44 20 7946 0201', company: 'GreenGrid', jobTitle: 'Head of Growth', city: 'London', country: 'UK' } }),
    prisma.contact.create({ data: { firstName: 'Priya', lastName: 'Rao', email: 'priya@finpilot.in', phone: '+91 98765 43210', company: 'FinPilot', jobTitle: 'COO', city: 'Bengaluru', country: 'India' } }),
    prisma.contact.create({ data: { firstName: 'Liam', lastName: 'Chen', email: 'liam@bluepeak.sg', phone: '+65 6123 8877', company: 'BluePeak Systems', jobTitle: 'Director, Partnerships', city: 'Singapore', country: 'Singapore' } })
  ]);

  const leadData = [
    ['Olivia','Martin','olivia@orbitline.ai','Orbitline AI','Website','NEW',18000,salesOne.id],
    ['Lucas','Brown','lucas@meridianworks.com','Meridian Works','LinkedIn','CONTACTED',25000,salesOne.id],
    ['Emma','Wilson','emma@harborstack.io','HarborStack','Referral','QUALIFIED',32000,salesTwo.id],
    ['James','Taylor','james@latticeflow.com','LatticeFlow','Conference','NEW',15000,salesTwo.id],
    ['Mia','Anderson','mia@brightpath.co','BrightPath','Website','CONVERTED',42000,salesOne.id],
    ['Henry','Lee','henry@oakandco.com','Oak & Co','Cold Outreach','LOST',12000,salesTwo.id]
  ];

  const leads = [];
  for (const [firstName,lastName,email,company,source,status,value,ownerId] of leadData) {
    leads.push(await prisma.lead.create({ data: { firstName,lastName,email,company,source,status,value,ownerId } }));
  }

  const dealData = [
    ['Northstar Enterprise Rollout','Northstar Labs',78000,'NEGOTIATION',75,contacts[0].id,salesOne.id,18],
    ['GreenGrid Revenue Suite','GreenGrid',46000,'PROPOSAL',55,contacts[1].id,salesOne.id,31],
    ['FinPilot Team License','FinPilot',62000,'QUALIFICATION',35,contacts[2].id,salesTwo.id,44],
    ['BluePeak CRM Migration','BluePeak Systems',91000,'WON',100,contacts[3].id,salesTwo.id,-9],
    ['Orbitline Starter','Orbitline AI',22000,'PROSPECTING',15,null,salesOne.id,61]
  ];

  const deals = [];
  for (const [title,company,value,stage,probability,contactId,ownerId,days] of dealData) {
    deals.push(await prisma.deal.create({ data: { title,company,value,stage,probability,contactId,ownerId,closeDate: new Date(Date.now() + days * 86400000) } }));
  }

  const tasks = [
    ['Follow up on Northstar proposal','Send revised pricing and implementation timeline',1,'HIGH','IN_PROGRESS',salesOne.id],
    ['Prepare GreenGrid demo','Customize demo workspace around revenue operations',2,'MEDIUM','TODO',salesOne.id],
    ['FinPilot discovery call','Capture reporting and permissions requirements',3,'HIGH','TODO',salesTwo.id],
    ['Update quarterly pipeline','Review stale opportunities and close dates',5,'MEDIUM','TODO',admin.id],
    ['Publish sales onboarding course','Review final lesson content and enable publishing',7,'LOW','IN_PROGRESS',admin.id]
  ];
  for (const [title,description,days,priority,status,assigneeId] of tasks) {
    await prisma.task.create({ data: { title,description,dueDate:new Date(Date.now()+days*86400000),priority,status,assigneeId } });
  }

  const salesCourse = await prisma.course.create({
    data: {
      title: 'Modern Consultative Selling', slug: 'modern-consultative-selling', description: 'A practical sales enablement course covering discovery, qualification, value messaging, and deal progression.', category: 'Sales', level: 'Intermediate', published: true, creatorId: admin.id,
      lessons: { create: [
        { title: 'Discovery That Creates Trust', content: 'Use open questions, confirm business outcomes, and document measurable pain points before discussing solutions.', position: 1, duration: 14 },
        { title: 'Qualification Framework', content: 'Evaluate need, authority, timing, value, and risk with evidence from the customer conversation.', position: 2, duration: 18 },
        { title: 'Building a Business Case', content: 'Translate product capabilities into customer outcomes, implementation milestones, and financial impact.', position: 3, duration: 20 }
      ] }
    }
  });

  const crmCourse = await prisma.course.create({
    data: {
      title: 'CRM Fundamentals', slug: 'crm-fundamentals', description: 'Learn clean pipeline hygiene, account notes, task planning, and activity tracking.', category: 'Operations', level: 'Beginner', published: true, creatorId: superAdmin.id,
      lessons: { create: [
        { title: 'Clean Data, Better Decisions', content: 'A CRM is only as useful as the quality and freshness of the information stored inside it.', position: 1, duration: 10 },
        { title: 'Pipeline Hygiene', content: 'Keep stages, values, owners, and close dates aligned to the latest customer evidence.', position: 2, duration: 12 }
      ] }
    }
  });

  const leadershipCourse = await prisma.course.create({
    data: { title: 'Sales Leadership Essentials', slug: 'sales-leadership-essentials', description: 'Coaching and forecasting practices for growing revenue teams.', category: 'Leadership', level: 'Advanced', published: false, creatorId: superAdmin.id }
  });

  await prisma.enrollment.createMany({ data: [
    { userId: salesOne.id, courseId: salesCourse.id, progress: 67, status: 'ACTIVE' },
    { userId: salesTwo.id, courseId: salesCourse.id, progress: 100, status: 'COMPLETED', completedAt: new Date() },
    { userId: salesOne.id, courseId: crmCourse.id, progress: 100, status: 'COMPLETED', completedAt: new Date() },
    { userId: salesTwo.id, courseId: crmCourse.id, progress: 50, status: 'ACTIVE' },
    { userId: admin.id, courseId: leadershipCourse.id, progress: 25, status: 'ACTIVE' }
  ]});

  await prisma.activity.createMany({ data: [
    { type: 'DEAL', message: 'Moved Northstar Enterprise Rollout to Negotiation', userId: salesOne.id, dealId: deals[0].id },
    { type: 'LEAD', message: 'Qualified Emma Wilson from HarborStack', userId: salesTwo.id, leadId: leads[2].id },
    { type: 'LMS', message: 'Completed CRM Fundamentals', userId: salesOne.id },
    { type: 'DEAL', message: 'Won BluePeak CRM Migration', userId: salesTwo.id, dealId: deals[3].id },
    { type: 'LEAD', message: 'Added Olivia Martin from website inquiry', userId: salesOne.id, leadId: leads[0].id }
  ]});

  console.log('Seed complete. Demo password: Password@123');
  console.log('Users:', [superAdmin.email, admin.email, salesOne.email, salesTwo.email].join(', '));
}

main().catch((error) => { console.error(error); process.exit(1); }).finally(async () => prisma.$disconnect());
