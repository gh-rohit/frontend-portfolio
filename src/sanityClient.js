// src/sanityClient.js - UPDATED VERSION with Instagram Support
import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

const PROJECT_ID = '0cgtsyhj';
const DATASET = 'production';

export const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  useCdn: true,
});

// Image URL builder
const builder = createImageUrlBuilder(client);

export function urlFor(source) {
  if (!source || !source.asset) {
    console.warn('Invalid image source:', source);
    return null;
  }
  return builder.image(source);
}

// Helper function for optimized images
export function getOptimizedImageUrl(image, width = 800, height = null) {
  if (!image) return null;
  let imageBuilder = urlFor(image);
  if (width) imageBuilder = imageBuilder.width(width);
  if (height) imageBuilder = imageBuilder.height(height);
  return imageBuilder.url();
}

// ✅ NEW: Fetch Instagram URL only
export async function getInstagramUrl() {
  try {
    const query = `*[_type == "author"][0] {
      instagramUrl
    }`;
    const author = await client.fetch(query);
    return author?.instagramUrl || null;
  } catch (error) {
    console.error('Error fetching Instagram URL:', error);
    return null;
  }
}

// ✅ UPDATED: Fetch author data with Instagram
export async function getAuthorData() {
  const query = `*[_type == "author"][0] {
    name,
    role,
    profileImage,
    bio,
    shortBio,
    specialties,
    experience,
    projectsCompleted,
    happyClients,
    socialLinks,
    resumeLink,
    location,
    availableForWork,
    instagramUrl,
    instagramUsername
  }`;
  
  try {
    const author = await client.fetch(query);
    return author;
  } catch (error) {
    console.error('Error fetching author:', error);
    return null;
  }
}

// Fetch all projects
export async function getAllProjects() {
  const query = `*[_type == "project"] | order(_createdAt desc) {
    _id,
    title,
    slug,
    type,
    coverImage,
    images,
    description
  }`;
  
  try {
    const projects = await client.fetch(query);
    return projects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

// Fetch single project by slug
export async function getProjectBySlug(slug) {
  const query = `*[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    type,
    coverImage,
    images,
    description
  }`;
  
  try {
    const project = await client.fetch(query, { slug });
    return project;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}