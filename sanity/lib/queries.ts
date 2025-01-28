import { defineQuery } from "next-sanity";

export const PROJECTS_QUERY = 
defineQuery(
  `*[_type == "project" && defined(slug.current) && !defined($search) || title match $search || category match $search || batch match $search || author->name match $search] | order(_createdAt desc){
  _id,
  title,
  slug,
  batch,
  _createdAt,
  author -> {
    _id,
    name,
    image,
    bio,
    batch,
  },
  views,
  description,
  category,
  image,
  pitch,
}`
);

export const PROJECT_BY_ID_QUERY = 
defineQuery(
  `*[_type == "project" && _id == $id ][0]{
  _id, 
  title, 
  slug,
  batch,
  depot,
  _createdAt,
  author -> {
    _id,
    name,
    username,
    image,
    bio,
  },
  views, 
  description,
  category,
  image,
  pitch,
}`
);

export const AUTHOR_BY_ID_QUERY = 
defineQuery(
  `*[_type == "author" && _id == $id][0]{
  _id,
  id,
  name,
  username,
  startup -> {
    batch,
  },
  email,
  image,
  bio,
}`
);

export const AUTHOR_BY_GITHUB_ID_QUERY = defineQuery(`
*[_type == "author" && id == $id][0]{
    _id,
    id,
    name,
    username,
    email,
    image,
    bio
}
`);


export const PROJECTS_BY_AUTHOR_QUERY =
  defineQuery(`*[_type == "project" && author._ref == $id] | order(_createdAt desc) {
  _id, 
  title, 
  slug,
  _createdAt,
  batch,
  author -> {
    _id, name, image, bio
  }, 
  views,
  description,
  category,
  image,
}`);

export const PROJECT_VIEW_QUERY = 
defineQuery(
  `*[_type == "project" && _id == $id ][0]{
  _id,
  views
}`
);

export const BATCHES_BY_AUTHOR_QUERY = 
defineQuery(
  `*[_type == "project" && author._ref == $id] | order(batch asc) {
  batch,
}`
);

export const PLAYLIST_BY_BATCH_QUERY =
  defineQuery(`*[_type == "project" && batch == $batch && _id != $id] | order(_createdAt desc) {
  _id, 
  title, 
  slug,
  _createdAt,
  batch,
  author -> {
    _id, name, image, bio
  }, 
  views,
  description,
  category,
  image,
}`);


