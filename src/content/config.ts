import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    github: z.string().url(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    date: z.date()
  })
});

const notes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    section: z.string(),
    date: z.date(),
    tags: z.array(z.string()).optional()
  })
});

const writeups = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    platform: z.enum(['TryHackMe', 'HackTheBox', 'Other']),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']),
    date: z.date(),
    tags: z.array(z.string()).optional()
  })
});

export const collections = {
  projects,
  notes,
  writeups
};